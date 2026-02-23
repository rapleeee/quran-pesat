import { Ayat } from "@/types/quran";

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
export const QURAN_PAGE_SIZE = 15;

export function toArabicNumber(value: number) {
  return value
    .toString()
    .split("")
    .map((digit) => ARABIC_DIGITS[Number(digit)] ?? digit)
    .join("");
}

export function formatAyatNumber(value: number) {
  return `﴿${toArabicNumber(value)}﴾`;
}

export function shouldAppendAyatNumber(text: string, value: number) {
  let trimmed = text.trim();
  if (!trimmed) {
    return true;
  }

  if (trimmed.includes("﴿") || trimmed.includes("﴾")) {
    return false;
  }

  trimmed = trimmed.replace(/[)\](\[({\}﴾>,.:،؛:۔…\s]+$/g, "");

  const digitMatch = trimmed.match(/([0-9٠-٩]+)$/);
  if (digitMatch) {
    return false;
  }

  const arabic = toArabicNumber(value);
  const western = value.toString();
  const tail = trimmed.slice(-Math.max(arabic.length, western.length) - 2);
  if (tail.endsWith(arabic) || tail.endsWith(western)) {
    return false;
  }

  return true;
}

export function chunkAyat(list: Ayat[], size: number = QURAN_PAGE_SIZE) {
  const pages: Ayat[][] = [];
  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size));
  }
  return pages;
}
