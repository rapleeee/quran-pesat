import { HaditsCard } from "@/components/menu/hadits/hadits-card";
import { useHaditsBookmark } from "@/hooks/hadits/use-hadits-bookmark";
import { useHadits } from "@/hooks/hadits/use-hadits";
import { useFocusEffect } from "@react-navigation/native";
import { HaditsItem } from "@/types/hadits";
import { router } from "expo-router";
import { ArrowLeft, Bookmark, Search, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HaditsScreen() {
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { items, loading, error, isSearching, refetch } = useHadits(query);
  const { isBookmarked, toggleBookmark, refreshBookmarks } = useHaditsBookmark();

  const emptyTitle = useMemo(() => {
    if (isSearching) {
      return `Tidak ada hasil untuk "${query.trim()}".`;
    }
    return "Belum ada data hadits.";
  }, [isSearching, query]);

  const emptySubtitle = useMemo(() => {
    if (isSearching) {
      return "Coba kata kunci lain untuk judul hadits.";
    }
    return "Tarik ke bawah atau tekan refresh untuk memuat ulang.";
  }, [isSearching]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void refreshBookmarks();
    }, [refreshBookmarks]),
  );

  const handleToggleBookmark = async (item: HaditsItem) => {
    const added = await toggleBookmark(item);
    Alert.alert(
      "Bookmark Hadits",
      added ? "Hadits berhasil disimpan ke bookmark." : "Hadits dihapus dari bookmark.",
    );
  };

  const openDetail = (item: HaditsItem) => {
    router.push(`/hadits/${item.nomor}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#728d8d" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc]">Hadits</Text>
        <TouchableOpacity
          onPress={() => router.push("/hadits-bookmark")}
          className="h-11 px-3 flex-row items-center justify-center gap-1"
        >
          <Bookmark size={24} color="#336363" />
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-3 pb-2">
        <View className="min-h-[44px] rounded-xl border border-[#d8d8d8] dark:border-[#374151] bg-white dark:bg-[#111827] px-3 flex-row items-center">
          <Search size={18} color="#6b7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Cari judul hadits..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-[#1f2937] dark:text-[#e5e7eb] py-2"
            returnKeyType="search"
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

      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#728d8d" />
          <Text className="text-[#728d8d] text-xs mt-2">
            {isSearching ? "Mencari hadits..." : "Memuat hadits..."}
          </Text>
        </View>
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
          data={items}
          keyExtractor={(item) => item.nomor}
          renderItem={({ item }) => (
            <HaditsCard
              item={item}
              isBookmarked={isBookmarked(item)}
              onPress={openDetail}
              onToggleBookmark={(haditsItem) => void handleToggleBookmark(haditsItem)}
            />
          )}
          ListEmptyComponent={
            <View className="px-6 py-16 items-center">
              <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-center font-semibold">{emptyTitle}</Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-center text-xs mt-2">{emptySubtitle}</Text>
            </View>
          }
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void handleRefresh()}
              tintColor="#728d8d"
              colors={["#728d8d"]}
            />
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}
