import { router } from "expo-router";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toArabicNumber } from "@/utils/quran-text";

const ISLAMIC_LOCALE = "id-ID-u-ca-islamic";
const ISLAMIC_NUMERIC_LOCALE = "en-u-ca-islamic";
const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const CELL_WIDTH = `${100 / 7}%`;

type HijriParts = {
  day: number;
  month: number;
  year: number;
};

type HijriHoliday = {
  id: string;
  month: number;
  day: number;
  title: string;
};

const HIJRI_HOLIDAYS: HijriHoliday[] = [
  { id: "muharram", month: 1, day: 1, title: "Tahun Baru Hijriah" },
  { id: "ashura", month: 1, day: 10, title: "Asyura" },
  { id: "maulid", month: 3, day: 12, title: "Maulid Nabi" },
  { id: "isra-miraj", month: 7, day: 27, title: "Isra Mi'raj" },
  { id: "nisfu-shaban", month: 8, day: 15, title: "Nisfu Sya'ban" },
  { id: "ramadan", month: 9, day: 1, title: "Awal Ramadan" },
  { id: "nuzul", month: 9, day: 17, title: "Nuzulul Quran" },
  { id: "idul-fitri", month: 10, day: 1, title: "Idul Fitri" },
  { id: "arafah", month: 12, day: 9, title: "Arafah" },
  { id: "idul-adha", month: 12, day: 10, title: "Idul Adha" },
];

