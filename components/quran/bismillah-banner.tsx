import React from "react";
import { Text, View } from "react-native";

type BismillahBannerProps = {
  show: boolean;
};

export function BismillahBanner({ show }: BismillahBannerProps) {
  if (!show) {
    return null;
  }
  return (
    <View className="bg-[#728d8d]/10 py-4 items-center">
      <Text className="font-arabic text-2xl text-[#728d8d]">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </Text>
    </View>
  );
}
