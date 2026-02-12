import { useRamadhanCountdown } from "@/hooks/use-ramadhan-countdown";
import { Moon } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface RamadhanBannerProps {
  maxDaysToShow?: number; // Hanya tampilkan jika kurang dari X hari
}

export default function RamadhanBanner({
  maxDaysToShow = 60,
}: RamadhanBannerProps) {
  const { daysUntil, isRamadhan, ramadhanDate, loading, error } =
    useRamadhanCountdown();

  if (loading) {
    return (
      <View className="mx-4 p-4 bg-amber-100 rounded-xl flex-row items-center justify-center">
        <ActivityIndicator size="small" color="#f59e0b" />
        <Text className="ml-2 text-amber-700">Memuat...</Text>
      </View>
    );
  }

  if (error) {
    return null; // Jangan tampilkan apa-apa jika error
  }
  if (isRamadhan) {
    return (
      <View className="mx-4 p-4 bg-[#728d8d]/70 rounded-xl border-2 border-[#728d8d] mt-4">
        <View className="flex-row items-center gap-2 mb-1">
          <Moon size={32} color="#363636" fill="orange" fillOpacity={0.8} />
          <View className="flex-col">
            <Text className="text-[#363636] font-bold text-xl">
              Ramadhan Mubarak!
            </Text>
            <Text className="text-[#363636]/90 text-xs">
              Selamat menjalankan ibadah puasa
            </Text>
          </View>
        </View>
      </View>
    );
  }
  // Jika belum Ramadhan tapi masih dalam range
  if (daysUntil > maxDaysToShow) {
    return null; // Jangan tampilkan jika masih terlalu lama
  }

  // Format tanggal Ramadhan
  const formatRamadhanDate = () => {
    if (!ramadhanDate) return "";
    const date = new Date(ramadhanDate);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View className="mx-4 p-2 bg-[#728d8d]/70 rounded-xl border-2 border-[#728d8d]">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          <Moon size={32} color="#363636" fill="orange" fillOpacity={0.9} />
          <View className="flex-col">
            <Text className="text-[#363636] font-bold text-base">
              Ramadhan Tiba!
            </Text>
            <Text className="text-[#363636]/70 text-sm">
              Mulai {formatRamadhanDate()}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 border-l-2 border-[#728d8d] pl-20 ml-auto">
          <Text className="text-[#363636] text-3xl font-bold">{daysUntil}</Text>
          <Text className="text-[#363636]/90 text-lg">hari lagi</Text>
        </View>
      </View>
    </View>
  );
}
