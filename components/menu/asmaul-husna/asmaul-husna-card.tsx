import { AsmaulHusnaItem } from "@/types/asmaul-husna";
import React, { useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";

interface AsmaulHusnaCardProps {
  orderLabel: string;
  item: AsmaulHusnaItem;
  query: string;
  onPress: (item: AsmaulHusnaItem) => void;
}

interface HighlightTextProps {
  text: string;
  query: string;
  className: string;
  highlightClassName: string;
  numberOfLines?: number;
  writingDirection?: "auto" | "ltr" | "rtl";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightText({
  text,
  query,
  className,
  highlightClassName,
  numberOfLines,
  writingDirection,
}: HighlightTextProps) {
  const normalizedQuery = query.trim();
  const parts = useMemo(() => {
    if (!normalizedQuery || !text) {
      return [text];
    }

    const pattern = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi");
    return text.split(pattern);
  }, [normalizedQuery, text]);

  if (!normalizedQuery) {
    return (
      <Text
        className={className}
        numberOfLines={numberOfLines}
        style={{ writingDirection }}
      >
        {text}
      </Text>
    );
  }

  const loweredQuery = normalizedQuery.toLocaleLowerCase("id-ID");

  return (
    <Text
      className={className}
      numberOfLines={numberOfLines}
      style={{ writingDirection }}
    >
      {parts.map((part, index) => {
        const isMatch = part.toLocaleLowerCase("id-ID") === loweredQuery;
        return (
          <Text
            key={`${part}-${index}`}
            className={isMatch ? highlightClassName : undefined}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
}

export function AsmaulHusnaCard({
  orderLabel,
  item,
  query,
  onPress,
}: AsmaulHusnaCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      className="flex-1 bg-white dark:bg-[#111827] rounded-xl border border-[#e5e5e5] dark:border-[#1f2937] p-3"
      style={{ minHeight: 44 }}
    >
      <Text className="text-[10px] text-[#647b7b] font-semibold">{orderLabel}</Text>

      <HighlightText
        text={item.arabic}
        query={query}
        className="text-right text-2xl text-[#1f2937] dark:text-[#e5e7eb] mt-2 font-arabic"
        highlightClassName="bg-[#f6c76d]/35 text-[#1f2937] dark:text-[#e5e7eb]"
        writingDirection="rtl"
      />

      <HighlightText
        text={item.latin}
        query={query}
        className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-xs mt-2"
        highlightClassName="bg-[#f6c76d]/35 text-[#1f2937] dark:text-[#e5e7eb]"
        numberOfLines={1}
      />

      <HighlightText
        text={item.meaning}
        query={query}
        className="text-[#4b5563] dark:text-[#cbd5e1] text-[11px] mt-1 leading-4"
        highlightClassName="bg-[#f6c76d]/35 text-[#374151] dark:text-[#e5e7eb]"
        numberOfLines={2}
      />
    </TouchableOpacity>
  );
}
