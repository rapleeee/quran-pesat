import {
  developerSupportSummary,
  supportNotes,
} from "@/data/developer-support";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowLeft, Share2 } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function DonasiScreen() {
  const saweriaUrl = "https://saweria.co/developersolo";
  const saweriaMilestoneUrl =
    "https://saweria.co/widgets/milestone?streamKey=57a1700cfb1dc8e50fa322ab62ca45fe";
  const saweriaLeaderboardUrl =
    "https://saweria.co/widgets/leaderboard?streamKey=57a1700cfb1dc8e50fa322ab62ca45fe";

  const shareMessage = useMemo(() => {
    return `${developerSupportSummary.supportTitle}\n${developerSupportSummary.supportDescription}\nLink dukungan: ${saweriaUrl}`;
  }, [saweriaUrl]);

  const handleOpenSaweria = async () => {
    try {
      await WebBrowser.openBrowserAsync(saweriaUrl);
    } catch {
      Alert.alert("Gagal", "Tidak bisa membuka Saweria.");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch {
      Alert.alert("Gagal", "Belum bisa membagikan dukungan saat ini.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#728d8d" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc]">
          Dukung Developer
        </Text>
        <TouchableOpacity
          onPress={() => void handleShare()}
          className="w-11 h-11 items-center justify-center"
        >
          <Share2 size={18} color="#728d8d" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mx-4 mt-4 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-bold text-base">
            Milestone Dukungan
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs mt-1">
            {developerSupportSummary.supportDescription}
          </Text>
          <View className="mt-4 h-40 overflow-hidden rounded-xl">
            <WebView
              source={{ uri: saweriaMilestoneUrl }}
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled
              scrollEnabled={false}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
        </View>

        <Text className="px-4 mt-6 mb-3 text-[#4b5563] dark:text-[#cbd5e1] text-xs font-semibold uppercase">
          Dukungan via Saweria
        </Text>

        <View className="mx-4 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-sm">
            Scan QR atau buka Saweria
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs mt-1">
            Semua dukungan akan masuk langsung ke halaman Saweria.
          </Text>
          <View className="items-center mt-4">
            <Image
              source={require("@/assets/images/sawer.png")}
              className="w-56 h-56"
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            onPress={() => void handleOpenSaweria()}
            className="mt-4 bg-[#728d8d] rounded-xl py-3 px-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Buka Saweria</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-4 mt-2 rounded-xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-sm mb-2">
            Catatan Development & Transparansi
          </Text>
          {supportNotes.map((note, index) => (
            <Text key={note} className="text-[#4b5563] dark:text-[#cbd5e1] text-xs leading-5">
              {index + 1}. {note}
            </Text>
          ))}
        </View>

        <View className="mx-4 mt-4 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-bold text-base">
            Leaderboard Dukungan
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs mt-1">
            Terima kasih untuk para pendukung teratas.
          </Text>
          <View className="mt-4 h-44 overflow-hidden rounded-xl border border-[#e5e5e5] dark:border-[#1f2937]">
            <WebView
              source={{ uri: saweriaLeaderboardUrl }}
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled
              scrollEnabled={false}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
