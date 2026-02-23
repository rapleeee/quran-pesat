import { Heart, Plus, Share2 } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PrayerItem {
  id: string;
  name: string;
  time: string;
  title: string;
  description: string;
  aamiin: number;
}

const prayerData: PrayerItem[] = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    time: "2 jam yang lalu",
    title: "Doa untuk Kesembuhan Ibu",
    description:
      "Mohon doanya untuk kesembuhan ibu saya yang sedang sakit. Semoga Allah memberikan kesembuhan yang sempurna 🤲",
    aamiin: 128,
  },
  {
    id: "2",
    name: "Fatimah Zahra",
    time: "5 jam yang lalu",
    title: "Doa Kelancaran Ujian",
    description:
      "Mohon doanya untuk adik saya yang akan ujian nasional. Semoga diberi kemudahan dan kelulusan 📚",
    aamiin: 89,
  },
  {
    id: "3",
    name: "Muhammad Rizki",
    time: "1 hari yang lalu",
    title: "Doa Mencari Pekerjaan",
    description:
      "Mohon doanya agar segera mendapat pekerjaan yang halal dan berkah. Aamiin ya Allah 🙏",
    aamiin: 256,
  },
  {
    id: "4",
    name: "Aisyah Putri",
    time: "2 hari yang lalu",
    title: "Doa Keselamatan Perjalanan",
    description:
      "Mohon doanya untuk keluarga yang sedang dalam perjalanan jauh. Semoga selamat sampai tujuan 🚗",
    aamiin: 67,
  },
];

function PrayerCard({ item }: { item: PrayerItem }) {
  return (
    <View className="w-72 rounded-2xl bg-[#728d8d]/20 border border-[#e5e5e5] dark:border-[#1f2937] mr-3">
      <View className="flex-row items-center p-3 border-b border-[#f0f0f0] dark:border-[#1f2937]">
        <Image
          source={require("@/assets/logo/logo.png")}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-[#363636] dark:text-[#f8fafc]">{item.name}</Text>
          <Text className="text-xs text-gray-400 dark:text-[#94a3b8]">{item.time}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="font-semibold text-[#363636] dark:text-[#f8fafc] text-base mb-2">
          {item.title}
        </Text>
        <Text className="text-[#666666] text-sm leading-5" numberOfLines={3}>
          {item.description}
        </Text>
      </View>
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-[#f0f0f0] dark:border-[#1f2937]">
        <TouchableOpacity className="flex-row items-center gap-2">
          <Heart size={20} color="#728d8d" />
          <Text className="text-[#728d8d] font-medium">Aamiin</Text>
          <Text className="text-gray-400 dark:text-[#94a3b8] text-sm">({item.aamiin})</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center gap-2">
          <Share2 size={18} color="#728d8d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CardPrayer() {
  return (
    <View className="mt-6 mb-4">
      <View className="px-4 flex-row justify-between items-center mb-4">
        <Text className="font-bold text-lg text-[#363636] dark:text-[#f8fafc]">
          Aminkan doa saudaramu
        </Text>
        <TouchableOpacity className="flex-row items-center gap-1">
          <Text className="font-medium text-[#728d8d]">Buat doa</Text>
          <Plus size={18} color="#728d8d" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {prayerData.map((item) => (
          <PrayerCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}
