import { formatCountdown, useNextPrayer } from "@/hooks/prayer/use-next-prayer";
import { JadwalSholat as JadwalSholatType } from "@/hooks/prayer/use-prayer-times";
import { useCurrentTime } from "@/hooks/use-current-time";
import React from "react";
import { Text, View } from "react-native";

interface HomeLiveClockProps {
  jadwal: JadwalSholatType | null;
  loading: boolean;
  error: string | null;
}

export default function HomeLiveClock({
  jadwal,
  loading,
  error,
}: HomeLiveClockProps) {
  const date = useCurrentTime();
  const nextPrayer = useNextPrayer(jadwal);

  return (
    <View className="justify-center items-center mt-6 mb-2">
      <Text className="text-6xl text-white font-medium">
        {date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </Text>
      {nextPrayer ? (
        <View className="items-center w-full mt-2 px-10">
          <View className="items-center flex-row gap-2">
            <Text className="text-white/80 text-sm">{nextPrayer.name} dalam</Text>
            <Text className="text-white text-sm">
              {formatCountdown(
                nextPrayer.hours,
                nextPrayer.minutes,
                nextPrayer.seconds,
              )}
            </Text>
          </View>
        </View>
      ) : (
        <Text className="text-white/80 text-sm mt-2">
          {loading ? "Memuat jadwal..." : error || "-"}
        </Text>
      )}
    </View>
  );
}
