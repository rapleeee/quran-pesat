import { Transliteration } from "@/components/ui/transliteration";
import { useArabicFontSize } from "@/hooks/quran/use-arabic-font-size";
import { TajweedMap } from "@/hooks/quran/use-tajweed-surah";
import { Ayat } from "@/types/quran";
import { Bookmark, Pause, Play } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { buildArabicTextStyle, TajweedText } from "./tajweed-text";

type AyatItemProps = {
  ayat: Ayat;
  isPlaying: boolean;
  isLoading: boolean;
  isQuranMode: boolean;
  isTajweedEnabled: boolean;
  tajweedMap: TajweedMap | null;
  onPlay: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
};

export function AyatItem({
  ayat,
  isPlaying,
  isLoading,
  isQuranMode,
  isTajweedEnabled,
  tajweedMap,
  onPlay,
  isBookmarked,
  onToggleBookmark,
}: AyatItemProps) {
  const { fontSize } = useArabicFontSize();
  const arabicTextStyle = useMemo(
    () => buildArabicTextStyle(fontSize),
    [fontSize],
  );
  const tajweedSegments = tajweedMap?.[ayat.nomor]?.segments;
  const tajweedFallback = isTajweedEnabled
    ? tajweedMap?.[ayat.nomor]?.text ?? ayat.ar
    : ayat.ar;

  return (
    <View className="px-4 py-4 border-b border-[#e5e5e5] dark:border-[#1f2937]">
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-8 h-8 rounded-full bg-[#728d8d] items-center justify-center">
          <Text className="text-white text-xs font-bold">{ayat.nomor}</Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={onPlay} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#728d8d" />
            ) : isPlaying ? (
              <Pause size={20} color="#728d8d" fill="#728d8d" />
            ) : (
              <Play size={20} color="#728d8d" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleBookmark}>
            <Bookmark
              size={20}
              color={isBookmarked ? "#728d8d" : "#728d8d"}
              fill={isBookmarked ? "#728d8d" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: isQuranMode ? 0 : 16 }}>
        <TajweedText
          style={[arabicTextStyle, { textAlign: "right" }]}
          segments={isTajweedEnabled ? tajweedSegments : undefined}
          fallbackText={tajweedFallback}
        />
      </View>
      {!isQuranMode && (
        <>
          <Transliteration
            text={ayat.tr}
            style={{
              color: "#728d8d",
              fontSize: 14,
              fontStyle: "italic",
              marginBottom: 8,
            }}
          />
          <Text className="text-[#666666] text-sm leading-5">{ayat.idn}</Text>
        </>
      )}
    </View>
  );
}
