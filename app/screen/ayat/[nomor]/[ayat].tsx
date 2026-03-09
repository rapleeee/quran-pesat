import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, TriangleAlert } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AyatDetailPlaceholderScreen() {
  const { nomor, ayat } = useLocalSearchParams<{ nomor: string; ayat: string }>();

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#728d8d" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc] ml-2">
          Detail Ayat
        </Text>
      </View>

      <View className="flex-1 px-4 pt-6">
        <View className="rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-amber-500/15 items-center justify-center mr-3">
              <TriangleAlert size={18} color="#b45309" />
            </View>
            <View className="rounded-md px-2 py-0.5 bg-amber-500/15 border border-amber-400/60">
              <Text className="text-[10px] font-semibold text-amber-700">DEVELOP</Text>
            </View>
          </View>

          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-base mt-3">
            Fitur sedang dikembangkan
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-sm mt-2 leading-6">
            Halaman detail untuk ayat {ayat || "-"} di surah {nomor || "-"} belum
            tersedia. Untuk saat ini, baca melalui halaman surah utama.
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (nomor) {
                router.replace(`/screen/surah/${nomor}`);
                return;
              }
              router.back();
            }}
            className="mt-4 bg-[#728d8d] rounded-xl py-3 px-4 items-center"
          >
            <Text className="text-white font-semibold">Buka Halaman Surah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
