import { useQuranMode } from "@/hooks/quran/use-quran-mode";
import { useTajweedSettings } from "@/hooks/quran/use-tajweed-settings";
import { router } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Heart,
  LucideIcon,
  Volume2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = "#728d8d";

type SettingConfig = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
};

function SettingItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  toggle,
}: SettingConfig) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 px-4"
      activeOpacity={0.7}
      disabled={!onPress && !toggle}
    >
      <View className="w-10 h-10 rounded-full bg-[#728d8d]/10 items-center justify-center mr-3">
        <Icon size={20} color={COLOR} />
      </View>
      <View className="flex-1">
        <Text className="text-[#363636] dark:text-[#f8fafc] font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-gray-400 dark:text-[#94a3b8] text-xs mt-0.5">{subtitle}</Text>
        )}
      </View>
      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          trackColor={{ false: "#e5e5e5", true: COLOR }}
          thumbColor="#fff"
        />
      ) : onPress ? (
        <ChevronRight size={20} color="#9ca3af" />
      ) : null}
    </TouchableOpacity>
  );
}

function Section({ title, items }: { title: string; items: SettingConfig[] }) {
  return (
    <View className="mb-4">
      <Text className="text-gray-400 dark:text-[#94a3b8] text-xs font-medium px-4 mb-2 uppercase">
        {title}
      </Text>
      <View className="bg-[#728d8d]/10 rounded-xl mx-4 divide-y divide-[#728d8d]/20">
        {items.map((item, i) => (
          <SettingItem key={i} {...item} />
        ))}
      </View>
    </View>
  );
}

export default function QuranSettings() {
  const { isQuranMode, setQuranMode } = useQuranMode();
  const { isTajweedEnabled, setTajweedEnabled } = useTajweedSettings();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  const sections = [
    {
      title: "Tampilan",
      items: [
        {
          icon: BookOpen,
          title: "Mode Al-Qur'an",
          subtitle: "Sembunyikan latin & arti di halaman surah",
          toggle: { value: isQuranMode, onChange: setQuranMode },
        },
        {
          icon: BookOpen,
          title: "Warna Tajwid",
          subtitle: "Tandai tajwid dengan warna (unduh sekali)",
          toggle: { value: isTajweedEnabled, onChange: setTajweedEnabled },
        },
      ],
    },
    {
      title: "Audio",
      items: [
        {
          icon: Volume2,
          title: "Suara Aktif",
          subtitle: "Aktifkan efek suara",
          toggle: { value: soundEnabled, onChange: setSoundEnabled },
        },
        {
          icon: BookOpen,
          title: "Auto Play Audio",
          subtitle: "Putar audio otomatis saat buka surah",
          toggle: { value: autoPlay, onChange: setAutoPlay },
        },
      ],
    },
    {
      title: "Lainnya",
      items: [
        {
          icon: Heart,
          title: "Bookmark",
          subtitle: "Lihat ayat yang disimpan",
          onPress: () => router.push("/screen/bookmark"),
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#728d8d" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-[#363636] dark:text-[#f8fafc]">
          {"Pengaturan Al-Qur'an"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
      >
        {sections.map((s, i) => (
          <Section key={i} title={s.title} items={s.items} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
