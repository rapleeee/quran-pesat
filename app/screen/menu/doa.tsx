import { DoaCard } from "@/components/menu/doa/doa-card";
import { useDoaFavorites } from "@/hooks/doa/use-doa-favorites";
import { useDoaHarian } from "@/hooks/doa/use-doa-harian";
import { DoaHarianItem } from "@/types/doa";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, RefreshCw, Search, X } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Clipboard,
  FlatList,
  RefreshControl,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getMatchTier(text: string, query: string): number {
  if (!query || !text) {
    return 0;
  }
  if (text === query) {
    return 3;
  }
  if (text.startsWith(query)) {
    return 2;
  }
  if (text.includes(query)) {
    return 1;
  }
  return 0;
}

function buildDoaMessage(item: DoaHarianItem): string {
  return `${item.title}\n\n${item.arabic}\n\n${item.latin}\n\n${item.translation}`;
}

function formatLastSync(lastSyncedAt: string | null): string {
  if (!lastSyncedAt) {
    return "-";
  }

  return new Date(lastSyncedAt).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SmoothSkeletonCard() {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className="mx-4 mb-3 rounded-2xl bg-[#e9e4d8] dark:bg-[#1f2937] border border-[#e5e5e5] dark:border-[#1f2937] p-4"
    >
      <View className="h-4 w-44 rounded bg-[#d9d2c3]" />
      <View className="h-3 w-60 rounded bg-[#d9d2c3] mt-2" />
      <View className="h-3 w-52 rounded bg-[#d9d2c3] mt-2" />
    </Animated.View>
  );
}

function LoadingCards() {
  return (
    <View className="mt-2">
      {[1, 2, 3, 4].map((key) => (
        <SmoothSkeletonCard key={key} />
      ))}
    </View>
  );
}

