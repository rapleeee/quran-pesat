import React from "react";
import { Text, TouchableOpacity } from "react-native";

type NextSurahButtonProps = {
  onPress: () => void;
};

export function NextSurahButton({ onPress }: NextSurahButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#728d8d] rounded-xl py-3 px-4 items-center"
      activeOpacity={0.8}
    >
      <Text className="text-white font-semibold">Surah Selanjutnya</Text>
    </TouchableOpacity>
  );
}
