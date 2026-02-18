import { MapPin } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface KiblatLocationInfoProps {
  locationLabel: string | null;
  directionLabel: string;
  loading: boolean;
  error: string | null;
}

export function KiblatLocationInfo({
  locationLabel,
  directionLabel,
  loading,
  error,
}: KiblatLocationInfoProps) {
  return (
    <View className="items-center px-4 mt-12">
      <View className="flex-row items-center">
        <MapPin size={18} color="#363636" />
        <Text className="ml-1 text-[#363636] font-bold text-xl">
          {locationLabel || "Lokasi belum tersedia"}
        </Text>
      </View>

      <Text className="mt-3 text-center text-[#363636] font-semibold text-base">
        {loading ? "Memperbarui arah kiblat..." : directionLabel}
      </Text>

      {!!error && (
        <Text className="mt-2 text-red-600 text-center">{error}</Text>
      )}
    </View>
  );
}
