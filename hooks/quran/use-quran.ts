import { Surah, SurahDetail } from "@/types/quran";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const BASE_URL = "https://equran.id/api/v2";
const CACHE_VERSION = 2;
const SURAH_LIST_CACHE_KEY = "quran_surah_list_v1";
const SURAH_DETAIL_CACHE_PREFIX = "quran_surah_detail_v1_";

type CachePayload<T> = {
  version: number;
  data: T;
};

function parseCache<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as CachePayload<T>;
    if (parsed?.version === CACHE_VERSION && parsed.data) {
      return parsed.data;
    }
  } catch {
    return null;
  }
  return null;
}

export function useAllSurah() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchSurahs() {
      let hasCache = false;
      try {
        setLoading(true);
        setError(null);

        const cached = parseCache<Surah[]>(
          await AsyncStorage.getItem(SURAH_LIST_CACHE_KEY),
        );
        if (cached && active) {
          hasCache = true;
          setSurahs(cached);
          setLoading(false);
        }

        const response = await fetch(`${BASE_URL}/surat`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = await response.json();
        const data: Surah[] = json.data.map((item: any) => ({
          nomor: item.nomor,
          nama: item.nama,
          nama_latin: item.namaLatin,
          jumlah_ayat: item.jumlahAyat,
          tempat_turun: item.tempatTurun,
          arti: item.arti,
          deskripsi: item.deskripsi,
          audio: item.audioFull["05"],
        }));
        await AsyncStorage.setItem(
          SURAH_LIST_CACHE_KEY,
          JSON.stringify({ version: CACHE_VERSION, data }),
        );
        if (active) {
          setSurahs(data);
          setError(null);
        }
      } catch (err) {
        if (__DEV__) {
          console.error(err);
        }
        if (active && !hasCache) {
          setError("Gagal memuat daftar surah");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchSurahs();
    return () => {
      active = false;
    };
  }, []);

  return { surahs, loading, error };
}

export function useSurahDetail(nomor: number) {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchSurah() {
      if (!nomor) {
        setSurah(null);
        setLoading(false);
        setError(null);
        return;
      }

      const cacheKey = `${SURAH_DETAIL_CACHE_PREFIX}${nomor}`;
      let hasCache = false;

      try {
        setLoading(true);
        setError(null);

        const cached = parseCache<SurahDetail>(
          await AsyncStorage.getItem(cacheKey),
        );
        if (cached && active) {
          hasCache = true;
          setSurah(cached);
          setLoading(false);
        }

        const response = await fetch(`${BASE_URL}/surat/${nomor}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = await response.json();
        const item = json.data;
        const data: SurahDetail = {
          nomor: item.nomor,
          nama: item.nama,
          nama_latin: item.namaLatin,
          jumlah_ayat: item.jumlahAyat,
          tempat_turun: item.tempatTurun,
          arti: item.arti,
          deskripsi: item.deskripsi,
          audio: item.audioFull["05"],
          ayat: item.ayat.map((a: any) => ({
            id: a.nomorAyat,
            surah: item.nomor,
            nomor: a.nomorAyat,
            ar: a.teksArab,
            tr: a.teksLatin,
            idn: a.teksIndonesia,
          })),
        };
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({ version: CACHE_VERSION, data }),
        );
        if (active) {
          setSurah(data);
          setError(null);
        }
      } catch (err) {
        if (__DEV__) {
          console.error(err);
        }
        if (active && !hasCache) {
          setError("Gagal memuat surah");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchSurah();
    return () => {
      active = false;
    };
  }, [nomor]);

  return { surah, loading, error };
}
