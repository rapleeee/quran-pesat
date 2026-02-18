import { SupportMethodCard } from "@/components/menu/donasi/support-method-card";
import {
  developerSupportSummary,
  supportMethods,
  supportNotes,
} from "@/data/developer-support";
import { SupportMethod } from "@/types/developer-support";
import { router } from "expo-router";
import { ArrowLeft, Coins, Share2 } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Alert,
  Clipboard,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DonasiScreen() {
  const progressRatio = useMemo(() => {
    if (developerSupportSummary.monthlyTarget <= 0) {
      return 0;
    }
    return Math.min(
      developerSupportSummary.currentSupport /
        developerSupportSummary.monthlyTarget,
      1,
    );
  }, []);

  const shareMessage = useMemo(() => {
    const paymentLink = supportMethods.find(
      (method) =>
        method.type === "payment_link" &&
        method.isConfigured &&
        method.actionUrl,
    )?.actionUrl;

    const linkLine = paymentLink ? `\nLink dukungan: ${paymentLink}` : "";
    return `${developerSupportSummary.supportTitle}\n${developerSupportSummary.supportDescription}${linkLine}`;
  }, []);

  const handleCopy = (method: SupportMethod) => {
    if (!method.copyValue) {
      return;
    }

    Clipboard.setString(method.copyValue);
    Alert.alert("Tersalin", `${method.title} berhasil disalin.`);
  };

  const handleOpenLink = async (method: SupportMethod) => {
    if (!method.actionUrl || !method.isConfigured) {
      Alert.alert(
        "Belum Aktif",
        "Midtrans payment link belum diisi. Set EXPO_PUBLIC_MIDTRANS_PAYMENT_LINK di environment app.",
      );
      return;
    }

    const canOpen = await Linking.canOpenURL(method.actionUrl);
    if (!canOpen) {
      Alert.alert("Gagal", "Link checkout tidak valid.");
      return;
    }

    try {
      await Linking.openURL(method.actionUrl);
    } catch {
      Alert.alert("Gagal", "Tidak bisa membuka checkout Midtrans.");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch {
      Alert.alert("Gagal", "Belum bisa membagikan dukungan saat ini.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <View className="px-4 py-3 border-b border-[#e5e5e5] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <ArrowLeft size={20} color="#363636" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#363636]">
          Dukung Developer
        </Text>
        <TouchableOpacity
          onPress={() => void handleShare()}
          className="w-11 h-11 items-center justify-center"
        >
          <Share2 size={18} color="#363636" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mx-4 mt-4 rounded-2xl bg-[#728d8d]/15 border border-[#728d8d]/25 p-4">
          <View className="flex-row items-center gap-2">
            <Coins size={22} color="#336363" />
            <Text className="text-[#1f2937] font-bold text-base">
              {developerSupportSummary.supportTitle}
            </Text>
          </View>
          <Text className="text-[#374151] text-sm mt-2 leading-5">
            {developerSupportSummary.supportDescription}
          </Text>
          <Text className="text-[#4b5563] text-xs mt-2">
            Developer: {developerSupportSummary.developerName}
          </Text>

          <View className="mt-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[#4b5563] text-xs">
                Target operasional bulanan
              </Text>
              <Text className="text-[#1f2937] text-xs font-semibold">
                {formatIDR(developerSupportSummary.monthlyTarget)}
              </Text>
            </View>
            <View className="h-2 rounded-full bg-[#d1d5db] overflow-hidden">
              <View
                className="h-full bg-[#728d8d]"
                style={{ width: `${Math.max(progressRatio * 100, 4)}%` }}
              />
            </View>
            <Text className="text-[#4b5563] text-xs mt-2">
              Dukungan masuk:{" "}
              <Text className="font-semibold text-[#1f2937]">
                {formatIDR(developerSupportSummary.currentSupport)}
              </Text>
            </Text>
            <Text className="text-[#6b7280] text-xs mt-3">
              {developerSupportSummary.lastUpdatedLabel}
            </Text>
          </View>
        </View>

        <Text className="px-4 mt-6 mb-3 text-[#4b5563] text-xs font-semibold uppercase">
          Metode Dukungan
        </Text>

        {supportMethods.map((method) => (
          <SupportMethodCard
            key={method.id}
            method={method}
            onCopy={handleCopy}
            onOpenLink={(item) => void handleOpenLink(item)}
          />
        ))}

        <View className="mx-4 mt-2 rounded-xl bg-white border border-[#e5e5e5] p-4">
          <Text className="text-[#1f2937] font-semibold text-sm mb-2">
            Catatan Development & Transparansi
          </Text>
          {supportNotes.map((note, index) => (
            <Text key={note} className="text-[#4b5563] text-xs leading-5">
              {index + 1}. {note}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
