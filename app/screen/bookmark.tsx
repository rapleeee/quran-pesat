import { useBookmark } from "@/hooks/quran/use-bookmark";
import { Bookmark } from "@/types/quran";
import { router } from "expo-router";
import { ArrowLeft, BookmarkX, Trash2 } from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function BookmarkItem({
  bookmark,
  onRemove,
  onPress,
}: {
  bookmark: Bookmark;
  onRemove: () => void;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-4 py-4 border-b border-[#e5e5e5] dark:border-[#1f2937] bg-white dark:bg-[#111827] mx-4 mb-2 rounded-xl"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-[#728d8d] items-center justify-center mr-2">
            <Text className="text-white text-xs font-bold">
              {bookmark.ayatNomor}
            </Text>
          </View>
          <View>
            <Text className="font-semibold text-[#363636] dark:text-[#f8fafc]">
              {bookmark.surahNamaLatin}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-[#cbd5e1]">
              Ayat {bookmark.ayatNomor}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2"
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <Text className="text-right text-xl leading-loose text-[#363636] dark:text-[#f8fafc] mb-2 font-arabic">
        {bookmark.ayatAr}
      </Text>
      <Text className="text-[#666666] text-sm leading-5" numberOfLines={2}>
        {bookmark.ayatIdn}
      </Text>
    </TouchableOpacity>
  );
}

export default function BookmarkScreen() {
  const { bookmarks, loading, removeBookmark, clearAllBookmarks } =
    useBookmark();

  const handleRemove = (id: string) => {
    Alert.alert("Hapus Bookmark", "Yakin ingin menghapus bookmark ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeBookmark(id),
      },
    ]);
  };

  const handleClearAll = () => {
    if (bookmarks.length === 0) return;
    Alert.alert(
      "Hapus Semua Bookmark",
      "Yakin ingin menghapus semua bookmark?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: () => clearAllBookmarks(),
        },
      ],
    );
  };

  const handlePress = (bookmark: Bookmark) => {
    router.push(`/screen/surah/${bookmark.surahNomor}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#728d8d" />
          </TouchableOpacity>
          <Text className="font-bold text-xl text-[#363636] dark:text-[#f8fafc]">Bookmark</Text>
        </View>
        {bookmarks.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} className="p-2">
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#728d8d" />
          <Text className="mt-2 text-gray-500 dark:text-[#cbd5e1]">Memuat bookmark...</Text>
        </View>
      ) : bookmarks.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <BookmarkX size={64} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-[#cbd5e1] mt-4 text-center">
            Belum ada bookmark
          </Text>
          <Text className="text-gray-400 dark:text-[#94a3b8] text-sm text-center mt-1">
            Tap icon bookmark pada ayat untuk menyimpan
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookmarkItem
              bookmark={item}
              onRemove={() => handleRemove(item.id)}
              onPress={() => handlePress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}
