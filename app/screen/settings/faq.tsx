import { router } from "expo-router";
import { ArrowLeft, CircleHelp, Mail } from "lucide-react-native";
import React from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQS = [
  {
    question: "Kenapa jadwal sholat tidak muncul?",
    answer:
      "Pastikan lokasi sudah diizinkan dan pilih provinsi serta kab/kota di pengaturan.",
  },
  {
    question: "Tajwid berwarna tidak tampil?",
    answer:
      "Aktifkan Warna Tajwid di pengaturan Al-Qur'an dan pastikan perangkat online untuk unduh data pertama kali.",
  },
  {
    question: "Audio tidak terdengar?",
    answer:
      "Pastikan volume perangkat aktif dan koneksi internet stabil untuk streaming audio.",
  },
  {
    question: "Kenapa font Arab berbeda?",
    answer:
      "Kamu bisa mengatur ukuran font Arab di Pengaturan > Tampilan.",
  },
];

export default function FaqScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#728d8d" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-[#363636] dark:text-[#f8fafc]">Bantuan & FAQ</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-[#728d8d]/10 items-center justify-center mr-3">
              <CircleHelp size={20} color="#728d8d" />
            </View>
            <View>
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">Pertanyaan Umum</Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-0.5">
                Temukan jawaban cepat di bawah ini
              </Text>
            </View>
          </View>

          {FAQS.map((item) => (
            <View key={item.question} className="mb-4">
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-sm">
                {item.question}
              </Text>
              <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs mt-1 leading-5">
                {item.answer}
              </Text>
            </View>
          ))}
        </View>

        <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4 mt-4">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">Masih butuh bantuan?</Text>
          <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">
            Hubungi kami lewat email untuk pertanyaan atau saran.
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("mailto:support@quranpesat.com?subject=Bantuan")
            }
            className="mt-3 bg-[#728d8d] rounded-xl py-3 px-4 flex-row items-center justify-center"
          >
            <Mail size={16} color="#fff" />
            <Text className="text-white font-semibold ml-2">Kirim Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
