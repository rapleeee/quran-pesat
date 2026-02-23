import { AyatItem } from "@/components/quran/ayat-item";
import { BismillahBanner } from "@/components/quran/bismillah-banner";
import { NextSurahButton } from "@/components/quran/next-surah-button";
import { QuranModeView } from "@/components/quran/quran-mode-view";
import { SurahAudioButton } from "@/components/quran/surah-audio-button";
import { SurahHeader } from "@/components/quran/surah-header";
import { useAudioPlayer } from "@/hooks/quran/use-audio-player";
import { useBookmark } from "@/hooks/quran/use-bookmark";
import { useQuranMode } from "@/hooks/quran/use-quran-mode";
import { useTajweedSettings } from "@/hooks/quran/use-tajweed-settings";
import { useTajweedSurah } from "@/hooks/quran/use-tajweed-surah";
import { useSurahDetail } from "@/hooks/quran/use-quran";
import { Ayat } from "@/types/quran";
import {
  QURAN_PAGE_SIZE,
  chunkAyat,
  formatAyatNumber,
  shouldAppendAyatNumber,
} from "@/utils/quran-text";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SurahDetail() {
  const { nomor } = useLocalSearchParams<{ nomor: string }>();
  const { surah, loading, error } = useSurahDetail(Number(nomor));
  const { isBookmarked, toggleBookmark } = useBookmark();
  const { isQuranMode, refreshQuranMode } = useQuranMode();
  const {
    isTajweedEnabled,
    loading: tajweedSettingLoading,
    refreshTajweedSetting,
  } = useTajweedSettings();
  const tajweedEnabled = isTajweedEnabled && !tajweedSettingLoading;
  const { map: tajweedMap } = useTajweedSurah(
    surah?.nomor ?? null,
    tajweedEnabled,
  );
  const [pageIndex, setPageIndex] = useState(0);
  const {
    playAyat,
    playFullSurah,
    isPlaying,
    isLoading,
    currentAyatId,
    isPlayingFullSurah,
    fullSurahLoading,
    currentSurahPlaying,
  } = useAudioPlayer();

  const handlePlayAyat = (ayat: Ayat) => {
    playAyat(Number(nomor), ayat.nomor, ayat.id);
  };

  const handlePlayFullSurah = () => {
    if (surah?.audio) {
      playFullSurah(surah.nomor, surah.audio);
    }
  };

  const isCurrentSurahPlaying = currentSurahPlaying === Number(nomor);
  const quranPages = useMemo(
    () => (surah ? chunkAyat(surah.ayat, QURAN_PAGE_SIZE) : []),
    [surah],
  );
  const totalPages = quranPages.length;
  const pageAyat = useMemo(
    () => quranPages[pageIndex] ?? [],
    [pageIndex, quranPages],
  );
  const pageText = useMemo(
    () =>
      pageAyat
        .map((ayat) => {
          const fallback = tajweedEnabled
            ? tajweedMap?.[ayat.nomor]?.text ?? ayat.ar
            : ayat.ar;
          return shouldAppendAyatNumber(fallback, ayat.nomor)
            ? `${fallback} ${formatAyatNumber(ayat.nomor)}`
            : fallback;
        })
        .join(" "),
    [pageAyat, tajweedEnabled, tajweedMap],
  );

  useFocusEffect(
    useCallback(() => {
      refreshQuranMode();
      refreshTajweedSetting();
    }, [refreshQuranMode, refreshTajweedSetting]),
  );

  useEffect(() => {
    setPageIndex(0);
  }, [surah?.nomor, isQuranMode]);

  const handleNextSurah = () => {
    if (!surah) {
      return;
    }
    const nextSurah = surah.nomor + 1;
    router.push(`/screen/surah/${nextSurah}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <SurahHeader
        surah={surah}
        isQuranMode={isQuranMode}
        onBack={() => router.back()}
      />

      {surah && (
        <SurahAudioButton
          loading={fullSurahLoading}
          isPlaying={isPlayingFullSurah && isCurrentSurahPlaying}
          onPress={handlePlayFullSurah}
        />
      )}

      <BismillahBanner
        show={Boolean(surah && surah.nomor !== 1 && surah.nomor !== 9)}
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#728d8d" />
          <Text className="mt-2 text-gray-500 dark:text-[#cbd5e1]">Memuat surah...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      ) : surah ? (
        isQuranMode ? (
          <QuranModeView
            pageAyat={pageAyat}
            pageIndex={pageIndex}
            totalPages={totalPages}
            tajweedEnabled={tajweedEnabled}
            tajweedMap={tajweedMap}
            pageText={pageText}
            onPrevPage={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            onNextPage={() =>
              setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
            }
            onNextSurah={handleNextSurah}
            showNextSurah={surah.nomor < 114 && pageIndex === totalPages - 1}
          />
        ) : (
          <FlatList
            data={surah.ayat}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AyatItem
                ayat={item}
                isPlaying={isPlaying && currentAyatId === item.id}
                isLoading={isLoading && currentAyatId === item.id}
                isQuranMode={isQuranMode}
                isTajweedEnabled={tajweedEnabled}
                tajweedMap={tajweedMap}
                onPlay={() => handlePlayAyat(item)}
                isBookmarked={isBookmarked(surah.nomor, item.nomor)}
                onToggleBookmark={() => toggleBookmark(surah, item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListFooterComponent={
              surah.nomor < 114 ? (
                <View className="px-4 pt-2 pb-8">
                  <NextSurahButton onPress={handleNextSurah} />
                </View>
              ) : null
            }
          />
        )
      ) : null}
    </SafeAreaView>
  );
}
