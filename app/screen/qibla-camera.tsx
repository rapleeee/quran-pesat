import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const QIBLA_FINDER_URL = "https://qiblafinder.withgoogle.com/";

export default function QiblaCameraScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top", "bottom"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#728d8d" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc] ml-2">
          Kiblat via Kamera
        </Text>
      </View>

      <WebView
        source={{ uri: QIBLA_FINDER_URL }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
}
