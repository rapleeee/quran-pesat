import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowLeft, PlayCircle } from "lucide-react-native";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type KajianLink = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
};

const KAJIAN_LINKS: KajianLink[] = [
  {
    id: "youtube",
    title: "Kajian di YouTube",
    subtitle: "Cari kajian terbaru dari berbagai ustadz",
    url: "https://www.youtube.com/results?search_query=kajian+islam",
  },
  {
    id: "podcast",
    title: "Podcast Islami",
    subtitle: "Dengarkan kajian audio kapan saja",
    url: "https://open.spotify.com/search/kajian%20islam",
  },
  {
    id: "article",
    title: "Artikel Kajian",
    subtitle: "Bacaan kajian dari situs Islami",
    url: "https://muslim.or.id",
  },
];

export default function KajianOnlineScreen() {
  const handleOpen = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      Alert.alert("Gagal", "Tidak bisa membuka link kajian.");
    }
  };

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
          Kajian Online
        </Text>
      </View>

      <View className="px-4 pt-4">
        <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-full bg-[#728d8d]/10 items-center justify-center mr-3">
              <PlayCircle size={22} color="#728d8d" />
            </View>
            <View className="flex-1">
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">
                Pilih Sumber Kajian
              </Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">
                Semua link dibuka di browser internal.
              </Text>
            </View>
          </View>

          {KAJIAN_LINKS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => void handleOpen(item.url)}
              className="bg-[#f8f4ea] dark:bg-[#111827] rounded-xl px-4 py-3 mb-3"
              activeOpacity={0.8}
            >
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-sm">
                {item.title}
              </Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">
                {item.subtitle}
              </Text>
            </TouchableOpacity>
          ))}

          <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs">
            Ingin tambah sumber kajian favorit? Hubungi admin untuk update.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
