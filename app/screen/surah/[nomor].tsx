import { Transliteration } from "@/components/ui/transliteration";
import { useAudioPlayer } from "@/hooks/quran/use-audio-player";
import { useBookmark } from "@/hooks/quran/use-bookmark";
import { useSurahDetail } from "@/hooks/quran/use-quran";
import { Ayat, Surah } from "@/types/quran";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Bookmark, Pause, Play, Volume2 } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AyatItemProps {
  ayat: Ayat;
  surah: Surah;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

function AyatItem({
  ayat,
  surah,
  isPlaying,
  isLoading,
  onPlay,
  isBookmarked,
  onToggleBookmark,
}: AyatItemProps) {
  return (
    <View className="px-4 py-4 border-b border-[#e5e5e5]">
      {/* Nomor ayat dan actions */}
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

      {/* Ayat Arab */}
      <Text className="text-right text-2xl leading-loose text-[#363636] mb-4 font-arabic">
        {ayat.ar}
      </Text>

      {/* Transliterasi */}
      <Transliteration
        text={ayat.tr}
        style={{
          color: "#728d8d",
          fontSize: 14,
          fontStyle: "italic",
          marginBottom: 8,
        }}
      />

      {/* Terjemahan */}
      <Text className="text-[#666666] text-sm leading-5">{ayat.idn}</Text>
    </View>
  );
}

export default function SurahDetail() {
  const { nomor } = useLocalSearchParams<{ nomor: string }>();
  const { surah, loading, error } = useSurahDetail(Number(nomor));
  const { isBookmarked, toggleBookmark } = useBookmark();
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

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#363636" />
        </TouchableOpacity>
        {surah && (
          <View className="flex-1">
            <Text className="font-bold text-lg text-[#363636]">
              {surah.nama_latin}
            </Text>
            <Text className="text-xs text-gray-500">
              {surah.arti} • {surah.jumlah_ayat} Ayat • {surah.tempat_turun}
            </Text>
          </View>
        )}
        {surah && (
          <Text className="font-arabic text-2xl text-[#728d8d]">
            {surah.nama}
          </Text>
        )}
      </View>

      {/* Play Full Surah Banner */}
      {surah && (
        <TouchableOpacity
          onPress={handlePlayFullSurah}
          disabled={fullSurahLoading}
          className="mx-4 mt-3 mb-2 bg-[#728d8d] rounded-xl py-3 px-4 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          {fullSurahLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : isPlayingFullSurah && isCurrentSurahPlaying ? (
            <Pause size={20} color="#fff" fill="#fff" />
          ) : (
            <Volume2 size={20} color="#fff" />
          )}
          <Text className="text-white font-semibold ml-2">
            {isPlayingFullSurah && isCurrentSurahPlaying
              ? "Pause Audio Surah"
              : "Putar Full Surah"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Bismillah Banner */}
      {surah && surah.nomor !== 1 && surah.nomor !== 9 && (
        <View className="bg-[#728d8d]/10 py-4 items-center">
          <Text className="font-arabic text-2xl text-[#728d8d]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#728d8d" />
          <Text className="mt-2 text-gray-500">Memuat surah...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      ) : surah ? (
        <FlatList
          data={surah.ayat}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AyatItem
              ayat={item}
              surah={surah}
              isPlaying={isPlaying && currentAyatId === item.id}
              isLoading={isLoading && currentAyatId === item.id}
              onPlay={() => handlePlayAyat(item)}
              isBookmarked={isBookmarked(surah.nomor, item.nomor)}
              onToggleBookmark={() => toggleBookmark(surah, item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : null}
    </SafeAreaView>
  );
}
