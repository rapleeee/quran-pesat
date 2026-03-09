import { DzikirCard } from "@/components/menu/dzikir/dzikir-card";
import { DzikirCategoryTabs } from "@/components/menu/dzikir/dzikir-category-tabs";
import { DzikirDetailSheet } from "@/components/menu/dzikir/dzikir-detail-sheet";
import { DzikirDuhaPlaceholder } from "@/components/menu/dzikir/dzikir-duha-placeholder";
import { DzikirScreenHeader } from "@/components/menu/dzikir/dzikir-screen-header";
import { DzikirTypeTabs } from "@/components/menu/dzikir/dzikir-type-filter";
import { DzikirCategory } from "@/data/dzikir";
import { useDzikirBookmark } from "@/hooks/dzikir/use-dzikir-bookmark";
import { useDzikirDetailActions } from "@/hooks/dzikir/use-dzikir-detail-actions";
import { useDzikirHarian } from "@/hooks/dzikir/use-dzikir-harian";
import { useDzikirSpeech } from "@/hooks/dzikir/use-dzikir-speech";
import { DzikirTypeFilter } from "@/types/dzikir";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { Bookmark } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DzikirScreen() {
  const [activeCategory, setActiveCategory] = useState<DzikirCategory>("harian");
  const [activeType, setActiveType] = useState<DzikirTypeFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const { items, loading, error, refetch } = useDzikirHarian(activeType);
  const { isBookmarked, toggleBookmark, refreshBookmarks } = useDzikirBookmark();
  const { isSpeaking, speakArabic, stopSpeech } = useDzikirSpeech();
  const {
    selectedItem,
    isDetailVisible,
    selectedIsBookmarked,
    openDetail,
    closeDetail,
    handleCopy,
    handleShare,
    handleToggleBookmark,
    handleToggleSpeech,
  } = useDzikirDetailActions({
    isBookmarked,
    toggleBookmark,
    isSpeaking,
    speakArabic,
    stopSpeech,
    onOpenVoiceGuide: () => router.push("/voice-arab-guide"),
  });

  const filteredItems = useMemo(() => {
    if (activeType === "all") {
      return items;
    }
    return items.filter((item) => item.type === activeType);
  }, [activeType, items]);

  const handleCategoryChange = useCallback(
    (category: DzikirCategory) => {
      if (category === "duha" && activeCategory !== "duha") {
        Alert.alert(
          "Fitur Sedang Develop",
          "Dzikir Duha sedang dalam tahap pengembangan.",
        );
      }
      setActiveCategory(category);
    },
    [activeCategory],
  );

  useFocusEffect(
    useCallback(() => {
      void refreshBookmarks();
    }, [refreshBookmarks]),
  );

  const handleRefresh = async () => {
    if (activeCategory !== "harian") {
      return;
    }

    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top", "bottom"]}>
      <DzikirScreenHeader
        title="Dzikir"
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push("/dzikir-bookmark")}
            className="h-11 px-3 flex-row items-center justify-center gap-1"
          >
            <Bookmark size={24} color="#336363" />
          </TouchableOpacity>
        }
      />

      <DzikirCategoryTabs
        activeCategory={activeCategory}
        onChange={handleCategoryChange}
      />

      {activeCategory === "harian" ? (
        <>
          <DzikirTypeTabs activeType={activeType} onChange={setActiveType} />

          {loading && items.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color="#728d8d" />
              <Text className="text-[#728d8d] text-xs mt-2">Memuat dzikir harian...</Text>
            </View>
          ) : error ? (
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
                <DzikirCard
                  item={item}
                  isBookmarked={isBookmarked(item)}
                  onPress={openDetail}
                  onToggleBookmark={(dzikirItem) => void handleToggleBookmark(dzikirItem)}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => void handleRefresh()}
                  tintColor="#728d8d"
                  colors={["#728d8d"]}
                />
              }
              ListEmptyComponent={
                <View className="px-6 py-16 items-center">
                  <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-center font-semibold">
                    Data dzikir belum tersedia.
                  </Text>
                  <Text className="text-[#6b7280] dark:text-[#94a3b8] text-center text-xs mt-2">
                    Coba ganti filter tipe atau tarik ke bawah untuk memuat ulang.
                  </Text>
                </View>
              }
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      ) : (
        <DzikirDuhaPlaceholder />
      )}

      <DzikirDetailSheet
        visible={isDetailVisible}
        item={selectedItem}
        isBookmarked={selectedIsBookmarked}
        isSpeaking={isSpeaking}
        onClose={closeDetail}
        onToggleSpeech={handleToggleSpeech}
        onToggleBookmark={() => {
          if (selectedItem) {
            void handleToggleBookmark(selectedItem);
          }
        }}
        onCopy={handleCopy}
        onShare={() => void handleShare()}
      />
    </SafeAreaView>
  );
}
