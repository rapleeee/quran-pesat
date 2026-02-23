import { ArrowLeft } from "lucide-react-native";
import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DzikirScreenHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: ReactNode;
  backIconSize?: number;
}

export function DzikirScreenHeader({
  title,
  onBack,
  rightAction,
  backIconSize = 24,
}: DzikirScreenHeaderProps) {
  return (
    <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center justify-between relative">
      <TouchableOpacity onPress={onBack} className="w-11 h-11 items-center justify-center">
        <ArrowLeft size={backIconSize} color="#728d8d" />
      </TouchableOpacity>

      <Text
        pointerEvents="none"
        className="text-xl font-bold text-[#363636] dark:text-[#f8fafc] absolute left-0 right-0 text-center"
      >
        {title}
      </Text>

      {rightAction ?? <View className="w-11 h-11" />}
    </View>
  );
}
