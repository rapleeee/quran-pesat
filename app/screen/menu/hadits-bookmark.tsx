import { HaditsCard } from "@/components/menu/hadits/hadits-card";
import { useHaditsBookmark } from "@/hooks/hadits/use-hadits-bookmark";
import { HaditsItem } from "@/types/hadits";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HaditsBookmarkScreen() {
  const { bookmarks, loading, isBookmarked, toggleBookmark, refreshBookmarks } =
    useHaditsBookmark();

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
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc]">Bookmark Hadits</Text>
        <View className="w-11 h-11" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#728d8d" />
          <Text className="text-[#728d8d] text-xs mt-2">Memuat bookmark...</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => `${item.nomor}-${item.title}`}
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
              <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-center font-semibold">
                Belum ada bookmark hadits.
              </Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-center text-xs mt-2">
                Buka halaman hadits lalu tekan tombol simpan pada item.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