function formatDate(
  locale: string,
  date: Date,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function toArabicDigitsText(value: string) {
  return value.replace(/\d/g, (digit) => toArabicNumber(Number(digit)));
}

function getHijriNumericParts(date: Date): HijriParts {
  try {
    const formatter = new Intl.DateTimeFormat(ISLAMIC_NUMERIC_LOCALE, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = formatter.formatToParts(date);
    const day = Number(parts.find((part) => part.type === "day")?.value ?? 1);
    const month = Number(parts.find((part) => part.type === "month")?.value ?? 1);
    const year = Number(parts.find((part) => part.type === "year")?.value ?? 1);
    return { day, month, year };
  } catch {
    return { day: 1, month: 1, year: 1 };
  }
}

function isHijriCalendarSupported() {
  try {
    new Intl.DateTimeFormat(ISLAMIC_NUMERIC_LOCALE, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function moveHijriMonth(date: Date, direction: 1 | -1) {
  const current = getHijriNumericParts(date);
  const candidate = new Date(date);
  candidate.setDate(candidate.getDate() + direction * 30);
  let guard = 0;
  while (guard < 45) {
    const parts = getHijriNumericParts(candidate);
    if (parts.month !== current.month || parts.year !== current.year) {
      return candidate;
    }
    candidate.setDate(candidate.getDate() + direction);
    guard += 1;
  }
  return candidate;
}

function getHijriMonthDays(baseDate: Date) {
  const { month, year } = getHijriNumericParts(baseDate);
  const start = new Date(baseDate);
  start.setDate(start.getDate() - 40);
  const end = new Date(baseDate);
  end.setDate(end.getDate() + 40);

  const days: { date: Date; hijriDay: number }[] = [];
  const seen = new Set<number>();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const parts = getHijriNumericParts(d);
    if (parts.month === month && parts.year === year && !seen.has(parts.day)) {
      days.push({ date: new Date(d), hijriDay: parts.day });
      seen.add(parts.day);
    }
  }

  return days.sort((a, b) => a.hijriDay - b.hijriDay);
}

export default function KalenderHijriahScreen() {
  const today = useMemo(() => new Date(), []);
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const hijriSupported = useMemo(() => isHijriCalendarSupported(), []);

  const gregorianDate = useMemo(
    () =>
      formatDate("id-ID", today, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [today],
  );

  const hijriFullDate = useMemo(() => {
    try {
      const formatted = formatDate(ISLAMIC_LOCALE, today, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return toArabicDigitsText(formatted);
    } catch {
      return "Kalender Hijriah belum tersedia di perangkat ini.";
    }
  }, [today]);

  const hijriParts = useMemo(
    () => getHijriNumericParts(anchorDate),
    [anchorDate],
  );

  const monthDays = useMemo(() => getHijriMonthDays(anchorDate), [anchorDate]);

  const firstWeekdayIndex = useMemo(() => {
    if (!monthDays.length) {
      return 0;
    }
    const weekday = monthDays[0].date.getDay();
    return (weekday + 6) % 7;
  }, [monthDays]);

  const monthHolidays = useMemo(
    () =>
      HIJRI_HOLIDAYS.filter((holiday) => holiday.month === hijriParts.month),
    [hijriParts.month],
  );

  const handlePrevMonth = useCallback(() => {
    setAnchorDate((prev) => moveHijriMonth(prev, -1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setAnchorDate((prev) => moveHijriMonth(prev, 1));
  }, []);

  const hijriMonthTitle = useMemo(() => {
    try {
      return formatDate(ISLAMIC_LOCALE, anchorDate, { month: "long" });
    } catch {
      return "Bulan Hijriah";
    }
  }, [anchorDate]);

  const hijriYearArabic = useMemo(
    () => toArabicNumber(hijriParts.year),
    [hijriParts.year],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937] flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#728d8d" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636] dark:text-[#f8fafc] ml-2">
          Kalender Hijriah
        </Text>
      </View>

      <View className="px-4 pt-4">
        <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">
                Tanggal Hijriah Hari Ini
              </Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">{gregorianDate}</Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-[#728d8d]/10 items-center justify-center">
              <CalendarDays size={22} color="#728d8d" />
            </View>
          </View>

          <View className="mt-4 rounded-xl bg-[#f8f4ea] dark:bg-[#111827] px-4 py-3">
            <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">{hijriFullDate}</Text>
          </View>
        </View>

        {hijriSupported ? (
          <>
            <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4 mt-4">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  className="w-10 h-10 rounded-full bg-[#f8f4ea] dark:bg-[#111827] items-center justify-center"
                >
                  <ChevronLeft size={18} color="#728d8d" />
                </TouchableOpacity>

                <View className="items-center">
                  <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-base">
                    {hijriMonthTitle}
                  </Text>
                  <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">
                    {hijriYearArabic} هـ
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  className="w-10 h-10 rounded-full bg-[#f8f4ea] dark:bg-[#111827] items-center justify-center"
                >
                  <ChevronRight size={18} color="#728d8d" />
                </TouchableOpacity>
              </View>

              <View className="flex-row mt-4">
                {WEEKDAYS.map((day) => (
                  <View key={day} style={{ width: CELL_WIDTH }}>
                    <Text className="text-center text-[11px] font-semibold text-[#6b7280] dark:text-[#94a3b8]">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-row flex-wrap mt-2">
                {Array.from({ length: firstWeekdayIndex }).map((_, index) => (
                  <View key={`empty-${index}`} style={{ width: CELL_WIDTH }} />
                ))}
                {monthDays.map((day) => {
                  const isToday = day.date.toDateString() === today.toDateString();
                  const isHoliday = HIJRI_HOLIDAYS.some(
                    (holiday) =>
                      holiday.month === hijriParts.month &&
                      holiday.day === day.hijriDay,
                  );
                  return (
                    <View
                      key={`${day.hijriDay}-${day.date.toDateString()}`}
                      style={{ width: CELL_WIDTH }}
                      className="items-center mb-3"
                    >
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center ${
                          isToday ? "bg-[#728d8d]" : "bg-[#f8f4ea] dark:bg-[#111827]"
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            isToday ? "text-white" : "text-[#1f2937] dark:text-[#e5e7eb]"
                          }`}
                        >
                          {toArabicNumber(day.hijriDay)}
                        </Text>
                      </View>
                      {isHoliday ? (
                        <View className="mt-1 w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>

            <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4 mt-4">
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">
                Peringatan Bulan Ini
              </Text>
              {monthHolidays.length ? (
                <View className="mt-3">
                  {monthHolidays.map((holiday) => (
                    <View
                      key={holiday.id}
                      className="flex-row items-center justify-between mb-2"
                    >
                      <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-sm">
                        {toArabicNumber(holiday.day)}
                      </Text>
                      <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-sm flex-1 ml-3">
                        {holiday.title}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-2">
                  Tidak ada peringatan besar di bulan ini.
                </Text>
              )}
              <Text className="text-[#9ca3af] text-[10px] mt-3">
                Catatan: tanggal peringatan dapat berbeda sesuai penetapan resmi.
              </Text>
            </View>
          </>
        ) : (
          <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4 mt-4">
            <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">
              Kalender Hijriah belum tersedia
            </Text>
            <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-2">
              Perangkat belum mendukung kalender Hijriah via Intl.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
