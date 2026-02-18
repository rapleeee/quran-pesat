export type DzikirType = "pagi" | "sore" | "solat";
export type DzikirTypeFilter = "all" | DzikirType;

export interface DzikirHarianItem {
  id: string;
  arabic: string;
  translation: string;
  type: DzikirType;
  repeat: string;
}
