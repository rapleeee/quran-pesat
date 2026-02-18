import { HaditsItem } from "@/types/hadits";
import { useCallback, useEffect, useMemo, useState } from "react";

const HADITS_API_BASE_URL = "https://muslim-api-three.vercel.app/v1/hadits";

interface UseHaditsResult {
  items: HaditsItem[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
  refetch: () => Promise<void>;
}

interface UseHaditsDetailResult {
  item: HaditsItem | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function pickString(source: Record<string, unknown>, keys: string[]): string | null {
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

function pickNomor(
  source: Record<string, unknown>,
  fallbackNomor?: string,
  fallbackIndex?: number,
): string | null {
  const primaryNomor = pickString(source, ["nomor", "no", "number", "index"]);
  if (primaryNomor) {
    return primaryNomor;
  }

  const idValue = source.id;
  if (typeof idValue === "number") {
    return String(idValue);
  }

  if (typeof idValue === "string") {
    const normalized = idValue.trim();
    if (/^\d+$/.test(normalized)) {
      return normalized;
    }
  }

  if (fallbackNomor && fallbackNomor.trim().length > 0) {
    return fallbackNomor.trim();
  }

  if (typeof fallbackIndex === "number") {
    return String(fallbackIndex + 1);
  }

  return null;
}

function pickTranslation(source: Record<string, unknown>): string {
  const primaryTranslation =
    pickString(source, [
      "indo",
      "indonesia",
      "terjemah",
      "terjemahan",
      "arti",
      "translation",
      "text_id",
      "isi",
      "content",
    ]) ?? "";

  if (primaryTranslation) {
    return primaryTranslation;
  }

  if (typeof source.id === "string") {
    const idValue = source.id.trim();
    if (idValue.length > 18 && !/^\d+$/.test(idValue)) {
      return idValue;
    }
  }

  return "";
}

function extractPayloadArray(payload: unknown): unknown[] {
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
    source.hadits,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  if (
    source.data &&
    typeof source.data === "object" &&
    !Array.isArray(source.data)
  ) {
    const nested = source.data as Record<string, unknown>;
    for (const value of Object.values(nested)) {
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  return [];
}

function extractPayloadObject(payload: unknown): unknown {
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
    source.hadits,
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

function normalizeHaditsItem(
  value: unknown,
  options?: { fallbackIndex?: number; fallbackNomor?: string },
): HaditsItem | null {
  const source = toRecord(value);
  if (!source) {
    return null;
  }

  const nomor = pickNomor(source, options?.fallbackNomor, options?.fallbackIndex);

  if (!nomor) {
    return null;
  }

  const title =
    pickString(source, ["judul", "title", "name", "nama"]) ?? `Hadits #${nomor}`;
  const arabic = pickString(source, ["arab", "arabic", "teksArab", "text_arab"]) ?? "";
  const translation = pickTranslation(source);
  const sourceLabel = pickString(source, [
    "kitab",
    "source",
    "slug",
    "riwayat",
    "keterangan",
  ]);

  if (!arabic && !translation && !title) {
    return null;
  }

  return {
    nomor,
    title,
    arabic,
    translation,
    source: sourceLabel ?? undefined,
  };
}

function buildHaditsListEndpoint(query: string): string {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return HADITS_API_BASE_URL;
  }

  const params = new URLSearchParams({ query: normalizedQuery });
  return `${HADITS_API_BASE_URL}/find?${params.toString()}`;
}

function buildHaditsDetailEndpoint(nomor: string): string {
  const params = new URLSearchParams({ nomor });
  return `${HADITS_API_BASE_URL}?${params.toString()}`;
}

export function useHadits(query: string): UseHaditsResult {
  const [items, setItems] = useState<HaditsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const normalizedQuery = useMemo(() => query.trim(), [query]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = buildHaditsListEndpoint(normalizedQuery);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Gagal mengambil data hadits");
      }

      const payload = await response.json();
      const normalizedItems = extractPayloadArray(payload)
        .map((item, index) => normalizeHaditsItem(item, { fallbackIndex: index }))
        .filter((item: HaditsItem | null): item is HaditsItem => item !== null);

      if (normalizedItems.length === 0) {
        setItems([]);
        return;
      }

      setItems(normalizedItems);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat mengambil data hadits",
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [normalizedQuery]);

  useEffect(() => {
    const delay = setTimeout(() => {
      void fetchItems();
    }, normalizedQuery ? 320 : 0);

    return () => clearTimeout(delay);
  }, [fetchItems, normalizedQuery]);

  return {
    items,
    loading,
    error,
    isSearching: normalizedQuery.length > 0,
    refetch: fetchItems,
  };
}

export function useHaditsDetail(nomor?: string): UseHaditsDetailResult {
  const [item, setItem] = useState<HaditsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!nomor) {
      setItem(null);
      setLoading(false);
      setError("Nomor hadits tidak valid");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = buildHaditsDetailEndpoint(nomor);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Gagal mengambil detail hadits");
      }

      const payload = await response.json();
      const normalizedItem = normalizeHaditsItem(extractPayloadObject(payload), {
        fallbackNomor: nomor,
      });
      if (!normalizedItem) {
        throw new Error("Detail hadits tidak ditemukan");
      }

      setItem(normalizedItem);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat mengambil detail hadits",
      );
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [nomor]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return {
    item,
    loading,
    error,
    refetch: fetchDetail,
  };
}
