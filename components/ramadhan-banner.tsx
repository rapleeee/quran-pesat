import { useIslamicEventCountdown } from "@/hooks/use-ramadhan-countdown";
import { Moon } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface RamadhanBannerProps {
  maxDaysToShow?: number;
}

function formatEventDate(dateValue: string | null): string {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function RamadhanBanner({
  maxDaysToShow = 60,
}: RamadhanBannerProps) {
  const { activeEvent, upcomingEvent, loading, error } =
    useIslamicEventCountdown();

  if (loading) {
    return (
      <View className="mx-4 mt-4 p-4 bg-amber-100 rounded-xl flex-row items-center justify-center">
        <ActivityIndicator size="small" color="#f59e0b" />
        <Text className="ml-2 text-amber-700">Memuat...</Text>
      </View>
    );
  }

  if (error) {
    return null;
  }

  if (activeEvent) {
    return (
      <View className="mx-4 p-4 bg-[#728d8d]/70 rounded-xl border-2 border-[#728d8d] mt-4">
        <View className="flex-row items-center gap-2 mb-1">
          <Moon size={32} color="#363636" fill="orange" fillOpacity={0.8} />
          <View className="flex-col flex-1">
            <Text className="text-[#363636] font-bold text-xl">
              {activeEvent.greetingTitle}
            </Text>
            <Text className="text-[#363636]/90 text-xs">
              {activeEvent.greetingSubtitle}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (!upcomingEvent || upcomingEvent.daysUntil > maxDaysToShow) {
    return null;
  }

  return (
    <View className="mx-4 mt-4 p-4 bg-[#728d8d]/70 rounded-xl border-2 border-[#728d8d]">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-2 flex-1">
          <Moon size={30} color="#363636" fill="orange" fillOpacity={0.9} />
          <View className="flex-col flex-1">
            <Text className="text-[#363636] font-bold text-base">
              {upcomingEvent.upcomingTitle}
            </Text>
            <Text className="text-[#363636]/75 text-sm" numberOfLines={2}>
              {upcomingEvent.name} • {formatEventDate(upcomingEvent.gregorianDate)}
            </Text>
          </View>
        </View>
        <View className="items-end border-l-2 border-[#728d8d] pl-3">
          <Text className="text-[#363636] text-2xl font-bold">
            {upcomingEvent.daysUntil}
          </Text>
          <Text className="text-[#363636]/90 text-xs">hari lagi</Text>
        </View>
      </View>
    </View>
  );
}
