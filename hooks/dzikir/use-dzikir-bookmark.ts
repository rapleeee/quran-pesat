import { DzikirHarianItem } from "@/types/dzikir";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const DZIKIR_BOOKMARKS_STORAGE_KEY = "dzikir_bookmarks_v1";

function getDzikirBookmarkKey(item: DzikirHarianItem): string {
  return `${item.type}::${item.id}::${item.arabic}`;
}

function isDzikirItem(value: unknown): value is DzikirHarianItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const source = value as Record<string, unknown>;
  return (
    typeof source.id === "string" &&
    typeof source.arabic === "string" &&
    typeof source.translation === "string" &&
    typeof source.repeat === "string" &&
    (source.type === "pagi" || source.type === "sore" || source.type === "solat")
  );
}

interface UseDzikirBookmarkResult {
  bookmarks: DzikirHarianItem[];
  loading: boolean;
  refreshBookmarks: () => Promise<void>;
  isBookmarked: (item: DzikirHarianItem) => boolean;
  toggleBookmark: (item: DzikirHarianItem) => Promise<boolean>;
}

export function useDzikirBookmark(): UseDzikirBookmarkResult {
  const [bookmarks, setBookmarks] = useState<DzikirHarianItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(DZIKIR_BOOKMARKS_STORAGE_KEY);
      if (!stored) {
        setBookmarks([]);
        return;
      }

      const parsed = JSON.parse(stored) as unknown;
      if (!Array.isArray(parsed)) {
        setBookmarks([]);
        return;
      }

      const normalized = parsed.filter(isDzikirItem);
      setBookmarks(normalized);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBookmarks = useCallback(async (nextBookmarks: DzikirHarianItem[]) => {
    await AsyncStorage.setItem(
      DZIKIR_BOOKMARKS_STORAGE_KEY,
      JSON.stringify(nextBookmarks),
    );
    setBookmarks(nextBookmarks);
  }, []);

  const isBookmarked = useCallback(
    (item: DzikirHarianItem): boolean => {
      const key = getDzikirBookmarkKey(item);
      return bookmarks.some((bookmark) => getDzikirBookmarkKey(bookmark) === key);
    },
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (item: DzikirHarianItem): Promise<boolean> => {
      const key = getDzikirBookmarkKey(item);
      const exists = bookmarks.some(
        (bookmark) => getDzikirBookmarkKey(bookmark) === key,
      );

      const nextBookmarks = exists
        ? bookmarks.filter((bookmark) => getDzikirBookmarkKey(bookmark) !== key)
        : [item, ...bookmarks];

      await saveBookmarks(nextBookmarks);
      return !exists;
    },
    [bookmarks, saveBookmarks],
  );

  useEffect(() => {
    void loadBookmarks();
  }, [loadBookmarks]);

  const stableBookmarks = useMemo(() => bookmarks, [bookmarks]);

  return {
    bookmarks: stableBookmarks,
    loading,
    refreshBookmarks: loadBookmarks,
    isBookmarked,
    toggleBookmark,
  };
}
