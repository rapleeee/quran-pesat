import { router } from "expo-router";
import { ArrowLeft, Shield } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#728d8d" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-[#363636] dark:text-[#f8fafc]">Privasi</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-[#728d8d]/10 items-center justify-center mr-3">
              <Shield size={20} color="#728d8d" />
            </View>
            <View>
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">
                Kebijakan Privasi
              </Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-0.5">
                Data tetap di perangkat kamu
              </Text>
            </View>
          </View>

          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs leading-5">
            Quran Pesat menyimpan data seperti bookmark, preferensi tajwid, dan
            pengaturan tampilan hanya di perangkat kamu. Kami tidak mengirimkan
            data tersebut ke server pihak ketiga.
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs leading-5 mt-3">
            Beberapa fitur membutuhkan koneksi internet (contoh: audio, artikel,
            tajwid berwarna). Data yang diambil hanya digunakan untuk menampilkan
            konten yang kamu minta.
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs leading-5 mt-3">
            Jika ada pertanyaan terkait privasi, silakan hubungi tim kami melalui
            email dukungan.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
