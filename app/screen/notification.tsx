import { router } from "expo-router";
import {
  ArrowLeft,
  Bell,
  BellOff,
  BookOpen,
  Clock,
  Moon,
  Sun,
} from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "prayer" | "verse" | "reminder";
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Waktu Dzuhur",
    message:
      "Waktu sholat Dzuhur telah tiba. Jangan lupa untuk menunaikan sholat.",
    time: "12:05",
    type: "prayer",
    read: false,
  },
  {
    id: "2",
    title: "Ayat Hari Ini",
    message:
      '"Dan bersabarlah, sesungguhnya Allah beserta orang-orang yang sabar." - QS. Al-Anfal: 46',
    time: "06:00",
    type: "verse",
    read: false,
  },
  {
    id: "3",
    title: "Waktu Subuh",
    message: "Waktu sholat Subuh telah tiba. Bangun dan raih keberkahan pagi.",
    time: "04:30",
    type: "prayer",
    read: true,
  },
  {
    id: "4",
    title: "Pengingat Tadarus",
    message: "Sudahkah kamu membaca Al-Quran hari ini? Yuk lanjutkan bacaanmu.",
    time: "20:00",
    type: "reminder",
    read: true,
  },
  {
    id: "5",
    title: "Waktu Maghrib",
    message: "Waktu sholat Maghrib telah tiba. Segera tunaikan sholat.",
    time: "17:55",
    type: "prayer",
    read: true,
  },
];

function NotificationCard({ item }: { item: NotificationItem }) {
  const getIcon = () => {
    switch (item.type) {
      case "prayer":
        return item.title.includes("Subuh") ||
          item.title.includes("Maghrib") ? (
          <Moon size={20} color="#728d8d" />
        ) : (
          <Sun size={20} color="#728d8d" />
        );
      case "verse":
        return <BookOpen size={20} color="#728d8d" />;
      case "reminder":
        return <Clock size={20} color="#728d8d" />;
    }
  };

  return (
    <View
      className={`mx-4 mb-3 p-4 rounded-xl ${
        item.read ? "bg-white dark:bg-[#111827]" : "bg-[#728d8d]/10"
      }`}
    >
      <View className="flex-row items-start">
        <View className="w-10 h-10 rounded-full bg-[#728d8d]/20 items-center justify-center mr-3">
          {getIcon()}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`font-semibold text-[#363636] dark:text-[#f8fafc] ${
                !item.read ? "font-bold" : ""
              }`}
            >
              {item.title}
            </Text>
            <Text className="text-xs text-gray-400 dark:text-[#94a3b8]">{item.time}</Text>
          </View>
          <Text className="text-sm text-gray-600 dark:text-[#cbd5e1] leading-5">
            {item.message}
          </Text>
        </View>
        {!item.read && (
          <View className="w-2 h-2 rounded-full bg-[#728d8d] ml-2 mt-2" />
        )}
      </View>
    </View>
  );
}

export default function Notification() {
  const [prayerNotif, setPrayerNotif] = useState(true);
  const [verseNotif, setVerseNotif] = useState(true);
  const [reminderNotif, setReminderNotif] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#728d8d" />
        </TouchableOpacity>
        <Text className="font-bold text-xl text-[#363636] dark:text-[#f8fafc]">Notifikasi</Text>
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-4 py-4">
            {/* Notification Settings */}
            <View className="bg-white dark:bg-[#111827] rounded-xl p-4 mb-4">
              <Text className="font-semibold text-[#363636] dark:text-[#f8fafc] mb-3">
                Pengaturan Notifikasi
              </Text>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <Bell size={18} color="#728d8d" />
                  <Text className="text-[#363636] dark:text-[#f8fafc] ml-2">Waktu Sholat</Text>
                </View>
                <Switch
                  value={prayerNotif}
                  onValueChange={setPrayerNotif}
                  trackColor={{ false: "#e5e5e5", true: "#728d8d" }}
                  thumbColor="#fff"
                />
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <BookOpen size={18} color="#728d8d" />
                  <Text className="text-[#363636] dark:text-[#f8fafc] ml-2">Ayat Harian</Text>
                </View>
                <Switch
                  value={verseNotif}
                  onValueChange={setVerseNotif}
                  trackColor={{ false: "#e5e5e5", true: "#728d8d" }}
                  thumbColor="#fff"
                />
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <Clock size={18} color="#728d8d" />
                  <Text className="text-[#363636] dark:text-[#f8fafc] ml-2">Pengingat Tadarus</Text>
                </View>
                <Switch
                  value={reminderNotif}
                  onValueChange={setReminderNotif}
                  trackColor={{ false: "#e5e5e5", true: "#728d8d" }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* Recent section header */}
            <Text className="font-semibold text-[#363636] dark:text-[#f8fafc] mb-3">
              Notifikasi Terbaru
            </Text>
          </View>
        }
        renderItem={({ item }) => <NotificationCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10 px-4">
            <BellOff size={64} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-[#cbd5e1] mt-4 text-center">
              Belum ada notifikasi
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
