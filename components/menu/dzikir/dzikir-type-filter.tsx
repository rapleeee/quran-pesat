import { DZIKIR_TYPE_OPTIONS } from "@/data/dzikir";
import { DzikirTypeFilter } from "@/types/dzikir";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DzikirTypeFilterProps {
  activeType: DzikirTypeFilter;
  onChange: (type: DzikirTypeFilter) => void;
}

export function DzikirTypeTabs({ activeType, onChange }: DzikirTypeFilterProps) {
  return (
    <View className="mx-4 mt-3 mb-1 rounded-xl overflow-hidden border border-[#d8d8d8] bg-white flex-row">
      {DZIKIR_TYPE_OPTIONS.map((typeItem, index) => (
        <TouchableOpacity
          key={typeItem.value}
          onPress={() => onChange(typeItem.value)}
          className={`flex-1 min-h-[38px] items-center justify-center ${
            activeType === typeItem.value ? "bg-[#336363]" : "bg-white"
          } ${index < DZIKIR_TYPE_OPTIONS.length - 1 ? "border-r border-[#e5e7eb]" : ""}`}
        >
          <Text
            className={`text-xs font-semibold ${
              activeType === typeItem.value ? "text-white" : "text-[#4b5563]"
            }`}
          >
            {typeItem.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
