import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const TAJWEED_ENABLED_STORAGE_KEY = "quran_tajweed_enabled";

export function useTajweedSettings() {
  const [isTajweedEnabled, setIsTajweedEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadSetting = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(TAJWEED_ENABLED_STORAGE_KEY);
      if (stored !== null) {
        setIsTajweedEnabled(stored === "true");
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error loading tajweed setting:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = useCallback(async (value: boolean) => {
    setIsTajweedEnabled(value);
    try {
      await AsyncStorage.setItem(
        TAJWEED_ENABLED_STORAGE_KEY,
        value ? "true" : "false",
      );
    } catch (error) {
      if (__DEV__) {
        console.error("Error saving tajweed setting:", error);
      }
    }
  }, []);

  useEffect(() => {
    loadSetting();
  }, [loadSetting]);

  return {
    isTajweedEnabled,
    setTajweedEnabled: updateSetting,
    loading,
    refreshTajweedSetting: loadSetting,
  };
}
