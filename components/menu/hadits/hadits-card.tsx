import { HaditsItem } from "@/types/hadits";
import { Bookmark } from "lucide-react-native";
import React from "react";
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HaditsCardProps {
  item: HaditsItem;
  isBookmarked: boolean;
  onPress: (item: HaditsItem) => void;
  onToggleBookmark: (item: HaditsItem) => void;
}

export function HaditsCard({
  item,
  isBookmarked,
  onPress,
  onToggleBookmark,
}: HaditsCardProps) {
  const handleBookmarkPress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleBookmark(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      className="mx-4 mb-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-base" numberOfLines={2}>
            {item.title}
          </Text>
          {item.source ? (
            <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1" numberOfLines={1}>
              {item.source}
            </Text>
          ) : null}
          <Text
            className="text-[#111827] text-[17px] leading-7 mt-2 font-arabic"
            numberOfLines={2}
            style={{ writingDirection: "rtl", textAlign: "right" }}
          >
            {item.arabic || "-"}
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-sm mt-2" numberOfLines={2}>
            {item.translation || "Terjemahan belum tersedia."}
          </Text>
        </View>

        <View className="px-2 py-1 rounded-md bg-[#728d8d]/15">
          <Text className="text-[#336363] dark:text-[#9fb7b7] text-[11px] font-semibold">#{item.nomor}</Text>
        </View>
      </View>

      <View className="mt-4 pt-3 border-t border-[#f1f5f9] flex-row items-center justify-end">
        <TouchableOpacity
          onPress={handleBookmarkPress}
          className="h-11 px-3 rounded-xl flex-row items-center gap-2 bg-[#ecf1f1]"
        >
          <Bookmark
            size={16}
            color="#336363"
            fill={isBookmarked ? "#336363" : "transparent"}
            fillOpacity={isBookmarked ? 0.9 : 0}
          />
          <Text className="text-[#336363] dark:text-[#9fb7b7] text-xs font-semibold">
            {isBookmarked ? "Tersimpan" : "Simpan"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
