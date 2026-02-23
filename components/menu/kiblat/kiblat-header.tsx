import { ArrowLeft, EllipsisVertical } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface KiblatHeaderProps {
  onBackPress: () => void;
  onMenuPress: () => void;
}

export function KiblatHeader({ onBackPress, onMenuPress }: KiblatHeaderProps) {
  return (
    <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center justify-between">
      <TouchableOpacity
        onPress={onBackPress}
        className="w-10 h-10 rounded-full items-center justify-center"
      >
        <ArrowLeft size={24} color="#728d8d" />
      </TouchableOpacity>

      <View className="flex-row items-center gap-2">
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc]">Arah Kiblat</Text>
      </View>

      <TouchableOpacity
        onPress={onMenuPress}
        className="w-10 h-10 rounded-full  items-center justify-center"
      >
        <EllipsisVertical size={24} color="#728d8d" />
      </TouchableOpacity>
    </View>
  );
}
