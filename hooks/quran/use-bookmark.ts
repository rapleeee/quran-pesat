import { Ayat, Bookmark, Surah } from "@/types/quran";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const BOOKMARK_STORAGE_KEY = "quran_bookmarks";

export function useBookmark() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from storage
  const loadBookmarks = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error loading bookmarks:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Save bookmarks to storage
  const saveBookmarks = useCallback(async (newBookmarks: Bookmark[]) => {
    try {
      await AsyncStorage.setItem(
        BOOKMARK_STORAGE_KEY,
        JSON.stringify(newBookmarks),
      );
      setBookmarks(newBookmarks);
    } catch (error) {
      if (__DEV__) {
        console.error("Error saving bookmarks:", error);
      }
    }
  }, []);

  // Check if an ayat is bookmarked
  const isBookmarked = useCallback(
    (surahNomor: number, ayatNomor: number): boolean => {
      const id = `${surahNomor}-${ayatNomor}`;
      return bookmarks.some((b) => b.id === id);
    },
    [bookmarks],
  );

  // Toggle bookmark for an ayat
  const toggleBookmark = useCallback(
    async (surah: Surah, ayat: Ayat) => {
      const id = `${surah.nomor}-${ayat.nomor}`;
      const exists = bookmarks.find((b) => b.id === id);

      let newBookmarks: Bookmark[];

      if (exists) {
        // Remove bookmark
        newBookmarks = bookmarks.filter((b) => b.id !== id);
      } else {
        // Add bookmark
        const newBookmark: Bookmark = {
          id,
          surahNomor: surah.nomor,
          surahNamaLatin: surah.nama_latin,
          ayatNomor: ayat.nomor,
          ayatAr: ayat.ar,
          ayatIdn: ayat.idn,
          createdAt: new Date().toISOString(),
        };
        newBookmarks = [...bookmarks, newBookmark];
      }

      await saveBookmarks(newBookmarks);
      return !exists; // Return true if added, false if removed
    },
    [bookmarks, saveBookmarks],
  );

  // Remove a bookmark by id
  const removeBookmark = useCallback(
    async (id: string) => {
      const newBookmarks = bookmarks.filter((b) => b.id !== id);
      await saveBookmarks(newBookmarks);
    },
    [bookmarks, saveBookmarks],
  );

  // Clear all bookmarks
  const clearAllBookmarks = useCallback(async () => {
    await saveBookmarks([]);
  }, [saveBookmarks]);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarks,
    loading,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
    refreshBookmarks: loadBookmarks,
  };
}
