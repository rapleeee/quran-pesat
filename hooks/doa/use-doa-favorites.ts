import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const DOA_FAVORITES_STORAGE_KEY = "doa_harian_favorites_v1";

interface UseDoaFavoritesResult {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<boolean>;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function useDoaFavorites(): UseDoaFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(DOA_FAVORITES_STORAGE_KEY);
      if (!stored) {
        setFavoriteIds([]);
        return;
      }

      const parsed = JSON.parse(stored);
      if (isStringArray(parsed)) {
        setFavoriteIds(parsed);
      } else {
        setFavoriteIds([]);
      }
    } catch {
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFavorites = useCallback(async (newFavorites: string[]) => {
    await AsyncStorage.setItem(
      DOA_FAVORITES_STORAGE_KEY,
      JSON.stringify(newFavorites),
    );
    setFavoriteIds(newFavorites);
  }, []);

  const isFavorite = useCallback(
    (id: string): boolean => favoriteIds.includes(id),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (id: string): Promise<boolean> => {
      const alreadyFavorite = favoriteIds.includes(id);
      const newFavorites = alreadyFavorite
        ? favoriteIds.filter((favoriteId) => favoriteId !== id)
        : [...favoriteIds, id];

      try {
        await saveFavorites(newFavorites);
        return !alreadyFavorite;
      } catch {
        return alreadyFavorite;
      }
    },
    [favoriteIds, saveFavorites],
  );

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const stableFavorites = useMemo(() => favoriteIds, [favoriteIds]);

  return {
    favoriteIds: stableFavorites,
    loading,
    isFavorite,
    toggleFavorite,
  };
}
