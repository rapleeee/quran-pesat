import { AsmaulHusnaItem } from "@/types/asmaul-husna";
import { useCallback, useEffect, useState } from "react";

const ASMAUL_HUSNA_API_URL = "https://asmaul-husna-api.vercel.app/api/all";

interface AsmaulHusnaResponse {
  data?: unknown;
}

interface UseAsmaulHusnaResult {
  items: AsmaulHusnaItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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

function normalizeItems(payload: unknown): AsmaulHusnaItem[] {
  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        Array.isArray((payload as AsmaulHusnaResponse).data)
      ? ((payload as AsmaulHusnaResponse).data as unknown[])
      : [];

  return rawList
    .map((raw: unknown, index: number) => {
      if (!raw || typeof raw !== "object") {
        return null;
      }

      const source = raw as Record<string, unknown>;
      const id =
        pickString(source, ["id", "urutan", "index", "number"]) ||
        String(index + 1);
      const arabic =
        pickString(source, ["arab", "arabic", "asma", "name", "nama"]) || "";
      const latin =
        pickString(source, ["latin", "latinText", "transliteration"]) || "";
      const meaning =
        pickString(source, [
          "arti",
          "meaning",
          "translation",
          "translation_id",
          "desc",
          "description",
        ]) || "";

      if (!arabic && !latin && !meaning) {
        return null;
      }

      return {
        id,
        arabic,
        latin,
        meaning,
      };
    })
    .filter((item: AsmaulHusnaItem | null): item is AsmaulHusnaItem => item !== null);
}

export function useAsmaulHusna(): UseAsmaulHusnaResult {
  const [items, setItems] = useState<AsmaulHusnaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(ASMAUL_HUSNA_API_URL);
      if (!response.ok) {
        throw new Error("Gagal mengambil data Asmaul Husna");
      }

      const data = await response.json();
      const normalizedItems = normalizeItems(data);
      if (normalizedItems.length === 0) {
        throw new Error("Format data Asmaul Husna tidak dikenali");
      }

      setItems(normalizedItems);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat mengambil Asmaul Husna",
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
}
