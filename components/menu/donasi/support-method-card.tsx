import { SupportMethod } from "@/types/developer-support";
import { Copy, ExternalLink, Info } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SupportMethodCardProps {
  method: SupportMethod;
  onCopy: (method: SupportMethod) => void;
  onOpenLink: (method: SupportMethod) => void;
}

export function SupportMethodCard({
  method,
  onCopy,
  onOpenLink,
}: SupportMethodCardProps) {
  return (
    <View className="mx-4 mb-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e5] dark:border-[#1f2937] p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold text-base">
            {method.title}
          </Text>
          <Text className="text-[#4b5563] dark:text-[#cbd5e1] text-xs mt-1">{method.subtitle}</Text>
          {method.accountName ? (
            <Text className="text-[#64748b] text-xs mt-2">
              a.n. {method.accountName}
            </Text>
          ) : null}
          {method.copyValue ? (
            <Text className="text-[#1f2937] dark:text-[#e5e7eb] text-sm font-semibold mt-1">
              {method.copyValue}
            </Text>
          ) : null}
        </View>
        {!method.isConfigured ? <Info size={16} color="#9ca3af" /> : null}
      </View>

      <View className="flex-row gap-2 mt-4">
        {method.copyValue ? (
          <TouchableOpacity
            onPress={() => onCopy(method)}
            activeOpacity={0.8}
            className="flex-1 min-h-[44px] rounded-xl border border-[#d1d5db] dark:border-[#374151] flex-row items-center justify-center gap-2"
          >
            <Copy size={16} color="#1f2937" />
            <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-medium text-sm">Copy</Text>
          </TouchableOpacity>
        ) : null}

        {method.actionLabel ? (
          <TouchableOpacity
            onPress={() => onOpenLink(method)}
            activeOpacity={0.8}
            disabled={!method.isConfigured}
            className={`flex-1 min-h-[44px] rounded-xl flex-row items-center justify-center gap-2 ${
              method.isConfigured ? "bg-[#728d8d]" : "bg-[#d1d5db]"
            }`}
          >
            <ExternalLink
              size={16}
              color={method.isConfigured ? "#ffffff" : "#6b7280"}
            />
            <Text
              className={`font-medium text-sm ${
                method.isConfigured ? "text-white" : "text-[#6b7280] dark:text-[#94a3b8]"
              }`}
            >
              {method.isConfigured ? method.actionLabel : "Belum Aktif"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
