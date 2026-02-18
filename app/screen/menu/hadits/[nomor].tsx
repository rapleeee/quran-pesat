import { useHaditsBookmark } from "@/hooks/hadits/use-hadits-bookmark";
import { useHaditsDetail } from "@/hooks/hadits/use-hadits";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Bookmark, Copy, RefreshCw, Share2 } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  RefreshControl,
  ScrollView,
  Share,
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

export default function HaditsDetailScreen() {
  const params = useLocalSearchParams<{ nomor?: string | string[] }>();
  const nomor = resolveParam(params.nomor);
  const { item, loading, error, refetch } = useHaditsDetail(nomor);
  const { isBookmarked, toggleBookmark, refreshBookmarks } = useHaditsBookmark();

  useFocusEffect(
    useCallback(() => {
      void refreshBookmarks();
    }, [refreshBookmarks]),
  );

  const buildHaditsMessage = () => {
    if (!item) {
      return "";
    }

    return `Hadits #${item.nomor}\n${item.title}\n\n${item.arabic}\n\n${item.translation}`;
  };

  const handleCopy = () => {
    if (!item) {
      return;
    }
    Clipboard.setString(buildHaditsMessage());
    Alert.alert("Tersalin", "Hadits berhasil disalin.");
  };

  const handleShare = async () => {
    if (!item) {
      return;
    }

    try {
      await Share.share({ message: buildHaditsMessage() });
    } catch {
      Alert.alert("Gagal", "Belum bisa membagikan hadits saat ini.");
    }
  };

  const handleToggleBookmark = async () => {
    if (!item) {
      return;
    }

    const added = await toggleBookmark(item);
    Alert.alert(
      "Bookmark Hadits",
      added ? "Hadits berhasil disimpan ke bookmark." : "Hadits dihapus dari bookmark.",
    );
  };

  const detailIsBookmarked = item ? isBookmarked(item) : false;

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#363636" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636]">Detail Hadits</Text>
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
          <Text className="text-[#728d8d] text-xs mt-2">Memuat detail hadits...</Text>
        </View>
      ) : !item ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">
            {error || "Detail hadits tidak ditemukan"}
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

          <View className="rounded-3xl bg-[#336363] p-5 border border-[#2e5b5b]">
            <View className="flex-row items-center justify-between">
              <Text className="text-[#d7eceb] text-xs font-semibold uppercase">
                Detail Hadits
              </Text>
              <View className="px-2.5 py-1 rounded-full bg-white/20">
                <Text className="text-white text-xs font-semibold">#{item.nomor}</Text>
              </View>
            </View>
            <Text className="text-white font-bold text-[22px] leading-8 mt-3">
              {item.title}
            </Text>
            {item.source ? (
              <View className="self-start mt-3 px-2.5 py-1 rounded-full bg-white/15">
                <Text className="text-[#dff5f4] text-xs font-medium">{item.source}</Text>
              </View>
            ) : null}
          </View>

          <View className="rounded-2xl bg-[#ecf4f3] border border-[#d7e8e6] p-5 mt-4">
            <Text className="text-[#336363] text-xs font-semibold uppercase">Teks Arab</Text>
            <Text
              className="text-right text-[32px] leading-[50px] text-[#0f172a] mt-3"
              style={{ writingDirection: "rtl" }}
            >
              {item.arabic || "-"}
            </Text>
          </View>

          <View className="rounded-2xl bg-white border border-[#e5e5e5] p-5 mt-4">
            <Text className="text-[#336363] text-xs font-semibold uppercase">Terjemahan</Text>
            <Text className="text-[#374151] text-base leading-8 mt-3">
              {item.translation || "Terjemahan belum tersedia."}
            </Text>
          </View>

          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={() => void handleToggleBookmark()}
              className="flex-1 min-h-[46px] rounded-xl border border-[#d1d5db] bg-white flex-row items-center justify-center gap-2"
            >
              <Bookmark
                size={18}
                color="#1f2937"
                fill={detailIsBookmarked ? "#1f2937" : "transparent"}
                fillOpacity={detailIsBookmarked ? 0.9 : 0}
              />
              <Text className="text-[#1f2937] font-medium">
                {detailIsBookmarked ? "Tersimpan" : "Simpan"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCopy}
              className="flex-1 min-h-[46px] rounded-xl border border-[#d1d5db] bg-white flex-row items-center justify-center gap-2"
            >
              <Copy size={18} color="#1f2937" />
              <Text className="text-[#1f2937] font-medium">Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void handleShare()}
              className="flex-1 min-h-[46px] rounded-xl bg-[#336363] flex-row items-center justify-center gap-2"
            >
              <Share2 size={18} color="#ffffff" />
              <Text className="text-white font-semibold">Share</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
