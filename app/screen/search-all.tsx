import { FeatureStatusBadge } from "@/components/feature-status-badge";
import {
  getFeatureStatusByRoute,
  getFeatureWarningByRoute,
} from "@/data/feature-status";
import { menuItems } from "@/data/menu-beranda";
import { searchCatalog } from "@/data/search-catalog";
import { useAllSurah } from "@/hooks/quran/use-quran";
import { router } from "expo-router";
import { ArrowLeft, Search, Sparkles } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchItem =
  | {
      id: string;
      title: string;
      subtitle: string;
      route: string;
      type: "menu";
    }
  | {
      id: string;
      title: string;
      subtitle: string;
      route: string;
      type: "feature";
    }
  | {
      id: string;
      title: string;
      subtitle: string;
      route: string;
      type: "surah";
    };

type MatchTier = 0 | 1 | 2 | 3;

type RankedSearchItem = SearchItem & {
  score: number;
  matchTier: MatchTier;
  typeRank: number;
};

const TYPE_RANK: Record<SearchItem["type"], number> = {
  menu: 3,
  feature: 2,
  surah: 1,
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getMatchTier(text: string, query: string): MatchTier {
  if (!text || !query) {
    return 0;
  }

  if (text === query) {
    return 3;
  }

  const textTokens = text.split(" ");
  if (textTokens.some((token) => token === query)) {
    return 3;
  }

  if (text.startsWith(query)) {
    return 2;
  }

  if (textTokens.some((token) => token.startsWith(query))) {
    return 2;
  }

  if (text.includes(query)) {
    return 1;
  }

  return 0;
}

function getTierScore(tier: MatchTier): number {
  switch (tier) {
    case 3:
      return 120;
    case 2:
      return 80;
    case 1:
      return 40;
    default:
      return 0;
  }
}

function rankSearchItem(
  item: SearchItem,
  query: string,
  fields: string[],
): RankedSearchItem | null {
  const normalizedFields = fields.map((field) => normalize(field));
  const titleTier = getMatchTier(normalize(item.title), query);
  const subtitleTier = getMatchTier(normalize(item.subtitle), query);
  const extraTier = normalizedFields.reduce<MatchTier>(
    (highestTier, field) => {
      const nextTier = getMatchTier(field, query);
      return nextTier > highestTier ? nextTier : highestTier;
    },
    0,
  );

  const matchTier = Math.max(titleTier, subtitleTier, extraTier) as MatchTier;
  if (matchTier === 0) {
    return null;
  }

  const titleScore = getTierScore(titleTier) * 3;
  const subtitleScore = getTierScore(subtitleTier);
  const extraScore = normalizedFields.reduce((score, field) => {
    return score + getTierScore(getMatchTier(field, query));
  }, 0);
  const typeRank = TYPE_RANK[item.type];
  const score = titleScore + subtitleScore + extraScore + typeRank * 12;

  return {
    ...item,
    score,
    matchTier,
    typeRank,
  };
}

function compareRankedItems(a: RankedSearchItem, b: RankedSearchItem): number {
  if (b.matchTier !== a.matchTier) {
    return b.matchTier - a.matchTier;
  }

  if (b.typeRank !== a.typeRank) {
    return b.typeRank - a.typeRank;
  }

  if (b.score !== a.score) {
    return b.score - a.score;
  }

  return a.title.localeCompare(b.title, "id-ID");
}

function SearchRow({ item }: { item: SearchItem }) {
  const status = getFeatureStatusByRoute(item.route);

  const handlePress = () => {
    const warning = getFeatureWarningByRoute(item.route);
    if (warning) {
      Alert.alert(warning.title, warning.message);
      return;
    }

    router.push(item.route as never);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="px-4 py-3 bg-white dark:bg-[#111827] border-b border-[#f0f0f0] dark:border-[#1f2937]"
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-[#728d8d]/20 items-center justify-center mr-3">
          {item.type === "surah" ? (
            <Text className="text-[#728d8d] text-xs font-bold">QS</Text>
          ) : (
            <Sparkles size={14} color="#728d8d" />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-[#363636] dark:text-[#f8fafc] font-semibold">{item.title}</Text>
          <Text className="text-gray-500 dark:text-[#cbd5e1] text-xs">{item.subtitle}</Text>
          {status !== "active" ? <FeatureStatusBadge status={status} /> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchAllScreen() {
  const [query, setQuery] = useState("");
  const { surahs, loading } = useAllSurah();

  const results = useMemo<SearchItem[]>(() => {
    const q = normalize(query);
    if (!q) {
      return [];
    }

    const menuResults = menuItems
      .filter((item) => !!item.route)
      .map((item) =>
        rankSearchItem(
          {
            id: `menu-${item.id}`,
            title: item.label,
            subtitle: "Menu",
            route: item.route as string,
            type: "menu",
          },
          q,
          [item.label],
        ),
      )
      .filter((item): item is RankedSearchItem => item !== null);

    const featureResults = searchCatalog
      .map((item) =>
        rankSearchItem(
          {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            route: item.route,
            type: "feature",
          },
          q,
          item.keywords,
        ),
      )
      .filter((item): item is RankedSearchItem => item !== null);

    const surahResults = surahs
      .map((item) =>
        rankSearchItem(
          {
            id: `surah-${item.nomor}`,
            title: `${item.nomor}. ${item.nama_latin}`,
            subtitle: `${item.arti} • ${item.jumlah_ayat} ayat`,
            route: `/screen/surah/${item.nomor}`,
            type: "surah",
          },
          q,
          [item.nama_latin, item.nama, item.arti, item.nomor.toString()],
        ),
      )
      .filter((item): item is RankedSearchItem => item !== null);

    const merged = [...featureResults, ...menuResults, ...surahResults].sort(
      compareRankedItems,
    );
    const uniqueMap = new Map<string, RankedSearchItem>();
    for (const item of merged) {
      const uniqueKey = `${item.route}-${item.title}`;
      if (!uniqueMap.has(uniqueKey)) {
        uniqueMap.set(uniqueKey, item);
      }
    }

    return Array.from(uniqueMap.values()).map(
      ({ score, matchTier, typeRank, ...rest }) => rest,
    );
  }, [query, surahs]);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] bg-[#fbf5ea] dark:bg-[#0b1220]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#728d8d" />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center bg-white dark:bg-[#111827] rounded-xl px-3 py-2 border border-[#e5e5e5] dark:border-[#1f2937]">
            <Search size={18} color="#9ca3af" />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Cari surat, doa, artikel, menu..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-[#363636] dark:text-[#f8fafc]"
            />
          </View>
        </View>
      </View>

      {loading && query.length > 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#728d8d" />
          <Text className="text-gray-500 dark:text-[#cbd5e1] mt-2">Memuat data pencarian...</Text>
        </View>
      ) : query.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 dark:text-[#cbd5e1] text-center">
            Ketik kata kunci untuk mencari surah, doa, artikel, hadits, dan menu.
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 dark:text-[#cbd5e1] text-center">Hasil tidak ditemukan.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchRow item={item} />}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
