import { router } from "expo-router";
import { ArrowLeft, Settings } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VoiceArabGuideScreen() {
  const steps = useMemo(() => {
    if (Platform.OS === "ios") {
      return [
        "Buka Settings di iPhone/iPad.",
        "Masuk ke Accessibility > Spoken Content > Voices.",
        "Pilih Arabic, lalu unduh salah satu voice.",
        "Kembali ke aplikasi dan tekan Dengarkan lagi.",
      ];
    }

    return [
      "Buka Settings Android.",
      "Masuk ke Language & input > Text-to-speech output.",
      "Pilih engine Google Text-to-speech.",
      "Masuk ke Install voice data lalu unduh Arabic.",
      "Kembali ke aplikasi dan tekan Dengarkan lagi.",
    ];
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top", "bottom"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={22} color="#363636" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#363636]">Panduan Voice Arab</Text>
        <View className="w-11 h-11" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
          <Text className="text-[#111827] text-base font-semibold">
            Kenapa suara belum Arab?
          </Text>
          <Text className="mt-2 text-[#4b5563] text-sm leading-6">
            Aplikasi sudah meminta bacaan bahasa Arab, tapi sistem perangkat tetap butuh
            paket voice Arabic untuk hasil yang benar.
          </Text>
        </View>

        <View className="mt-3 rounded-2xl border border-[#e5e7eb] bg-white p-4">
          <Text className="text-[#111827] text-base font-semibold">Langkah Aktivasi</Text>
          {steps.map((step, index) => (
            <View key={step} className="mt-3 flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-[#ecf1f1] items-center justify-center mr-2 mt-0.5">
                <Text className="text-[#336363] text-xs font-semibold">{index + 1}</Text>
              </View>
              <Text className="flex-1 text-[#374151] text-sm leading-6">{step}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            void Linking.openSettings();
          }}
          activeOpacity={0.85}
          className="mt-4 min-h-[46px] rounded-xl bg-[#336363] flex-row items-center justify-center gap-2"
        >
          <Settings size={18} color="#ffffff" />
          <Text className="text-white font-semibold">Buka Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
