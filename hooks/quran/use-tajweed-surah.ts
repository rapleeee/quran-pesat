import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";

export type TajweedSegment = {
  rule?: string;
  text: string;
};

type TajweedAyah = {
  segments: TajweedSegment[];
  text?: string;
};

export type TajweedMap = Record<number, TajweedAyah>;

const TAJWEED_BASE_URL =
  "https://raw.githubusercontent.com/CheeseWithSauce/TheHolyQuranJSONFormat/main/tajweedsurahs";
const TAJWEED_CACHE_PREFIX = "quran_tajweed_surah";
const TAJWEED_CACHE_VERSION = 3;

function stripTags(input: string) {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseTajweedHtml(html: string): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  const tokens = html.split(/(<[^>]+>)/g).filter(Boolean);
  const stack: Array<string | undefined> = [];
  let currentRule: string | undefined;

  for (const token of tokens) {
    if (token.startsWith("<")) {
      if (token.startsWith("</")) {
        currentRule = stack.pop();
        continue;
      }

      const classMatch = token.match(/class=['"]?([^"'\s>]+)['"]?/i);
      const isSelfClosing = /\/>$/.test(token);

      if (!isSelfClosing) {
        stack.push(currentRule);
      }

      if (classMatch?.[1]) {
        currentRule = classMatch[1];
      }

      if (isSelfClosing) {
        currentRule = stack.pop();
      }

      continue;
    }

    const text = stripTags(token);
    if (text) {
      segments.push({ rule: currentRule, text });
    }
  }

  return segments;
}

function buildCacheKey(surahNumber: number) {
  return `${TAJWEED_CACHE_PREFIX}_${surahNumber}_v${TAJWEED_CACHE_VERSION}`;
}

function parseAyahNumber(verse: Record<string, unknown>) {
  const direct =
    (verse.ayah as number | undefined) ??
    (verse.ayah_number as number | undefined) ??
    (verse.verse_number as number | undefined);

  if (typeof direct === "number" && Number.isFinite(direct)) {
    return direct;
  }

  const verseKey = verse.verse_key as string | undefined;
  if (verseKey) {
    const parts = verseKey.split(":");
    const ayahFromKey = Number(parts[1]);
    if (Number.isFinite(ayahFromKey)) {
      return ayahFromKey;
    }
  }

  return null;
}

function normalizeSegments(input: unknown): TajweedSegment[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const segments: TajweedSegment[] = [];

  for (const segment of input) {
    if (!segment || typeof segment !== "object") {
      continue;
    }
    const data = segment as { rule?: unknown; text?: unknown };
    if (typeof data.text !== "string") {
      continue;
    }
    segments.push({
      rule: typeof data.rule === "string" ? data.rule : undefined,
      text: stripTags(data.text),
    });
  }

  return segments;
}

function buildTajweedMap(raw: unknown): TajweedMap {
  const map: TajweedMap = {};
  const data =
    raw && typeof raw === "object" && "verses" in raw
      ? (raw as { verses?: unknown }).verses
      : raw;
  const verses = Array.isArray(data) ? data : [];

  verses.forEach((verse) => {
    if (!verse || typeof verse !== "object") {
      return;
    }
    const ayah = parseAyahNumber(verse as Record<string, unknown>);
    if (!ayah) {
      return;
    }
    const tajweedSegments = normalizeSegments(
      (verse as Record<string, unknown>).tajweed_segments,
    );
    const textAr =
      (verse as Record<string, unknown>).text_ar ??
      (verse as Record<string, unknown>).text_uthmani;
    const htmlCandidate =
      (verse as Record<string, unknown>).text_tajweed_html ??
      (verse as Record<string, unknown>).text_tajweed ??
      (verse as Record<string, unknown>).text;
    const tajweedHtml =
      typeof htmlCandidate === "string" && htmlCandidate.includes("<")
        ? htmlCandidate
        : undefined;
    const segments = tajweedHtml
      ? parseTajweedHtml(tajweedHtml)
      : tajweedSegments;
    const text =
      typeof textAr === "string"
        ? textAr
        : typeof htmlCandidate === "string"
          ? stripTags(htmlCandidate)
          : undefined;

    map[ayah] = {
      segments,
      text: typeof text === "string" ? text : undefined,
    };
  });

  return map;
}

async function fetchTajweedSurah(surahNumber: number) {
  const padded = surahNumber.toString().padStart(3, "0");
  const urls = [
    `${TAJWEED_BASE_URL}/${padded}.json`,
    `${TAJWEED_BASE_URL}/${surahNumber}.json`,
  ];

  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status} for ${url}`);
        continue;
      }
      const json = await response.json();
      return json;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Fetch failed");
    }
  }

  throw lastError ?? new Error("Unable to fetch tajweed data");
}

export function useTajweedSurah(surahNumber: number | null, enabled: boolean) {
  const cacheKey = useMemo(
    () => (surahNumber ? buildCacheKey(surahNumber) : null),
    [surahNumber],
  );

  const [map, setMap] = useState<TajweedMap | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!enabled || !surahNumber || !cacheKey) {
        setLoading(false);
        setMap(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as {
            version?: number;
            data?: TajweedMap;
          };
          if (parsed?.version === TAJWEED_CACHE_VERSION && parsed.data) {
            if (active) {
              setMap(parsed.data);
              setLoading(false);
            }
            return;
          }
        }

        const raw = await fetchTajweedSurah(surahNumber);
        const nextMap = buildTajweedMap(raw);
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({
            version: TAJWEED_CACHE_VERSION,
            data: nextMap,
          }),
        );

        if (active) {
          setMap(nextMap);
        }
      } catch (err) {
        if (__DEV__) {
          console.error("Failed to load tajweed data:", err);
        }
        if (active) {
          setError("Gagal memuat tajwid");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [cacheKey, enabled, surahNumber]);

  return { map, loading, error };
}
