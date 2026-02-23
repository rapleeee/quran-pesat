import { TajweedSegment } from "@/hooks/quran/use-tajweed-surah";
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

const DEFAULT_TEXT_COLOR = "#363636";
const FALLBACK_TAJWEED_COLOR = "#f39c12";
const BASE_ARABIC_TEXT_STYLE: TextStyle = {
  fontFamily: "NotoNaskhArabic",
  color: DEFAULT_TEXT_COLOR,
};

export function buildArabicTextStyle(fontSize: number): TextStyle {
  return {
    ...BASE_ARABIC_TEXT_STYLE,
    fontSize,
    lineHeight: Math.round(fontSize * 1.65),
  };
}

const TAJWEED_COLORS: Record<string, string> = {
  ikhfa: "#e67e22",
  ikhfa_shafawi: "#f39c12",
  idghaam_ghunnah: "#27ae60",
  idghaam_no_ghunnah: "#2980b9",
  idghaam_mutajaanisain: "#16a085",
  idghaam_mutaqaaribain: "#1abc9c",
  idghaam_shafawi: "#2ecc71",
  idgham_ghunnah: "#27ae60",
  idgham_no_ghunnah: "#2980b9",
  idgham_mutajaanisain: "#16a085",
  idgham_mutaqaaribain: "#1abc9c",
  idgham_shafawi: "#2ecc71",
  iqlab: "#8e44ad",
  qalqalah: "#e74c3c",
  qalaqah: "#e74c3c",
  ghunnah: "#9b59b6",
  madd_2: "#3498db",
  madd_246: "#2980b9",
  madd_4: "#2980b9",
  madd_6: "#1f6aa5",
  madd_muttasil: "#8e44ad",
  madd_munfasil: "#6c5ce7",
  madd_lazim: "#5e60ce",
  madda_necessary: "#5e60ce",
  madda_obligatory: "#8e44ad",
  madda_permissible: "#6c5ce7",
  ham_wasl: "#7f8c8d",
  hamzat_wasl: "#7f8c8d",
  laam_shamsiyah: "#d35400",
  lam_shamsiyyah: "#d35400",
};

function getTajweedColor(rule?: string) {
  if (!rule) {
    return DEFAULT_TEXT_COLOR;
  }
  const normalized = rule.toLowerCase();
  if (TAJWEED_COLORS[normalized]) {
    return TAJWEED_COLORS[normalized];
  }
  if (normalized.startsWith("madda") || normalized.startsWith("madd")) {
    return TAJWEED_COLORS.madd_2;
  }
  if (normalized.startsWith("idghaam") || normalized.startsWith("idgham")) {
    return TAJWEED_COLORS.idghaam_ghunnah;
  }
  if (normalized.includes("ikhfa")) {
    return TAJWEED_COLORS.ikhfa;
  }
  if (normalized.includes("iqlab")) {
    return TAJWEED_COLORS.iqlab;
  }
  if (normalized.includes("qalqalah") || normalized.includes("qalaqah")) {
    return TAJWEED_COLORS.qalqalah;
  }
  if (normalized.includes("ghunnah")) {
    return TAJWEED_COLORS.ghunnah;
  }
  return FALLBACK_TAJWEED_COLOR;
}

type TajweedTextProps = {
  segments?: TajweedSegment[];
  fallbackText: string;
  style?: StyleProp<TextStyle>;
};

export function TajweedText({
  segments,
  fallbackText,
  style,
}: TajweedTextProps) {
  if (!segments || segments.length === 0) {
    return <Text style={style}>{fallbackText}</Text>;
  }
  return (
    <Text style={style}>
      {segments.map((segment, index) => (
        <Text
          key={`${segment.text}-${index}`}
          style={[style, { color: getTajweedColor(segment.rule) }]}
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}
