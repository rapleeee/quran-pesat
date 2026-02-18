import { DoaHarianItem } from "@/types/doa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const DOA_API_BASE = "https://open-api.my.id/api/doa";
const DOA_CACHE_STORAGE_KEY = "doa_harian_cache_v1";

interface DoaCachePayload {
  items: DoaHarianItem[];
  savedAt: string;
}

interface UseDoaHarianResult {
  items: DoaHarianItem[];
  loading: boolean;
  error: string | null;
  isUsingCache: boolean;
  lastSyncedAt: string | null;
  refetch: () => Promise<boolean>;
}

interface UseDoaHarianDetailResult {
  item: DoaHarianItem | null;
  loading: boolean;
  error: string | null;
  isUsingCache: boolean;
  refetch: () => Promise<boolean>;
}

function pickString(
  source: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
  }
  return null;
}

function toRecord(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }
  return payload as Record<string, unknown>;
}

function normalizeDoaItem(
  payload: unknown,
  fallbackIndex?: number,
): DoaHarianItem | null {
  const source = toRecord(payload);
  if (!source) {
    return null;
  }

  const id =
    pickString(source, ["id", "nomor", "number", "index"]) ??
    (typeof fallbackIndex === "number" ? String(fallbackIndex + 1) : null);
  const title = pickString(source, ["judul", "title", "nama"]) ?? "";
  const arabic = pickString(source, ["arab", "arabic", "text_arab"]) ?? "";
  const latin = pickString(source, ["latin", "text_latin"]) ?? "";
  const translation =
    pickString(source, ["terjemah", "arti", "translation", "translate"]) ?? "";
  const sourceLabel = pickString(source, ["source", "riwayat", "keterangan"]);

  if (!id || !title || (!arabic && !latin && !translation)) {
    return null;
  }

  return {
    id,
    title,
    arabic,
    latin,
    translation,
    source: sourceLabel ?? undefined,
  };
}

function extractListPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const source = toRecord(payload);
  if (!source) {
    return [];
  }

  const candidates = [
    source.data,
    source.result,
    source.results,
    source.items,
    source.doa,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function extractDetailPayload(payload: unknown): unknown {
  if (Array.isArray(payload)) {
    return payload[0] ?? null;
  }

  const source = toRecord(payload);
  if (!source) {
    return null;
  }

  const candidates = [
    source.data,
    source.result,
    source.results,
    source.item,
    source.doa,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate[0];
    }
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate;
    }
  }

  return source;
}

function isDoaHarianItem(value: unknown): value is DoaHarianItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const source = value as Record<string, unknown>;
  return (
    typeof source.id === "string" &&
    typeof source.title === "string" &&
    typeof source.arabic === "string" &&
    typeof source.latin === "string" &&
    typeof source.translation === "string"
  );
}

async function readDoaCache(): Promise<DoaCachePayload | null> {
  try {
    const stored = await AsyncStorage.getItem(DOA_CACHE_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as DoaCachePayload;
    if (!parsed || !Array.isArray(parsed.items)) {
      return null;
    }

    const validItems = parsed.items.filter(isDoaHarianItem);
    if (validItems.length === 0) {
      return null;
    }

    return {
      items: validItems,
      savedAt:
        typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function writeDoaCache(items: DoaHarianItem[]): Promise<void> {
  if (items.length === 0) {
    return;
  }

  const payload: DoaCachePayload = {
    items,
    savedAt: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(DOA_CACHE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache write failure
  }
}

export function useDoaHarian(): UseDoaHarianResult {
  const [items, setItems] = useState<DoaHarianItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const hydrateFromCache = useCallback(async () => {
    const cached = await readDoaCache();
    if (!cached) {
      return;
    }

    setItems((currentItems) => (currentItems.length > 0 ? currentItems : cached.items));
    setIsUsingCache(true);
    setLastSyncedAt(cached.savedAt);
  }, []);

  const fetchItems = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(DOA_API_BASE);
      if (!response.ok) {
        throw new Error("Gagal mengambil data doa harian");
      }

      const payload = await response.json();
      const normalizedItems = extractListPayload(payload)
        .map((item, index) => normalizeDoaItem(item, index))
        .filter((item: DoaHarianItem | null): item is DoaHarianItem => item !== null);

      if (normalizedItems.length === 0) {
        throw new Error("Format data doa harian tidak dikenali");
      }

      setItems(normalizedItems);
      setIsUsingCache(false);
      const syncedAt = new Date().toISOString();
      setLastSyncedAt(syncedAt);
      await writeDoaCache(normalizedItems);
      return true;
    } catch (fetchError) {
      const cached = await readDoaCache();
      if (cached) {
        setItems(cached.items);
        setIsUsingCache(true);
        setLastSyncedAt(cached.savedAt);
        setError("Koneksi bermasalah. Menampilkan data offline tersimpan.");
        return true;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat mengambil doa harian",
      );
      setItems([]);
      setIsUsingCache(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrateFromCache();
  }, [hydrateFromCache]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    isUsingCache,
    lastSyncedAt,
    refetch: fetchItems,
  };
}

export function useDoaHarianDetail(id: string | undefined): UseDoaHarianDetailResult {
  const [item, setItem] = useState<DoaHarianItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  const fetchItem = useCallback(async (): Promise<boolean> => {
    if (!id) {
      setError("ID doa tidak valid");
      setLoading(false);
      setItem(null);
      setIsUsingCache(false);
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${DOA_API_BASE}/${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil detail doa");
      }

      const payload = await response.json();
      const normalizedItem = normalizeDoaItem(extractDetailPayload(payload));
      if (!normalizedItem) {
        throw new Error("Format detail doa tidak dikenali");
      }

      setItem(normalizedItem);
      setIsUsingCache(false);
      return true;
    } catch (fetchError) {
      const cached = await readDoaCache();
      const cachedItem = cached?.items.find((cachedDoa) => cachedDoa.id === id) ?? null;
      if (cachedItem) {
        setItem(cachedItem);
        setIsUsingCache(true);
        setError("Detail dari cache offline karena koneksi bermasalah.");
        return true;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat mengambil detail doa",
      );
      setItem(null);
      setIsUsingCache(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchItem();
  }, [fetchItem]);

  return {
    item,
    loading,
    error,
    isUsingCache,
    refetch: fetchItem,
  };
}
