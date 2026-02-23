import { router } from "expo-router";
import { ArrowLeft, Calculator } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function toNumber(value: string): number {
  const sanitized = value.replace(/[^0-9]/g, "");
  return sanitized.length ? Number(sanitized) : 0;
}

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ZakatCalculatorScreen() {
  const [totalWealth, setTotalWealth] = useState("");
  const [nisab, setNisab] = useState("");

  const totalValue = useMemo(() => toNumber(totalWealth), [totalWealth]);
  const nisabValue = useMemo(() => toNumber(nisab), [nisab]);

  const isEligible = totalValue > 0 && (nisabValue === 0 || totalValue >= nisabValue);
  const zakatValue = isEligible ? Math.round(totalValue * 0.025) : 0;

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
          Zakat Calculator
        </Text>
      </View>

      <View className="px-4 pt-4">
        <View className="bg-white dark:bg-[#111827] rounded-2xl border border-[#e5e5e5] dark:border-[#1f2937] p-4">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-full bg-[#728d8d]/10 items-center justify-center mr-3">
              <Calculator size={22} color="#728d8d" />
            </View>
            <View className="flex-1">
              <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-semibold">
                Hitung Zakat Mal
              </Text>
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">
                Masukkan total harta dan nisab (opsional).
              </Text>
            </View>
          </View>

          <Text className="text-xs text-[#6b7280] dark:text-[#94a3b8] mb-1">Total Harta (IDR)</Text>
          <TextInput
            value={totalWealth}
            onChangeText={setTotalWealth}
            keyboardType="numeric"
            placeholder="Contoh: 15000000"
            placeholderTextColor="#9ca3af"
            className="bg-[#f8f4ea] dark:bg-[#111827] rounded-xl px-4 py-3 text-[#1f2937] dark:text-[#e5e7eb]"
          />

          <Text className="text-xs text-[#6b7280] dark:text-[#94a3b8] mt-4 mb-1">
            Nisab (IDR) - opsional
          </Text>
          <TextInput
            value={nisab}
            onChangeText={setNisab}
            keyboardType="numeric"
            placeholder="Contoh: 85000000"
            placeholderTextColor="#9ca3af"
            className="bg-[#f8f4ea] dark:bg-[#111827] rounded-xl px-4 py-3 text-[#1f2937] dark:text-[#e5e7eb]"
          />

          <View className="mt-4 rounded-xl bg-[#728d8d]/10 px-4 py-3">
            <Text className="text-[#1f2937] dark:text-[#e5e7eb] text-sm">
              Estimasi zakat (2.5%)
            </Text>
            <Text className="text-[#336363] dark:text-[#9fb7b7] text-xl font-semibold mt-1">
              {formatIDR(zakatValue)}
            </Text>
            {!isEligible && (
              <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-1">
                Belum memenuhi nisab atau belum ada data harta.
              </Text>
            )}
          </View>

          <Text className="text-[#6b7280] dark:text-[#94a3b8] text-xs mt-3">
            Catatan: Nisab mengikuti harga emas 85 gram. Masukkan nisab sesuai
            harga emas hari ini untuk hasil lebih akurat.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
