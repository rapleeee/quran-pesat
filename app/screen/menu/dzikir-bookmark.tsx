import { DzikirCard } from "@/components/menu/dzikir/dzikir-card";
import { DzikirDetailSheet } from "@/components/menu/dzikir/dzikir-detail-sheet";
import { DzikirScreenHeader } from "@/components/menu/dzikir/dzikir-screen-header";
import { useDzikirBookmark } from "@/hooks/dzikir/use-dzikir-bookmark";
import { useDzikirDetailActions } from "@/hooks/dzikir/use-dzikir-detail-actions";
import { useDzikirSpeech } from "@/hooks/dzikir/use-dzikir-speech";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DzikirBookmarkScreen() {
  const { bookmarks, loading, isBookmarked, toggleBookmark, refreshBookmarks } =
    useDzikirBookmark();
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

  useFocusEffect(
    useCallback(() => {
      void refreshBookmarks();
    }, [refreshBookmarks]),
  );

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <DzikirScreenHeader
        title="Bookmark Dzikir"
        onBack={() => router.back()}
        backIconSize={20}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#728d8d" />
          <Text className="text-[#728d8d] text-xs mt-2">Memuat bookmark...</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => `${item.type}-${item.id}-${item.arabic}`}
          renderItem={({ item }) => (
            <DzikirCard
              item={item}
              isBookmarked={isBookmarked(item)}
              onPress={openDetail}
              onToggleBookmark={(dzikirItem) => void handleToggleBookmark(dzikirItem)}
            />
          )}
          ListEmptyComponent={
            <View className="px-6 py-16 items-center">
              <Text className="text-[#4b5563] text-center font-semibold">
                Belum ada bookmark dzikir.
              </Text>
              <Text className="text-[#6b7280] text-center text-xs mt-2">
                Kembali ke halaman dzikir lalu tekan ikon bookmark pada item.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
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
