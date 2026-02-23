import { Surah } from "@/types/quran";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SurahHeaderProps = {
  surah: Surah | null;
  isQuranMode: boolean;
  onBack: () => void;
};

export function SurahHeader({ surah, isQuranMode, onBack }: SurahHeaderProps) {
  return (
    <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937]">
      <TouchableOpacity onPress={onBack} className="mr-3">
        <ArrowLeft size={24} color="#728d8d" />
      </TouchableOpacity>
      {surah && (
        <View className="flex-1">
          {!isQuranMode ? (
            <>
              <Text className="font-bold text-lg text-[#363636] dark:text-[#f8fafc]">
                {surah.nama_latin}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-[#cbd5e1]">
                {surah.arti} • {surah.jumlah_ayat} Ayat • {surah.tempat_turun}
              </Text>
            </>
          ) : (
            <Text className="text-xs text-gray-500 dark:text-[#cbd5e1]">
              {surah.jumlah_ayat} Ayat • {surah.tempat_turun}
            </Text>
          )}
        </View>
      )}
      {surah && (
        <Text className="font-arabic text-2xl text-[#728d8d]">
          {surah.nama}
        </Text>
      )}
    </View>
  );
}
