import { HaditsItem } from "@/types/hadits";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const HADITS_BOOKMARKS_STORAGE_KEY = "hadits_bookmarks_v1";

function getHaditsBookmarkKey(item: HaditsItem): string {
  return `${item.nomor}::${item.title}`;
}

function isHaditsItem(value: unknown): value is HaditsItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const source = value as Record<string, unknown>;
  return (
    typeof source.nomor === "string" &&
    typeof source.title === "string" &&
    typeof source.arabic === "string" &&
    typeof source.translation === "string" &&
    (typeof source.source === "string" || typeof source.source === "undefined")
  );
}

interface UseHaditsBookmarkResult {
  bookmarks: HaditsItem[];
  loading: boolean;
  refreshBookmarks: () => Promise<void>;
  isBookmarked: (item: HaditsItem) => boolean;
  toggleBookmark: (item: HaditsItem) => Promise<boolean>;
}

export function useHaditsBookmark(): UseHaditsBookmarkResult {
  const [bookmarks, setBookmarks] = useState<HaditsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(HADITS_BOOKMARKS_STORAGE_KEY);
      if (!stored) {
        setBookmarks([]);
        return;
      }

      const parsed = JSON.parse(stored) as unknown;
      if (!Array.isArray(parsed)) {
        setBookmarks([]);
        return;
      }

      const normalized = parsed.filter(isHaditsItem);
      setBookmarks(normalized);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBookmarks = useCallback(async (nextBookmarks: HaditsItem[]) => {
    await AsyncStorage.setItem(
      HADITS_BOOKMARKS_STORAGE_KEY,
      JSON.stringify(nextBookmarks),
    );
    setBookmarks(nextBookmarks);
  }, []);

  const isBookmarked = useCallback(
    (item: HaditsItem): boolean => {
      const key = getHaditsBookmarkKey(item);
      return bookmarks.some((bookmark) => getHaditsBookmarkKey(bookmark) === key);
    },
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (item: HaditsItem): Promise<boolean> => {
      const key = getHaditsBookmarkKey(item);
      const exists = bookmarks.some(
        (bookmark) => getHaditsBookmarkKey(bookmark) === key,
      );

      const nextBookmarks = exists
        ? bookmarks.filter((bookmark) => getHaditsBookmarkKey(bookmark) !== key)
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
