import { DzikirCategory } from "@/data/dzikir";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DzikirCategoryTabsProps {
  activeCategory: DzikirCategory;
  onChange: (category: DzikirCategory) => void;
}

export function DzikirCategoryTabs({
  activeCategory,
  onChange,
}: DzikirCategoryTabsProps) {
  return (
    <View className="w-full flex-row">
      <TouchableOpacity
        onPress={() => onChange("harian")}
        className={`flex-1 min-h-[46px] items-center justify-center border-b-2 ${
          activeCategory === "harian"
            ? "border-[#728d8d] bg-[#728d8d]/10"
            : "border-transparent bg-white"
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            activeCategory === "harian" ? "text-[#336363]" : "text-[#4b5563]"
          }`}
        >
          Dzikir Harian
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange("duha")}
        className={`flex-1 min-h-[46px] items-center justify-center border-b-2 ${
          activeCategory === "duha"
            ? "border-[#728d8d] bg-[#728d8d]/10"
            : "border-transparent bg-white"
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            activeCategory === "duha" ? "text-[#336363]" : "text-[#4b5563]"
          }`}
        >
          Dzikir Duha
        </Text>
      </TouchableOpacity>
    </View>
  );
}
