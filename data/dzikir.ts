import { DzikirHarianItem, DzikirTypeFilter } from "@/types/dzikir";

export type DzikirCategory = "harian" | "duha";

export const DZIKIR_TYPE_OPTIONS: { label: string; value: DzikirTypeFilter }[] = [
  { label: "Semua", value: "all" },
  { label: "Pagi", value: "pagi" },
  { label: "Sore", value: "sore" },
  { label: "Solat", value: "solat" },
];

export const DZIKIR_DUHA_DESCRIPTION =
  "Dzikir Duha adalah dzikir yang dianjurkan untuk dibaca pada waktu dhuha, yaitu setelah matahari terbit hingga sebelum masuk waktu zuhur. Dzikir ini memiliki banyak keutamaan, termasuk mendapatkan pahala dan keberkahan di hari tersebut.";

export const DZIKIR_DUHA_NOTE =
  "Dzikir Duha akan segera hadir di update berikutnya, insya Allah.";

export function getDzikirTypeBadgeLabel(type: DzikirHarianItem["type"]): string {
  switch (type) {
    case "pagi":
      return "Pagi";
    case "sore":
      return "Sore";
    default:
      return "Solat";
  }
}

export function getDzikirTypeTitleLabel(type: DzikirHarianItem["type"]): string {
  switch (type) {
    case "pagi":
      return "Dzikir Pagi";
    case "sore":
      return "Dzikir Sore";
    default:
      return "Dzikir Solat";
  }
}

export function buildDzikirShareText(item: DzikirHarianItem): string {
  return `${getDzikirTypeTitleLabel(item.type)}\n\n${item.arabic}\n\n${item.translation}\n\nDibaca: ${item.repeat}x`;
}
