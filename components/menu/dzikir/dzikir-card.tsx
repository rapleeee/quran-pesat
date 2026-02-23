import { getDzikirTypeBadgeLabel } from "@/data/dzikir";
import { DzikirHarianItem } from "@/types/dzikir";
import { Bookmark } from "lucide-react-native";
import React from "react";
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DzikirCardProps {
  item: DzikirHarianItem;
  isBookmarked: boolean;
  onPress: (item: DzikirHarianItem) => void;
  onToggleBookmark: (item: DzikirHarianItem) => void;
}

export function DzikirCard({
  item,
  isBookmarked,
  onPress,
  onToggleBookmark,
}: DzikirCardProps) {
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
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-[#64748b] text-xs font-semibold">Dzikir #{item.id}</Text>
          <View className="px-2 py-1 rounded-md bg-[#ecf1f1]">
            <Text className="text-[#336363] dark:text-[#9fb7b7] text-[11px] font-semibold">
              {getDzikirTypeBadgeLabel(item.type)}
            </Text>
          </View>
        </View>
        <View className="px-2 py-1 rounded-md bg-[#728d8d]/15 ml-2">
          <Text className="text-[#336363] dark:text-[#9fb7b7] text-[11px] font-semibold">
            x{item.repeat}
          </Text>
        </View>
      </View>

      <Text
        className="text-right text-[26px] leading-[38px] text-[#111827] font-arabic"
        style={{ writingDirection: "rtl" }}
      >
        {item.arabic}
      </Text>

      <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-sm mt-3 leading-6">{item.translation}</Text>

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