export default function DoaHarianScreen() {
  const { items, loading, error, isUsingCache, lastSyncedAt, refetch } =
    useDoaHarian();
  const { favoriteIds, isFavorite, toggleFavorite } = useDoaFavorites();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const rankedItems = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      return items;
    }

    return items
      .map((item) => {
        const titleTier = getMatchTier(normalize(item.title), normalizedQuery);
        const translationTier = getMatchTier(
          normalize(item.translation),
          normalizedQuery,
        );
        const latinTier = getMatchTier(normalize(item.latin), normalizedQuery);

        if (titleTier === 0 && translationTier === 0 && latinTier === 0) {
          return null;
        }

        const score = titleTier * 100 + translationTier * 35 + latinTier * 30;

        return { item, score, titleTier };
      })
      .filter(
        (
          rankedItem,
        ): rankedItem is { item: DoaHarianItem; score: number; titleTier: number } =>
          rankedItem !== null,
      )
      .sort((a, b) => {
        if (b.titleTier !== a.titleTier) {
          return b.titleTier - a.titleTier;
        }
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.item.title.localeCompare(b.item.title, "id-ID");
      })
      .map((rankedItem) => rankedItem.item);
  }, [items, query]);

  const filteredItems = useMemo(() => {
    const baseItems = rankedItems;
    if (activeTab === "favorites") {
      return baseItems.filter((item) => isFavorite(item.id));
    }
    return baseItems;
  }, [activeTab, isFavorite, rankedItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const ok = await refetch();
      await Haptics.notificationAsync(
        ok
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning,
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleFavorite = async (item: DoaHarianItem) => {
    const added = await toggleFavorite(item.id);
    await Haptics.selectionAsync();
    if (added) {
      Alert.alert("Favorit", `"${item.title}" ditambahkan ke favorit.`);
      return;
    }
    Alert.alert("Favorit", `"${item.title}" dihapus dari favorit.`);
  };

  const handleCopyDoa = (item: DoaHarianItem) => {
    Clipboard.setString(buildDoaMessage(item));
    Alert.alert("Tersalin", `Doa "${item.title}" berhasil disalin.`);
  };

  const handleShareDoa = async (item: DoaHarianItem) => {
    try {
      await Share.share({ message: buildDoaMessage(item) });
    } catch {
      Alert.alert("Gagal", "Belum bisa membagikan doa saat ini.");
    }
  };

  const handleCardLongPress = (item: DoaHarianItem) => {
    Alert.alert(item.title, "Aksi cepat", [
      { text: "Copy", onPress: () => handleCopyDoa(item) },
      { text: "Share", onPress: () => void handleShareDoa(item) },
      {
        text: isFavorite(item.id) ? "Hapus Favorit" : "Jadikan Favorit",
        onPress: () => void handleToggleFavorite(item),
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const openDetail = (item: DoaHarianItem) => {
    router.push(`/doa/${item.id}`);
  };

  const emptyTitle = useMemo(() => {
    if (activeTab === "favorites" && favoriteIds.length === 0) {
      return "Belum ada doa favorit.";
    }
    if (activeTab === "favorites" && query.trim()) {
      return `Tidak ada doa favorit yang cocok untuk "${query.trim()}".`;
    }
    if (query.trim()) {
      return `Tidak ada hasil untuk "${query.trim()}".`;
    }
    return "Belum ada data doa harian.";
  }, [activeTab, favoriteIds.length, query]);

  const emptySubtitle = useMemo(() => {
    if (activeTab === "favorites") {
      return "Tekan ikon bintang di kartu doa untuk menyimpan favorit.";
    }
    if (query.trim()) {
      return "Coba kata kunci lain seperti judul doa atau arti terjemahannya.";
    }
    return "Tarik ke bawah untuk memuat ulang data dari server.";
  }, [activeTab, query]);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#728d8d" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc]">Doa Harian</Text>
        <TouchableOpacity
          onPress={() => void handleRefresh()}
          className="w-11 h-11 items-center justify-center"
        >
          <RefreshCw size={18} color="#728d8d" />
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-3 pb-2">
        <View className="min-h-[44px] rounded-xl border border-[#d8d8d8] dark:border-[#374151] bg-white dark:bg-[#111827] px-3 flex-row items-center">
          <Search size={18} color="#6b7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Cari judul, arti, latin..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-[#1f2937] dark:text-[#e5e7eb] py-2"
          />
          {query.length > 0 ? (
            <TouchableOpacity
              onPress={() => setQuery("")}
              className="w-8 h-8 items-center justify-center"
            >
              <X size={16} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View className="px-4 pb-2 flex-row gap-2">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`px-4 min-h-[36px] rounded-full items-center justify-center ${
            activeTab === "all" ? "bg-[#728d8d]" : "bg-white dark:bg-[#111827] border border-[#d8d8d8] dark:border-[#374151]"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              activeTab === "all" ? "text-white" : "text-[#4b5563] dark:text-[#cbd5e1]"
            }`}
          >
            Semua
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("favorites")}
          className={`px-4 min-h-[36px] rounded-full items-center justify-center ${
            activeTab === "favorites"
              ? "bg-[#728d8d]"
              : "bg-white dark:bg-[#111827] border border-[#d8d8d8] dark:border-[#374151]"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              activeTab === "favorites" ? "text-white" : "text-[#4b5563] dark:text-[#cbd5e1]"
            }`}
          >
            Favorit ({favoriteIds.length})
          </Text>
        </TouchableOpacity>
      </View>

      {isUsingCache ? (
        <View className="mx-4 mb-2 rounded-xl bg-amber-100 border border-amber-200 px-3 py-2">
          <Text className="text-amber-800 text-xs">
            Mode offline aktif • sinkron terakhir {formatLastSync(lastSyncedAt)}
          </Text>
        </View>
      ) : null}

      {error && items.length > 0 ? (
        <View className="mx-4 mb-2 rounded-xl bg-red-100 border border-red-200 px-3 py-2">
          <Text className="text-red-700 text-xs">{error}</Text>
        </View>
      ) : null}

      {loading && items.length === 0 ? (
        <>
          <View className="items-center py-3">
            <ActivityIndicator size="small" color="#728d8d" />
            <Text className="text-[#728d8d] text-xs mt-1">Memuat doa harian...</Text>
          </View>
          <LoadingCards />
        </>
      ) : error && items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">{error}</Text>
          <TouchableOpacity
            onPress={() => void handleRefresh()}
            className="mt-3 px-4 py-2 rounded-lg bg-[#728d8d]"
          >
            <Text className="text-white text-sm font-medium">Coba lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoaCard
              item={item}
              query={query}
              isFavorite={isFavorite(item.id)}
              onPress={openDetail}
              onLongPress={handleCardLongPress}
              onToggleFavorite={(doaItem) => void handleToggleFavorite(doaItem)}
            />
          )}
          ListEmptyComponent={
            <View className="px-6 py-16 items-center">
              <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-center font-semibold">
                {emptyTitle}
              </Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-center text-xs mt-2">
                {emptySubtitle}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void handleRefresh()}
              tintColor="#728d8d"
              colors={["#728d8d"]}
            />
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
