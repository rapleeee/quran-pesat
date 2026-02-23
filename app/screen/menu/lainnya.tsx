import { menuItems } from "@/data/menu-beranda";
import { router } from "expo-router";
import {
  ArrowLeft,
  CalendarDays,
  Calculator,
  ChevronRight,
  PlayCircle,
  Settings,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuBeranda from "@/components/menu-beranda";

type LainnyaItem = {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
};

const EXTRA_ITEMS: LainnyaItem[] = [
  {
    id: "hijri",
    title: "Kalender Hijriah",
    subtitle: "Tanggal hijriah hari ini dan info singkat",
    icon: CalendarDays,
    route: "/kalender-hijriah",
  },
  {
    id: "zakat",
    title: "Zakat Calculator",
    subtitle: "Hitung zakat mal dengan cepat",
    icon: Calculator,
    route: "/zakat-calculator",
  },
  {
    id: "kajian",
    title: "Kajian Online",
    subtitle: "Akses kajian dari berbagai sumber",
    icon: PlayCircle,
    route: "/kajian-online",
  },
];

export default function LainnyaScreen() {
  const primaryItems = menuItems.filter((item) => item.id !== "lainnya");

  const renderItem = (item: LainnyaItem) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => router.push(item.route)}
        className="mb-3 bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] px-4 py-4 flex-row items-center"
        activeOpacity={0.8}
      >
        <View className="w-12 h-12 rounded-full bg-[#728d8d]/10 items-center justify-center mr-3">
          <Icon size={22} color="#728d8d" />
        </View>
        <View className="flex-1">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">{item.title}</Text>
          <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">{item.subtitle}</Text>
        </View>
        <ChevronRight size={18} color="#9ca3af" />
      </TouchableOpacity>
    );
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
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc] flex-1 ml-2">
          Lainnya
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings")}
          className="w-11 h-11 items-center justify-center"
        >
          <Settings size={20} color="#728d8d" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <MenuBeranda items={primaryItems} columns={4} />

        <Text className="px-4 mt-4 mb-2 text-[#4b5563] dark:text-[#cbd5e1] text-xs font-semibold uppercase">
          Lainnya
        </Text>

        <View className="px-4">
          {EXTRA_ITEMS.map(renderItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
