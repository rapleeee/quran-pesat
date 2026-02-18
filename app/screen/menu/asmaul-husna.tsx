import { AsmaulHusnaCard } from "@/components/menu/asmaul-husna/asmaul-husna-card";
import { AsmaulHusnaDetailSheet } from "@/components/menu/asmaul-husna/asmaul-husna-detail-sheet";
import { useAsmaulHusna } from "@/hooks/asmaul-husna/use-asmaul-husna";
import { AsmaulHusnaItem } from "@/types/asmaul-husna";
import { router } from "expo-router";
import { ArrowLeft, RefreshCw, Search, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  FlatList,
  RefreshControl,
  Share,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function LoadingGrid() {
  return (
    <View className="px-4 py-4">
      <View className="flex-row gap-2 mb-2">
        <View className="flex-1 h-28 rounded-xl bg-[#e9e4d8]" />
        <View className="flex-1 h-28 rounded-xl bg-[#e9e4d8]" />
        <View className="flex-1 h-28 rounded-xl bg-[#e9e4d8]" />
      </View>
      <View className="flex-row gap-2">
        <View className="flex-1 h-28 rounded-xl bg-[#e9e4d8]" />
        <View className="flex-1 h-28 rounded-xl bg-[#e9e4d8]" />
        <View className="flex-1 h-28 rounded-xl bg-[#e9e4d8]" />
      </View>
    </View>
  );
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function AsmaulHusnaScreen() {
  const { items, loading, error, refetch } = useAsmaulHusna();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AsmaulHusnaItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const normalizedQuery = normalize(query);
  const showInitialLoading = loading && items.length === 0 && !error;

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    const arabicQuery = query.trim();
    return items.filter((item) => {
      return (
        (arabicQuery.length > 0 && item.arabic.includes(arabicQuery)) ||
        normalize(item.latin).includes(normalizedQuery) ||
        normalize(item.meaning).includes(normalizedQuery)
      );
    });
  }, [items, normalizedQuery, query]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const openDetail = useCallback((item: AsmaulHusnaItem) => {
    setSelectedItem(item);
    setIsDetailVisible(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailVisible(false);
    setSelectedItem(null);
  }, []);

  const createShareMessage = useCallback((item: AsmaulHusnaItem): string => {
    return `${item.id}. ${item.latin}\n${item.arabic}\n\nArti: ${item.meaning}`;
  }, []);

  const handleCopy = useCallback(() => {
    if (!selectedItem) {
      return;
    }

    Clipboard.setString(createShareMessage(selectedItem));
    Alert.alert("Tersalin", "Detail Asmaul Husna berhasil disalin.");
  }, [createShareMessage, selectedItem]);

  const handleShare = useCallback(async () => {
    if (!selectedItem) {
      return;
    }

    try {
      await Share.share({
        message: createShareMessage(selectedItem),
      });
    } catch {
      Alert.alert("Gagal", "Tidak bisa membagikan data saat ini.");
    }
  }, [createShareMessage, selectedItem]);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#363636" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636]">Asmaul Husna</Text>
        <TouchableOpacity
          onPress={() => void handleRefresh()}
          className="w-11 h-11 items-center justify-center"
        >
          <RefreshCw size={18} color="#363636" />
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-3 pb-2">
        <View className="min-h-[44px] rounded-xl border border-[#d8d8d8] bg-white px-3 flex-row items-center">
          <Search size={18} color="#6b7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Cari arab, latin, arti..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-[#1f2937] py-2"
          />
          {query.length > 0 ? (
            <TouchableOpacity
              onPress={() => setQuery("")}
              className="w-8 h-8 items-center justify-center"
            >
              <X size={16} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {showInitialLoading ? (
        <>
          <View className="items-center py-3">
            <ActivityIndicator size="small" color="#728d8d" />
            <Text className="text-[#728d8d] text-xs mt-1">Memuat data...</Text>
          </View>
          <LoadingGrid />
        </>
      ) : error && items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">{error}</Text>
          <TouchableOpacity
            onPress={() => void handleRefresh()}
            className="mt-3 px-4 py-2 rounded-lg bg-[#728d8d]"
          >
            <Text className="text-white text-sm font-medium">Coba lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          columnWrapperStyle={{ gap: 8, marginBottom: 8, flexDirection: "row-reverse" }}
          renderItem={({ item, index }) => (
            <AsmaulHusnaCard
              orderLabel={item.id || String(index + 1)}
              item={item}
              query={query}
              onPress={openDetail}
            />
          )}
          ListEmptyComponent={
            <View className="px-6 py-16 items-center">
              <Text className="text-[#4b5563] text-center">
                {`Tidak ada hasil untuk "${query.trim()}".`}
              </Text>
            </View>
          }
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void handleRefresh()}
              tintColor="#728d8d"
              colors={["#728d8d"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <AsmaulHusnaDetailSheet
        visible={isDetailVisible}
        item={selectedItem}
        onClose={closeDetail}
        onCopy={handleCopy}
        onShare={() => void handleShare()}
      />
    </SafeAreaView>
  );
}
