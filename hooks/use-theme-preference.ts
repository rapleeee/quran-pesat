import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "light" | "dark";

const THEME_PREFERENCE_KEY = "theme_preference";
const DEFAULT_THEME: ThemePreference = "light";

let cachedTheme: ThemePreference = DEFAULT_THEME;
let hydrated = false;
const listeners = new Set<(theme: ThemePreference) => void>();

function notify(theme: ThemePreference) {
  cachedTheme = theme;
  listeners.forEach((listener) => listener(theme));
}

async function hydrateThemePreference(): Promise<ThemePreference> {
  if (hydrated) {
    return cachedTheme;
  }
  try {
    const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
    if (stored === "light" || stored === "dark") {
      cachedTheme = stored;
    }
  } catch {
    // Ignore hydration errors
  } finally {
    hydrated = true;
  }
  return cachedTheme;
}

export function useThemePreference() {
  const [theme, setTheme] = useState<ThemePreference>(cachedTheme);
  const { setColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    let active = true;

    hydrateThemePreference().then((nextTheme) => {
      if (active) {
        setTheme(nextTheme);
      }
    });

    const listener = (nextTheme: ThemePreference) => {
      if (active) {
        setTheme(nextTheme);
      }
    };

    listeners.add(listener);
    return () => {
      active = false;
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  const updateTheme = useCallback(async (nextTheme: ThemePreference) => {
    notify(nextTheme);
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, nextTheme);
    } catch {
      // Ignore persistence errors
    }
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    setTheme: updateTheme,
  };
}
