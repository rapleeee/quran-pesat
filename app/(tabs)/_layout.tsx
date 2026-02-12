import { Tabs } from "expo-router";
import React from "react";

import { FloatingTabBar } from "@/components/ui/floating-tab-bar";
import { BookOpen, LucideHome, Newspaper, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <LucideHome
              fill={color}
              size={22}
              color={color}
              fillOpacity={0.2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alquran"
        options={{
          title: "Al-Quran",
          tabBarIcon: ({ color }) => (
            <BookOpen fill={color} size={22} color={color} fillOpacity={0.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="artikel"
        options={{
          title: "Artikel",
          tabBarIcon: ({ color }) => (
            <Newspaper fill={color} size={22} color={color} fillOpacity={0.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Pengaturan",
          tabBarIcon: ({ color }) => (
            <Settings fill={color} size={22} color={color} fillOpacity={0.2} />
          ),
        }}
      />
    </Tabs>
  );
}
