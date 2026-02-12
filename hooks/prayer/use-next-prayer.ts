import { useEffect, useMemo, useState } from "react";
import { JadwalSholat } from "./use-prayer-times";

export interface NextPrayer {
  name: string;
  time: string;
  hours: number;
  minutes: number;
  seconds: number;
  countdown: string;
  isNow: boolean;
}

interface PrayerTime {
  name: string;
  time: string;
  totalMinutes: number;
}

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function useNextPrayer(jadwal: JadwalSholat | null): NextPrayer | null {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextPrayer = useMemo(() => {
    if (!jadwal) return null;

    const now = currentTime;
    const currentTotalSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    // Daftar waktu sholat
    const prayers: PrayerTime[] = [
      {
        name: "Subuh",
        time: jadwal.subuh,
        totalMinutes: parseTimeToMinutes(jadwal.subuh),
      },
      {
        name: "Dzuhur",
        time: jadwal.dzuhur,
        totalMinutes: parseTimeToMinutes(jadwal.dzuhur),
      },
      {
        name: "Ashar",
        time: jadwal.ashar,
        totalMinutes: parseTimeToMinutes(jadwal.ashar),
      },
      {
        name: "Maghrib",
        time: jadwal.maghrib,
        totalMinutes: parseTimeToMinutes(jadwal.maghrib),
      },
      {
        name: "Isya",
        time: jadwal.isya,
        totalMinutes: parseTimeToMinutes(jadwal.isya),
      },
    ];

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Cari waktu sholat berikutnya yang belum lewat
    let nextPrayerData = prayers.find((p) => p.totalMinutes > currentMinutes);
    let addDay = false;

    // Jika semua sudah lewat (sudah melewati Isya), ambil Subuh besok
    if (!nextPrayerData) {
      nextPrayerData = prayers[0]; // Subuh
      addDay = true;
    }

    // Hitung selisih waktu dalam detik
    let targetTotalSeconds = nextPrayerData.totalMinutes * 60;
    if (addDay) {
      targetTotalSeconds += 24 * 3600; // Tambah 24 jam
    }

    let diffSeconds = targetTotalSeconds - currentTotalSeconds;
    if (diffSeconds < 0) {
      diffSeconds += 24 * 3600;
    }

    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    // Format countdown text
    let countdownText = "";
    if (hours > 0) countdownText += `${hours} jam `;
    if (minutes > 0 || hours > 0) countdownText += `${minutes} menit `;
    countdownText += `${seconds} detik`;

    // Cek apakah sekarang waktunya sholat (dalam 5 menit setelah waktu sholat)
    const isNow = diffSeconds >= 24 * 3600 - 300 || diffSeconds <= 0;

    return {
      name: nextPrayerData.name,
      time: nextPrayerData.time,
      hours,
      minutes,
      seconds,
      countdown: countdownText.trim(),
      isNow,
    };
  }, [jadwal, currentTime]);

  return nextPrayer;
}

// Format countdown dengan leading zero
export function formatCountdown(
  hours: number,
  minutes: number,
  seconds: number,
): string {
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");
  const s = seconds.toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}
