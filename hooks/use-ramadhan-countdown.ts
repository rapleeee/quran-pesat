import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

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

interface IslamicEventConfig {
  id: string;
  name: string;
  hijriDay: number;
  hijriMonth: number;
  greetingTitle: string;
  greetingSubtitle: string;
  upcomingTitle: string;
  ongoingByMonth?: boolean;
  durationDays?: number;
}

export interface ResolvedIslamicEvent extends IslamicEventConfig {
  hijriYear: number;
  gregorianDate: string | null;
  daysUntil: number;
  isActive: boolean;
}

interface IslamicEventCountdownData {
  activeEvent: ResolvedIslamicEvent | null;
  upcomingEvent: ResolvedIslamicEvent | null;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = "islamic_events_countdown_cache_v1";

const ISLAMIC_EVENTS: IslamicEventConfig[] = [
  {
    id: "tahun-baru-hijriyah",
    name: "Tahun Baru Hijriyah",
    hijriDay: 1,
    hijriMonth: 1,
    greetingTitle: "Selamat Tahun Baru Hijriyah!",
    greetingSubtitle: "Semoga tahun ini penuh keberkahan",
    upcomingTitle: "Tahun Baru Hijriyah Tiba!",
  },
  {
    id: "asyura",
    name: "Asyura 10 Muharram",
    hijriDay: 10,
    hijriMonth: 1,
    greetingTitle: "Selamat Menyambut Hari Asyura",
    greetingSubtitle: "Semoga Allah limpahkan rahmat dan ampunan",
    upcomingTitle: "Hari Asyura Segera Tiba!",
  },
  {
    id: "maulid-nabi",
    name: "Maulid Nabi",
    hijriDay: 12,
    hijriMonth: 3,
    greetingTitle: "Selamat Memperingati Maulid Nabi!",
    greetingSubtitle: "Mari teladani akhlak Rasulullah SAW",
    upcomingTitle: "Maulid Nabi Segera Tiba!",
  },
  {
    id: "isra-miraj",
    name: "Isra Mi’raj",
    hijriDay: 27,
    hijriMonth: 7,
    greetingTitle: "Selamat Memperingati Isra Mi’raj",
    greetingSubtitle: "Semoga menambah keimanan dan ketaatan",
    upcomingTitle: "Isra Mi’raj Segera Tiba!",
  },
  {
    id: "nisfu-syaban",
    name: "Nisfu Sya’ban",
    hijriDay: 15,
    hijriMonth: 8,
    greetingTitle: "Malam Nisfu Sya’ban",
    greetingSubtitle: "Semoga Allah menerima amal ibadah kita",
    upcomingTitle: "Nisfu Sya’ban Segera Tiba!",
  },
  {
    id: "ramadhan",
    name: "Ramadhan",
    hijriDay: 1,
    hijriMonth: 9,
    greetingTitle: "Ramadhan Mubarak!",
    greetingSubtitle: "Selamat menjalankan ibadah puasa",
    upcomingTitle: "Ramadhan Tiba!",
    ongoingByMonth: true,
  },
  {
    id: "nuzulul-quran",
    name: "Nuzulul Qur’an",
    hijriDay: 17,
    hijriMonth: 9,
    greetingTitle: "Selamat Memperingati Nuzulul Qur’an",
    greetingSubtitle: "Mari perbanyak tilawah dan tadabbur Al-Qur’an",
    upcomingTitle: "Nuzulul Qur’an Segera Tiba!",
  },
  {
    id: "idul-fitri",
    name: "Idul Fitri",
    hijriDay: 1,
    hijriMonth: 10,
    greetingTitle: "Eid Mubarak!",
    greetingSubtitle: "Selamat Hari Raya Idul Fitri",
    upcomingTitle: "Idul Fitri Tiba!",
  },
  {
    id: "idul-adha",
    name: "Idul Adha",
    hijriDay: 10,
    hijriMonth: 12,
    greetingTitle: "Eid Adha Mubarak!",
    greetingSubtitle: "Selamat Hari Raya Idul Adha",
    upcomingTitle: "Idul Adha Tiba!",
  },
  {
    id: "tarwiyah",
    name: "Tarwiyah 8 Dzulhijjah",
    hijriDay: 8,
    hijriMonth: 12,
    greetingTitle: "Hari Tarwiyah",
    greetingSubtitle: "Semoga Allah menerima amal ibadah kita",
    upcomingTitle: "Tarwiyah Segera Tiba!",
  },
  {
    id: "arafah",
    name: "Arafah 9 Dzulhijjah",
    hijriDay: 9,
    hijriMonth: 12,
    greetingTitle: "Hari Arafah",
    greetingSubtitle: "Semoga Allah limpahkan ampunan untuk kita",
    upcomingTitle: "Arafah Segera Tiba!",
  },
  {
    id: "hari-tasyrik",
    name: "Hari Tasyrik",
    hijriDay: 11,
    hijriMonth: 12,
    durationDays: 3,
    greetingTitle: "Hari Tasyrik",
    greetingSubtitle: "Perbanyak dzikir dan syukur kepada Allah",
    upcomingTitle: "Hari Tasyrik Segera Tiba!",
  },
];

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

function isPastHijriDate(
  eventMonth: number,
  eventDay: number,
  currentMonth: number,
  currentDay: number,
): boolean {
  if (eventMonth < currentMonth) {
    return true;
  }
  if (eventMonth === currentMonth && eventDay < currentDay) {
    return true;
  }
  return false;
}

function isDayInEventRange(
  currentDay: number,
  eventStartDay: number,
  durationDays: number,
): boolean {
  const eventEndDay = eventStartDay + durationDays - 1;
  return currentDay >= eventStartDay && currentDay <= eventEndDay;
}

export function useIslamicEventCountdown(): IslamicEventCountdownData {
  const [data, setData] = useState<IslamicEventCountdownData>({
    activeEvent: null,
    upcomingEvent: null,
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
        const currentHijriDay = parseInt(hijriData.day);
        const currentHijriMonth = hijriData.month.number;
        const currentHijriYear = parseInt(hijriData.year);

        const resolvedEvents = await Promise.all(
          ISLAMIC_EVENTS.map(async (event) => {
            const durationDays = event.durationDays ?? 1;
            const isActive = event.ongoingByMonth
              ? currentHijriMonth === event.hijriMonth
              : currentHijriMonth === event.hijriMonth &&
                isDayInEventRange(
                  currentHijriDay,
                  event.hijriDay,
                  durationDays,
                );

            if (isActive) {
              return {
                ...event,
                hijriYear: currentHijriYear,
                gregorianDate: null,
                daysUntil: 0,
                isActive: true,
              } satisfies ResolvedIslamicEvent;
            }

            let targetHijriYear = currentHijriYear;
            if (
              isPastHijriDate(
                event.hijriMonth,
                event.hijriDay,
                currentHijriMonth,
                currentHijriDay,
              )
            ) {
              targetHijriYear += 1;
            }

            const gregorianResponse = await getGregorianDate(
              event.hijriDay,
              event.hijriMonth,
              targetHijriYear,
            );

            if (gregorianResponse.code !== 200) {
              throw new Error(`Gagal mengambil tanggal ${event.name}`);
            }

            const gregorianDateStr = gregorianResponse.data.gregorian.date;
            const [day, month, year] = gregorianDateStr.split("-").map(Number);
            const gregorianDate = new Date(year, month - 1, day);
            const daysUntil = Math.max(0, calculateDaysDifference(gregorianDate, today));

            return {
              ...event,
              hijriYear: targetHijriYear,
              gregorianDate: gregorianDate.toISOString(),
              daysUntil,
              isActive: false,
            } satisfies ResolvedIslamicEvent;
          }),
        );

        const activeEvent =
          resolvedEvents.find((item) => item.isActive) || null;

        const upcomingEvent = [...resolvedEvents]
          .filter((item) => !item.isActive)
          .sort((a, b) => a.daysUntil - b.daysUntil)[0] || null;

        const result: IslamicEventCountdownData = {
          activeEvent,
          upcomingEvent,
          loading: false,
          error: null,
        };

        await AsyncStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ calculatedAt: todayStr, data: result }),
        );

        setData(result);
      } catch (error) {
        setData({
          activeEvent: null,
          upcomingEvent: null,
          loading: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        });
      }
    }

    void calculate();
  }, []);

  return data;
}
