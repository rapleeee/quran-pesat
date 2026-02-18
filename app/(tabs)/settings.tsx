import { router } from "expo-router";
import {
  Bell,
  BookOpen,
  Coins,
  ChevronRight,
  CircleHelp,
  Heart,
  Info,
  LogIn,
  LucideIcon,
  Mail,
  Moon,
  Palette,
  Share2,
  Shield,
  Star,
  User,
  Volume2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = "#728d8d";
const STORE_URL =
  "https://play.google.com/store/apps/details?id=com.quranpesat";

const showAlert = (title: string, msg: string) =>
  Alert.alert(title, msg, [{ text: "OK" }]);
const openUrl = (url: string) => Linking.openURL(url).catch(() => {});

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
        <Text className="text-[#363636] font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-gray-400 text-xs mt-0.5">{subtitle}</Text>
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
      <Text className="text-gray-400 text-xs font-medium px-4 mb-2 uppercase">
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

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  const sections = [
    {
      title: "Al-Quran",
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
        {
          icon: Heart,
          title: "Bookmark",
          subtitle: "Lihat ayat yang disimpan",
          onPress: () => router.push("/screen/bookmark"),
        },
      ],
    },
    {
      title: "Notifikasi",
      items: [
        {
          icon: Bell,
          title: "Pengaturan Notifikasi",
          subtitle: "Waktu sholat, ayat harian",
          onPress: () => router.push("/screen/notification"),
        },
      ],
    },
    {
      title: "Tampilan",
      items: [
        {
          icon: Moon,
          title: "Mode Gelap",
          subtitle: "Tampilan lebih nyaman di malam hari",
          toggle: { value: darkMode, onChange: setDarkMode },
        },
        {
          icon: Palette,
          title: "Ukuran Font Arab",
          subtitle: "Sedang",
          onPress: () => showAlert("Info", "Fitur akan segera hadir"),
        },
      ],
    },
    {
      title: "Dukungan",
      items: [
        {
          icon: Coins,
          title: "Dukung Developer",
          subtitle: "Kontribusi untuk biaya maintenance & fitur baru",
          onPress: () => router.push("/donasi"),
        },
        {
          icon: Star,
          title: "Beri Rating",
          subtitle: "Bantu kami dengan memberikan rating",
          onPress: () => openUrl(STORE_URL),
        },
        {
          icon: Share2,
          title: "Bagikan Aplikasi",
          subtitle: "Ajak teman menggunakan aplikasi ini",
          onPress: () => openUrl(STORE_URL),
        },
        {
          icon: Mail,
          title: "Kirim Feedback",
          subtitle: "Sampaikan saran dan masukan",
          onPress: () =>
            openUrl("mailto:support@quranpesat.com?subject=Feedback"),
        },
      ],
    },
    {
      title: "Tentang",
      items: [
        {
          icon: Info,
          title: "Tentang Aplikasi",
          subtitle: "Versi 1.0.0",
          onPress: () =>
            showAlert(
              "Tentang",
              "Quran Pesat v1.0.0\n\nAplikasi Al-Quran lengkap dengan jadwal sholat, audio murottal, dan artikel Islami.",
            ),
        },
        {
          icon: Shield,
          title: "Kebijakan Privasi",
          onPress: () =>
            showAlert(
              "Privasi",
              "Data bookmark dan pengaturan hanya tersimpan di perangkat Anda.",
            ),
        },
        {
          icon: CircleHelp,
          title: "Bantuan & FAQ",
          onPress: () => showAlert("Info", "Fitur akan segera hadir"),
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5]">
        <Text className="font-bold text-2xl text-[#363636]">Pengaturan</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
      >
        <TouchableOpacity
          onPress={() =>
            showAlert(
              "Masuk Akun",
              "Fitur login akan segera hadir. Dengan login, kamu bisa sync bookmark dan progress bacaan.",
            )
          }
          className="mx-4 mb-6 bg-[#728d8d]/10 rounded-xl p-4 flex-row items-center"
        >
          <View className="w-14 h-14 rounded-full bg-[#728d8d]/20 items-center justify-center mr-4">
            <User size={28} color={COLOR} />
          </View>
          <View className="flex-1">
            <Text className="text-[#363636] font-semibold text-lg">
              Masuk Akun
            </Text>
            <Text className="text-gray-400 text-sm">
              Sync bookmark & progress
            </Text>
          </View>
          <View className="bg-[#728d8d] px-3 py-2 rounded-lg flex-row items-center">
            <LogIn size={14} color="#fff" />
            <Text className="text-white font-medium ml-1.5 text-sm">Masuk</Text>
          </View>
        </TouchableOpacity>

        {sections.map((s, i) => (
          <Section key={i} title={s.title} items={s.items} />
        ))}

        <View className="items-center mt-4 mb-12">
          <Text className="text-gray-400 text-xs">Quran Pesat v1.0.0</Text>
          <Text className="text-gray-300 text-xs mt-1">
            Made with ❤️ for Muslims
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
