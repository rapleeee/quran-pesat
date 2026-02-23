import { menuItems } from "@/data/menu-beranda";
import { MenuItem } from "@/types/menu";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
const DEFAULT_COLUMNS = 4;
const DEFAULT_GAP = 12;
const HORIZONTAL_PADDING = 16;

type MenuBerandaProps = {
  items?: MenuItem[];
  columns?: number;
  gap?: number;
};

export default function MenuBeranda({
  items = menuItems,
  columns = DEFAULT_COLUMNS,
  gap = DEFAULT_GAP,
}: MenuBerandaProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const availableWidth = width - HORIZONTAL_PADDING * 2;
  const itemSize = (availableWidth - gap * (columns - 1)) / columns;

  const handlePress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View className="px-4 mt-6">
      <View className="flex-row flex-wrap">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isLastColumn = (index + 1) % columns === 0;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item)}
              style={{ width: itemSize, marginRight: isLastColumn ? 0 : gap }}
              className="items-center mb-6"
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
                className="text-xs text-center text-gray-700 dark:text-[#e5e7eb]"
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
