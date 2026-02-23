import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const QURAN_MODE_STORAGE_KEY = "quran_mode_arabic_only";

export function useQuranMode() {
  const [isQuranMode, setIsQuranMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMode = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(QURAN_MODE_STORAGE_KEY);
      if (stored !== null) {
        setIsQuranMode(stored === "true");
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error loading Quran mode:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMode = useCallback(async (value: boolean) => {
    setIsQuranMode(value);
    try {
      await AsyncStorage.setItem(
        QURAN_MODE_STORAGE_KEY,
        value ? "true" : "false",
      );
    } catch (error) {
      if (__DEV__) {
        console.error("Error saving Quran mode:", error);
      }
    }
  }, []);

  useEffect(() => {
    loadMode();
  }, [loadMode]);

  return {
    isQuranMode,
    setQuranMode: updateMode,
    loading,
    refreshQuranMode: loadMode,
  };
}
