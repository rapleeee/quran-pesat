import { menuItems } from "@/data/menu-beranda";
import { MenuItem } from "@/types/menu";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_SIZE = (SCREEN_WIDTH - 48) / 4; // 4 kolom dengan padding 24 kiri-kanan

export default function MenuBeranda() {
  const router = useRouter();

  const handlePress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View className="px-4 pt-6 pb-8">
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item)}
              style={{ width: ITEM_SIZE }}
              className="items-center mb-5"
            >
              <View
                className="p-3 rounded-full mb-2"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon
                  color={item.color}
                  size={24}
                  fillOpacity={0.4}
                  fill={item.color}
                />
              </View>
              <Text
                className="text-xs text-center text-gray-700"
                numberOfLines={2}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
