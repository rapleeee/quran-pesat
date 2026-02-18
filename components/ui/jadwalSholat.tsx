import { JadwalSholat as JadwalSholatType } from "@/hooks/prayer/use-prayer-times";
import { CloudSun, Moon, SunDim, Sunrise, Sunset } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface JadwalSholatProps {
  jadwal: JadwalSholatType | null;
  loading: boolean;
  error: string | null;
}

const JadwalSholat = ({ jadwal, loading, error }: JadwalSholatProps) => {
  return (
    <View className="mt-8 px-4 justify-center items-center">
      {loading ? (
        <View className="flex-row justify-between w-full">
          {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (
            <View key={name} className="flex py-2 items-center gap-1">
              <Text className="text-white/90">{name}</Text>
              <View className="h-4 w-4 bg-white/50 rounded-full" />
              <View className="h-4 w-10 bg-white/50 rounded" />
            </View>
          ))}
        </View>
      ) : error ? (
        <Text className="text-red-200 text-center">{error}</Text>
      ) : jadwal ? (
        <View className="flex-row justify-between w-full">
          <View className="flex py-2 items-center gap-1">
            <Text className="text-white">Subuh</Text>
            <Sunrise size={16} color="white" />
            <Text className="font-medium text-white">{jadwal.subuh}</Text>
          </View>
          <View className="flex py-2 items-center gap-1">
            <Text className="text-white">Dzuhur</Text>
            <CloudSun size={16} color="white" />
            <Text className="font-medium text-white">{jadwal.dzuhur}</Text>
          </View>
          <View className="flex py-2 items-center gap-1">
            <Text className="text-white">Ashar</Text>
            <SunDim size={16} color="white" />
            <Text className="font-medium text-white">{jadwal.ashar}</Text>
          </View>
          <View className="flex py-2 items-center gap-1">
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
      ) : (
        <Text className="text-white/80">Jadwal belum tersedia</Text>
      )}
    </View>
  );
};

export default JadwalSholat;
