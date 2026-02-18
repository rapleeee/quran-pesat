import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../app/style/global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen
          name="screen/notification"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="asmaul-husna" options={{ headerShown: false }} />
        <Stack.Screen name="donasi" options={{ headerShown: false }} />
        <Stack.Screen name="doa" options={{ headerShown: false }} />
        <Stack.Screen name="doa/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="hadits" options={{ headerShown: false }} />
        <Stack.Screen name="hadits/[nomor]" options={{ headerShown: false }} />
        <Stack.Screen name="hadits-bookmark" options={{ headerShown: false }} />
        <Stack.Screen name="dzikir" options={{ headerShown: false }} />
        <Stack.Screen name="dzikir-bookmark" options={{ headerShown: false }} />
        <Stack.Screen name="voice-arab-guide" options={{ headerShown: false }} />
        <Stack.Screen name="screen/search-all" options={{ headerShown: false }} />
        <Stack.Screen name="kiblat" options={{ headerShown: false }} />
        <Stack.Screen
          name="screen/surah/[nomor]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screen/ayat/[nomor]/[ayat]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="screen/ai-chat" options={{ headerShown: false }} />
        <Stack.Screen name="screen/bookmark" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
