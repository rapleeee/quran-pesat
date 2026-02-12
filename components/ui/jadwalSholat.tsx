import { usePrayerTimes } from "@/hooks/prayer/use-prayer-times";
import { useUserLocation } from "@/hooks/use-user-location";
import { CloudSun, Moon, SunDim, Sunrise, Sunset } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

const JadwalSholat = () => {
  const { provinceName, kabkota } = useUserLocation();
  const {
    jadwal,
    loading: loadingPrayer,
    error,
  } = usePrayerTimes({ provinceName, kabkota });

  return (
    <View>
      <View className="mt-12 px-8 justify-center items-center">
        {loadingPrayer ? (
          <Text>Memuat jadwal sholat...</Text>
        ) : error ? (
          <Text className="text-red-500">{error}</Text>
        ) : jadwal ? (
          <View className="flex-row justify-between w-full">
            <View className="flex py-2 items-center gap-1 ">
              <Text className="text-white">Subuh</Text>
              <Sunrise size={16} color="white" />
              <Text className="font-medium text-white">{jadwal.subuh}</Text>
            </View>
            <View className="flex py-2 items-center gap-1 ">
              <Text className="text-white">Dzuhur</Text>
              <CloudSun size={16} color="white" />
              <Text className="font-medium text-white">{jadwal.dzuhur}</Text>
            </View>
            <View className="flex py-2 items-center gap-1">
              <Text className="text-white">Ashar</Text>
              <SunDim size={16} color="white" />
              <Text className="font-medium text-white">{jadwal.ashar}</Text>
            </View>
            <View className="flex py-2 items-center gap-1 ">
              <Text className="text-white">Maghrib</Text>
              <Sunset size={16} color="white" />
              <Text className="font-medium text-white">{jadwal.maghrib}</Text>
            </View>
            <View className="flex py-2 items-center gap-1">
              <Text className="text-white">Isya</Text>
              <Moon size={16} color="white" />
              <Text className="font-medium text-white">{jadwal.isya}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default JadwalSholat;
