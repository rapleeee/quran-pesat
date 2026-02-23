import { DoaHarianItem } from "@/types/doa";
import { Star } from "lucide-react-native";
import React, { useMemo } from "react";
import { GestureResponderEvent, Text, TouchableOpacity, View } from "react-native";

interface DoaCardProps {
  item: DoaHarianItem;
  query: string;
  isFavorite: boolean;
  onPress: (item: DoaHarianItem) => void;
  onLongPress: (item: DoaHarianItem) => void;
  onToggleFavorite: (item: DoaHarianItem) => void;
}

interface HighlightTextProps {
  text: string;
  query: string;
  className: string;
  highlightClassName: string;
  numberOfLines?: number;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightText({
  text,
  query,
  className,
  highlightClassName,
  numberOfLines,
}: HighlightTextProps) {
  const normalizedQuery = query.trim();
  const parts = useMemo(() => {
    if (!normalizedQuery || !text) {
      return [text];
    }

    const pattern = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi");
    return text.split(pattern);
  }, [normalizedQuery, text]);

  if (!normalizedQuery) {
    return (
      <Text className={className} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  const loweredQuery = normalizedQuery.toLocaleLowerCase("id-ID");

  return (
    <Text className={className} numberOfLines={numberOfLines}>
      {parts.map((part, index) => {
        const isMatch = part.toLocaleLowerCase("id-ID") === loweredQuery;
        return (
          <Text
            key={`${part}-${index}`}
            className={isMatch ? highlightClassName : undefined}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
}

export function DoaCard({
  item,
  query,
  isFavorite,
  onPress,
  onLongPress,
  onToggleFavorite,
}: DoaCardProps) {
  const handleFavoritePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleFavorite(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      delayLongPress={220}
      className="mx-4 mb-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <HighlightText
            text={item.title}
            query={query}
            className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-base"
            highlightClassName="bg-[#f6c76d]/35 text-[#1f2937] dark:text-[#e5e7eb]"
            numberOfLines={2}
          />
          <Text
            className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1 font-arabic"
            numberOfLines={1}
            style={{ writingDirection: "rtl" }}
          >
            {item.arabic}
          </Text>
          <HighlightText
            text={item.translation}
            query={query}
            className="text-[#4b5563] dark:text-[#cbd5e1] text-xs mt-2"
            highlightClassName="bg-[#f6c76d]/35 text-[#374151] dark:text-[#e5e7eb]"
            numberOfLines={2}
          />
        </View>

        <View className="items-end gap-2">
          <TouchableOpacity
            onPress={handleFavoritePress}
            className="w-9 h-9 rounded-full items-center justify-center bg-[#728d8d]/10"
          >
            <Star
              size={16}
              color="#336363"
              fill={isFavorite ? "#336363" : "transparent"}
              fillOpacity={isFavorite ? 0.85 : 0}
            />
          </TouchableOpacity>
          <View className="px-2 py-1 rounded-md bg-[#728d8d]/15">
            <Text className="text-[#336363] dark:text-[#9fb7b7] text-[11px] font-semibold">
              #{item.id}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
