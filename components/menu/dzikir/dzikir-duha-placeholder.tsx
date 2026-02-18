import { DZIKIR_DUHA_DESCRIPTION, DZIKIR_DUHA_NOTE } from "@/data/dzikir";
import React from "react";
import { Text, View } from "react-native";

export function DzikirDuhaPlaceholder() {
  return (
    <View className="flex-1 px-4 pt-2">
      <View className="rounded-2xl bg-white border border-[#e5e5e5] p-4">
        <Text className="text-[#1f2937] font-semibold text-base">Dzikir Duha</Text>
        <Text className="text-[#4b5563] text-sm mt-2 leading-6">
          {DZIKIR_DUHA_DESCRIPTION}
        </Text>
        <Text className="text-[#6b7280] text-xs mt-3">{DZIKIR_DUHA_NOTE}</Text>
      </View>
    </View>
  );
}
