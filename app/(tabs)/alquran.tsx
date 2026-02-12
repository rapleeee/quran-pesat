import { useAllSurah } from "@/hooks/quran/use-quran";
import { Surah } from "@/types/quran";
import { router } from "expo-router";
import { Bookmark, BookOpen, Search, Settings } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SurahItem({ surah }: { surah: Surah }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/screen/surah/${surah.nomor}`)}
      className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5]"
    >
      <View className="w-20 h-20 items-center justify-center mr-3">
        <Image
          source={require("@/assets/logo/ayat.png")}
          className="w-20 h-20 absolute"
          resizeMode="contain"
        />
        <Text className="font-bold text-[#728d8d] text-lg">{surah.nomor}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-[#363636] text-base">
          {surah.nama_latin}
        </Text>
        <Text className="text-gray-500 text-xs">
          {surah.arti} • {surah.jumlah_ayat} Ayat
        </Text>
      </View>
      <View className="items-end">
        <Text className="font-arabic text-xl text-[#728d8d]">{surah.nama}</Text>
        <Text className="text-xs text-gray-400">{surah.tempat_turun}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AlQuran() {
  const { surahs, loading, error } = useAllSurah();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.nama_latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.nomor.toString().includes(searchQuery),
  );

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5]">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <BookOpen size={28} color="#728d8d" />
            <Text className="font-bold text-2xl text-[#363636]">Al-Quran</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.push("/screen/bookmark")}>
              <Bookmark size={24} color="#728d8d" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
              <Settings size={24} color="#728d8d" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center bg-white rounded-xl px-3 py-2 border border-[#e5e5e5]">
          <Search size={20} color="#9ca3af" />
          <TextInput
            placeholder="Cari surah..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-[#363636]"
          />
        </View>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#728d8d" />
          <Text className="mt-2 text-gray-500">Memuat daftar surah...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => item.nomor.toString()}
          renderItem={({ item }) => <SurahItem surah={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500">Surah tidak ditemukan</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
