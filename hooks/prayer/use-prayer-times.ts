import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export interface JadwalSholat {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface JadwalHarian {
  tanggal: number;
  tanggal_lengkap: string;
  hari: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface PrayerTimesResult {
  jadwal: JadwalSholat | null;
  provinsi: string;
  kabkota: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CACHE_KEY_PREFIX = "jadwal_sholat_v2_";

function getCacheKey(
  provinceName: string,
  kabkota: string,
  bulan: number,
  tahun: number,
): string {
  return `${CACHE_KEY_PREFIX}${provinceName}_${kabkota}_${bulan}_${tahun}`;
}

interface UsePrayerTimesParams {
  provinceName: string | null;
  kabkota: string | null;
}

export function usePrayerTimes({
  provinceName,
  kabkota,
}: UsePrayerTimesParams): PrayerTimesResult {
  const [jadwal, setJadwal] = useState<JadwalSholat | null>(null);
  const [provinsi, setProvinsi] = useState("");
  const [kabkotaState, setKabkotaState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJadwal = useCallback(async () => {
    if (!provinceName || !kabkota) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const tanggalHariIni = today.getDate();
      const bulan = today.getMonth() + 1;
      const tahun = today.getFullYear();
      const tanggalStr = today.toISOString().split("T")[0];

      const cacheKey = getCacheKey(provinceName, kabkota, bulan, tahun);

      // Cek cache dulu
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Cari jadwal hari ini dari array
        const jadwalHariIni = parsed.jadwalBulan.find(
          (j: JadwalHarian) => j.tanggal === tanggalHariIni,
        );
        if (jadwalHariIni) {
          setJadwal({
            imsak: jadwalHariIni.imsak,
            subuh: jadwalHariIni.subuh,
            terbit: jadwalHariIni.terbit,
            dhuha: jadwalHariIni.dhuha,
            dzuhur: jadwalHariIni.dzuhur,
            ashar: jadwalHariIni.ashar,
            maghrib: jadwalHariIni.maghrib,
            isya: jadwalHariIni.isya,
          });
          setProvinsi(parsed.provinsi);
          setKabkotaState(parsed.kabkota);
          setLoading(false);
          return;
        }
      }

      // Kalau tidak ada cache, fetch dari API
      const response = await fetch("https://equran.id/api/v2/shalat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provinsi: provinceName,
          kabkota: kabkota,
          tanggal: tanggalStr,
        }),
      });

      const data = await response.json();

      if (data.code === 200 && data.data && data.data.jadwal) {
        const jadwalBulan: JadwalHarian[] = data.data.jadwal;

        // Cari jadwal hari ini dari array
        const jadwalHariIni = jadwalBulan.find(
          (j) => j.tanggal === tanggalHariIni,
        );

        if (jadwalHariIni) {
          setJadwal({
            imsak: jadwalHariIni.imsak,
            subuh: jadwalHariIni.subuh,
            terbit: jadwalHariIni.terbit,
            dhuha: jadwalHariIni.dhuha,
            dzuhur: jadwalHariIni.dzuhur,
            ashar: jadwalHariIni.ashar,
            maghrib: jadwalHariIni.maghrib,
            isya: jadwalHariIni.isya,
          });
          setProvinsi(data.data.provinsi);
          setKabkotaState(data.data.kabkota);

          // Simpan seluruh bulan ke cache
          await AsyncStorage.setItem(
            cacheKey,
            JSON.stringify({
              jadwalBulan: jadwalBulan,
              provinsi: data.data.provinsi,
              kabkota: data.data.kabkota,
            }),
          );

          // Hapus cache lama
          cleanOldCache();
        } else {
          setError("Jadwal hari ini tidak ditemukan");
        }
      } else {
        setError(data.message || "Data jadwal tidak tersedia");
      }
    } catch (e) {
      console.error("Error fetching prayer times:", e);
      setError("Gagal mengambil jadwal sholat");
    } finally {
      setLoading(false);
    }
  }, [provinceName, kabkota]);

  useEffect(() => {
    void fetchJadwal();
  }, [fetchJadwal]);

  return {
    jadwal,
    provinsi,
    kabkota: kabkotaState,
    loading,
    error,
    refetch: fetchJadwal,
  };
}

// Bersihkan cache yang sudah lebih dari 2 bulan
async function cleanOldCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const jadwalKeys = keys.filter((key) => key.startsWith(CACHE_KEY_PREFIX));

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    for (const key of jadwalKeys) {
      // Extract bulan dan tahun dari key
      const parts = key.split("_");
      const tahun = parseInt(parts[parts.length - 1]);
      const bulan = parseInt(parts[parts.length - 2]);

      // Hitung selisih bulan
      const monthDiff = (currentYear - tahun) * 12 + (currentMonth - bulan);

      if (monthDiff > 2) {
        await AsyncStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore cleanup errors
  }
}
