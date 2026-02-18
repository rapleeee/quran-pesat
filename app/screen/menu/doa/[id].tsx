import { useDoaHarianDetail } from "@/hooks/doa/use-doa-harian";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, RefreshCw } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function resolveParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default function DoaDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = resolveParam(params.id);
  const { item, loading, error, isUsingCache, refetch } = useDoaHarianDetail(id);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#363636" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636]">Detail Doa</Text>
        <TouchableOpacity
          onPress={() => void refetch()}
          className="w-11 h-11 items-center justify-center"
        >
          <RefreshCw size={18} color="#363636" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#728d8d" />
          <Text className="text-[#728d8d] text-xs mt-2">Memuat detail doa...</Text>
        </View>
      ) : !item ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">
            {error || "Data doa tidak ditemukan"}
          </Text>
          <TouchableOpacity
            onPress={() => void refetch()}
            className="mt-3 px-4 py-2 rounded-lg bg-[#728d8d]"
          >
            <Text className="text-white text-sm font-medium">Coba lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => void refetch()}
              tintColor="#728d8d"
              colors={["#728d8d"]}
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View className="rounded-xl bg-amber-100 border border-amber-200 px-3 py-2 mb-3">
              <Text className="text-amber-800 text-xs">{error}</Text>
            </View>
          ) : null}
          {isUsingCache ? (
            <View className="rounded-xl bg-[#dbe8e8] border border-[#bfd1d1] px-3 py-2 mb-3">
              <Text className="text-[#336363] text-xs">
                Detail ini ditampilkan dari cache offline.
              </Text>
            </View>
          ) : null}

          <View className="rounded-2xl bg-white border border-[#e5e5e5] p-5">
            <Text className="text-[#64748b] text-xs font-semibold">Doa #{item.id}</Text>
            <Text className="text-[#1f2937] font-bold text-xl mt-2">{item.title}</Text>

            <View className="h-px bg-[#ececec] my-4" />

            <Text className="text-[#4b5563] text-xs font-semibold uppercase">Arab</Text>
            <Text
              className="text-right text-[30px] leading-[44px] text-[#111827] mt-2"
              style={{ writingDirection: "rtl" }}
            >
              {item.arabic}
            </Text>

            <Text className="text-[#4b5563] text-xs font-semibold uppercase mt-5">
              Latin
            </Text>
            <Text className="text-[#374151] text-base mt-2 leading-7">{item.latin}</Text>

            <Text className="text-[#4b5563] text-xs font-semibold uppercase mt-5">
              Terjemahan
            </Text>
            <Text className="text-[#374151] text-base mt-2 leading-7">
              {item.translation}
            </Text>

            {item.source ? (
              <>
                <Text className="text-[#4b5563] text-xs font-semibold uppercase mt-5">
                  Sumber
                </Text>
                <Text className="text-[#4b5563] text-sm mt-2">{item.source}</Text>
              </>
            ) : null}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
