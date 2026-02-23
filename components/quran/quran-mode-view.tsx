import { useArabicFontSize } from "@/hooks/quran/use-arabic-font-size";
import { TajweedMap } from "@/hooks/quran/use-tajweed-surah";
import { Ayat } from "@/types/quran";
import {
  formatAyatNumber,
  shouldAppendAyatNumber,
} from "@/utils/quran-text";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NextSurahButton } from "./next-surah-button";
import { buildArabicTextStyle, TajweedText } from "./tajweed-text";

type QuranModeViewProps = {
  pageAyat: Ayat[];
  pageIndex: number;
  totalPages: number;
  tajweedEnabled: boolean;
  tajweedMap: TajweedMap | null;
  pageText: string;
  onPrevPage: () => void;
  onNextPage: () => void;
  onNextSurah: () => void;
  showNextSurah: boolean;
};

const JUSTIFY_STYLE = {
  textAlign: "justify" as const,
  writingDirection: "rtl" as const,
};

export function QuranModeView({
  pageAyat,
  pageIndex,
  totalPages,
  tajweedEnabled,
  tajweedMap,
  pageText,
  onPrevPage,
  onNextPage,
  onNextSurah,
  showNextSurah,
}: QuranModeViewProps) {
  const { fontSize } = useArabicFontSize();
  const arabicTextStyle = useMemo(
    () => buildArabicTextStyle(fontSize),
    [fontSize],
  );

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 py-4">
          <Text style={[arabicTextStyle, JUSTIFY_STYLE]}>
            {tajweedEnabled
              ? pageAyat.map((ayat, index) => {
                  const segments = tajweedMap?.[ayat.nomor]?.segments;
                  const fallback = tajweedMap?.[ayat.nomor]?.text ?? ayat.ar;
                  const shouldAppend = shouldAppendAyatNumber(
                    fallback,
                    ayat.nomor,
                  );

                  return (
                    <Text key={ayat.id}>
                      <TajweedText
                        segments={segments}
                        fallbackText={fallback}
                        style={[arabicTextStyle, JUSTIFY_STYLE]}
                      />{" "}
                      {shouldAppend ? formatAyatNumber(ayat.nomor) : ""}
                      {index < pageAyat.length - 1 ? " " : ""}
                    </Text>
                  );
                })
              : pageText}
          </Text>
        </View>
      </ScrollView>
      {totalPages > 1 && (
        <View className="flex-row items-center justify-between px-4 py-3 border-t border-[#e5e5e5] dark:border-[#1f2937] bg-[#fbf5ea] dark:bg-[#0b1220]">
          <TouchableOpacity
            onPress={onPrevPage}
            disabled={pageIndex === 0}
            className={`px-3 py-2 rounded-lg ${
              pageIndex === 0 ? "bg-[#e5e5e5]" : "bg-[#728d8d]"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                pageIndex === 0 ? "text-[#9ca3af]" : "text-white"
              }`}
            >
              Sebelumnya
            </Text>
          </TouchableOpacity>
          <Text className="text-xs text-[#666666]">
            Halaman {pageIndex + 1} / {totalPages}
          </Text>
          <TouchableOpacity
            onPress={onNextPage}
            disabled={pageIndex >= totalPages - 1}
            className={`px-3 py-2 rounded-lg ${
              pageIndex >= totalPages - 1 ? "bg-[#e5e5e5]" : "bg-[#728d8d]"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                pageIndex >= totalPages - 1
                  ? "text-[#9ca3af]"
                  : "text-white"
              }`}
            >
              Berikutnya
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {showNextSurah && (
        <View className="px-4 pb-6 pt-2">
          <NextSurahButton onPress={onNextSurah} />
        </View>
      )}
    </View>
  );
}
