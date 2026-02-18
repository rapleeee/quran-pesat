import { DzikirHarianItem, DzikirType, DzikirTypeFilter } from "@/types/dzikir";
import { useCallback, useEffect, useState } from "react";

const DZIKIR_API_BASE_URL = "https://muslim-api-three.vercel.app/v1/dzikir";

interface DzikirApiPayload {
  status?: string;
  data?: unknown;
}

interface UseDzikirHarianResult {
  items: DzikirHarianItem[];
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

function normalizeDzikirType(value: string | null): DzikirType {
  if (!value) {
    return "solat";
  }

  const normalized = value.toLowerCase().trim();
  if (normalized === "pagi") {
    return "pagi";
  }
  if (normalized === "sore") {
    return "sore";
  }
  return "solat";
}

function normalizeDzikirItems(payload: unknown): DzikirHarianItem[] {
  const source = toRecord(payload);
  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : source && Array.isArray((source as DzikirApiPayload).data)
      ? ((source as DzikirApiPayload).data as unknown[])
      : [];

  return rawList
    .map((rawItem, index) => {
      const itemSource = toRecord(rawItem);
      if (!itemSource) {
        return null;
      }

      const id =
        pickString(itemSource, ["id", "index", "nomor", "number"]) ||
        String(index + 1);
      const arabic =
        pickString(itemSource, ["arab", "arabic", "dzikir", "lafadz"]) || "";
      const translation =
        pickString(itemSource, ["translate", "translation", "terjemahan", "arti"]) ||
        "";
      const type = normalizeDzikirType(
        pickString(itemSource, ["type", "kategori", "category"]),
      );
      const repeat = pickString(itemSource, ["repeat", "pengulangan", "count"]) || "-";

      if (!arabic && !translation) {
        return null;
      }

      return {
        id,
        arabic,
        translation,
        type,
        repeat,
      };
    })
    .filter((item: DzikirHarianItem | null): item is DzikirHarianItem => item !== null);
}

function buildDzikirEndpoint(type: DzikirTypeFilter): string {
  if (type === "all") {
    return DZIKIR_API_BASE_URL;
  }

  const query = new URLSearchParams({ type }).toString();
  return `${DZIKIR_API_BASE_URL}?${query}`;
}

export function useDzikirHarian(type: DzikirTypeFilter): UseDzikirHarianResult {
  const [items, setItems] = useState<DzikirHarianItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDzikir = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = buildDzikirEndpoint(type);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Gagal mengambil data dzikir");
      }

      const payload = await response.json();
      const normalizedItems = normalizeDzikirItems(payload);
      if (normalizedItems.length === 0) {
        throw new Error("Data dzikir tidak ditemukan");
      }

      setItems(normalizedItems);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat mengambil dzikir",
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    void fetchDzikir();
  }, [fetchDzikir]);

  return {
    items,
    loading,
    error,
    refetch: fetchDzikir,
  };
}
