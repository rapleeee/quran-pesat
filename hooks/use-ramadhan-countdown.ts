import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

interface RamadhanCountdownData {
  daysUntil: number;
  isRamadhan: boolean;
  ramadhanDate: string | null;
  hijriDate: {
    day: number;
    month: number;
    monthName: string;
    year: number;
  } | null;
  loading: boolean;
  error: string | null;
}

interface HijriApiResponse {
  code: number;
  data: {
    hijri: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
  };
}

interface GregorianApiResponse {
  code: number;
  data: {
    gregorian: {
      date: string;
    };
  };
}

const CACHE_KEY = "ramadhan_countdown_cache";
const RAMADHAN_MONTH = 9; // Bulan ke-9 dalam kalender Hijriyah

async function getHijriDate(date: Date): Promise<HijriApiResponse> {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const response = await fetch(
    `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`,
  );
  return response.json();
}

async function getGregorianDate(
  hijriDay: number,
  hijriMonth: number,
  hijriYear: number,
): Promise<GregorianApiResponse> {
  const day = hijriDay.toString().padStart(2, "0");
  const month = hijriMonth.toString().padStart(2, "0");

  const response = await fetch(
    `https://api.aladhan.com/v1/hToG/${day}-${month}-${hijriYear}`,
  );
  return response.json();
}

function calculateDaysDifference(targetDate: Date, fromDate: Date): number {
  const target = new Date(targetDate);
  const from = new Date(fromDate);

  target.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - from.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function useRamadhanCountdown(): RamadhanCountdownData {
  const [data, setData] = useState<RamadhanCountdownData>({
    daysUntil: 0,
    isRamadhan: false,
    ramadhanDate: null,
    hijriDate: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function calculate() {
      try {
        const today = new Date();
        const todayStr = today.toDateString();

        // Cek cache dulu
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (parsed.calculatedAt === todayStr) {
            setData({
              ...parsed.data,
              loading: false,
            });
            return;
          }
        }

        // Fetch tanggal Hijriyah hari ini
        const hijriResponse = await getHijriDate(today);
        if (hijriResponse.code !== 200) {
          throw new Error("Gagal mengambil tanggal Hijriyah");
        }

        const hijriData = hijriResponse.data.hijri;
        const currentHijriMonth = hijriData.month.number;
        const currentHijriYear = parseInt(hijriData.year);

        const hijriDate = {
          day: parseInt(hijriData.day),
          month: currentHijriMonth,
          monthName: hijriData.month.en,
          year: currentHijriYear,
        };

        // Cek apakah sekarang bulan Ramadhan
        if (currentHijriMonth === RAMADHAN_MONTH) {
          const result: RamadhanCountdownData = {
            daysUntil: 0,
            isRamadhan: true,
            ramadhanDate: null,
            hijriDate,
            loading: false,
            error: null,
          };

          await AsyncStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ calculatedAt: todayStr, data: result }),
          );

          setData(result);
          return;
        }

        // Tentukan tahun Ramadhan berikutnya
        let ramadhanYear = currentHijriYear;
        if (currentHijriMonth > RAMADHAN_MONTH) {
          ramadhanYear = currentHijriYear + 1;
        }

        // Fetch tanggal 1 Ramadhan dalam Masehi
        const ramadhanResponse = await getGregorianDate(
          1,
          RAMADHAN_MONTH,
          ramadhanYear,
        );
        if (ramadhanResponse.code !== 200) {
          throw new Error("Gagal mengambil tanggal Ramadhan");
        }

        const ramadhanDateStr = ramadhanResponse.data.gregorian.date;
        const [day, month, year] = ramadhanDateStr.split("-").map(Number);
        const ramadhanDate = new Date(year, month - 1, day);

        const daysUntil = calculateDaysDifference(ramadhanDate, today);

        const result: RamadhanCountdownData = {
          daysUntil: Math.max(0, daysUntil),
          isRamadhan: false,
          ramadhanDate: ramadhanDate.toISOString(),
          hijriDate,
          loading: false,
          error: null,
        };

        // Simpan ke cache
        await AsyncStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ calculatedAt: todayStr, data: result }),
        );

        setData(result);
      } catch (error) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        }));
      }
    }

    calculate();
  }, []);

  return data;
}
