import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const ARABIC_FONT_SIZE_KEY = "arabic_font_size";
const DEFAULT_FONT_SIZE = 24;

export type ArabicFontSizeOption = {
  label: string;
  value: number;
};

export const ARABIC_FONT_SIZES: ArabicFontSizeOption[] = [
  { label: "Kecil", value: 22 },
  { label: "Sedang", value: 24 },
  { label: "Besar", value: 28 },
];

let cachedFontSize = DEFAULT_FONT_SIZE;
let hydrated = false;
const listeners = new Set<(size: number) => void>();

function notify(size: number) {
  cachedFontSize = size;
  listeners.forEach((listener) => listener(size));
}

async function hydrateFontSize(): Promise<number> {
  if (hydrated) {
    return cachedFontSize;
  }
  try {
    const stored = await AsyncStorage.getItem(ARABIC_FONT_SIZE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    if (Number.isFinite(parsed)) {
      cachedFontSize = parsed;
    }
  } catch {
    // Ignore hydration errors
  } finally {
    hydrated = true;
  }
  return cachedFontSize;
}

export function getArabicFontSizeLabel(size: number) {
  return ARABIC_FONT_SIZES.find((option) => option.value === size)?.label ??
    "Sedang";
}

export function useArabicFontSize() {
  const [fontSize, setFontSize] = useState(cachedFontSize);

  useEffect(() => {
    let active = true;

    hydrateFontSize().then((nextSize) => {
      if (active) {
        setFontSize(nextSize);
      }
    });

    const listener = (nextSize: number) => {
      if (active) {
        setFontSize(nextSize);
      }
    };

    listeners.add(listener);
    return () => {
      active = false;
      listeners.delete(listener);
    };
  }, []);

  const updateFontSize = useCallback(async (size: number) => {
    notify(size);
    try {
      await AsyncStorage.setItem(ARABIC_FONT_SIZE_KEY, String(size));
    } catch {
      // Ignore persistence errors
    }
  }, []);

  return {
    fontSize,
    setFontSize: updateFontSize,
  };
}
