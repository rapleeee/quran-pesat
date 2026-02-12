import { Surah, SurahDetail } from "@/types/quran";
import { useEffect, useState } from "react";

const BASE_URL = "https://quran-api.santrikoding.com/api";

export function useAllSurah() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/surah`);
        const data = await response.json();
        setSurahs(data);
        setError(null);
      } catch (err) {
        setError("Gagal memuat daftar surah");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSurahs();
  }, []);

  return { surahs, loading, error };
}

export function useSurahDetail(nomor: number) {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurah() {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/surah/${nomor}`);
        const data = await response.json();
        setSurah(data);
        setError(null);
      } catch (err) {
        setError("Gagal memuat surah");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (nomor) {
      fetchSurah();
    }
  }, [nomor]);

  return { surah, loading, error };
}
