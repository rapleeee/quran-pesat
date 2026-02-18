import { buildDzikirShareText } from "@/data/dzikir";
import { SpeakArabicHandlers } from "@/hooks/dzikir/use-dzikir-speech";
import { DzikirHarianItem } from "@/types/dzikir";
import { useCallback, useMemo, useState } from "react";
import { Alert, Clipboard, Share } from "react-native";

interface UseDzikirDetailActionsParams {
  isBookmarked: (item: DzikirHarianItem) => boolean;
  toggleBookmark: (item: DzikirHarianItem) => Promise<boolean>;
  isSpeaking: boolean;
  speakArabic: (text: string, handlers?: SpeakArabicHandlers) => void;
  stopSpeech: () => void;
  onOpenVoiceGuide: () => void;
}

export function useDzikirDetailActions({
  isBookmarked,
  toggleBookmark,
  isSpeaking,
  speakArabic,
  stopSpeech,
  onOpenVoiceGuide,
}: UseDzikirDetailActionsParams) {
  const [selectedItem, setSelectedItem] = useState<DzikirHarianItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const openDetail = useCallback(
    (item: DzikirHarianItem) => {
      if (isSpeaking) {
        stopSpeech();
      }
      setSelectedItem(item);
      setIsDetailVisible(true);
    },
    [isSpeaking, stopSpeech],
  );

  const closeDetail = useCallback(() => {
    if (isSpeaking) {
      stopSpeech();
    }
    setIsDetailVisible(false);
    setSelectedItem(null);
  }, [isSpeaking, stopSpeech]);

  const handleCopy = useCallback(() => {
    if (!selectedItem) {
      return;
    }

    Clipboard.setString(buildDzikirShareText(selectedItem));
    Alert.alert("Tersalin", "Dzikir berhasil disalin.");
  }, [selectedItem]);

  const handleShare = useCallback(async () => {
    if (!selectedItem) {
      return;
    }

    try {
      await Share.share({ message: buildDzikirShareText(selectedItem) });
    } catch {
      Alert.alert("Gagal", "Tidak bisa membagikan dzikir saat ini.");
    }
  }, [selectedItem]);

  const handleToggleBookmark = useCallback(
    async (item: DzikirHarianItem) => {
      const added = await toggleBookmark(item);
      Alert.alert(
        "Bookmark Dzikir",
        added
          ? "Dzikir berhasil disimpan ke bookmark."
          : "Dzikir dihapus dari bookmark.",
      );
    },
    [toggleBookmark],
  );

  const handleToggleSpeech = useCallback(() => {
    if (!selectedItem) {
      return;
    }

    speakArabic(selectedItem.arabic, {
      onMissingModule: () => {
        Alert.alert(
          "Voice belum tersedia",
          "Paket voice belum terpasang. Jalankan: npx expo install expo-speech",
        );
      },
      onMissingArabicVoice: () => {
        Alert.alert(
          "Voice Arab belum ada di perangkat",
          "Pasang Arabic TTS voice di pengaturan sistem agar bacaan benar-benar Arab.",
          [
            { text: "Nanti", style: "cancel" },
            { text: "Lihat Panduan", onPress: onOpenVoiceGuide },
          ],
        );
      },
      onError: () => {
        Alert.alert("Gagal", "Voice tidak tersedia di perangkat ini.");
      },
    });
  }, [onOpenVoiceGuide, selectedItem, speakArabic]);

  const selectedIsBookmarked = useMemo(
    () => (selectedItem ? isBookmarked(selectedItem) : false),
    [isBookmarked, selectedItem],
  );

  return {
    selectedItem,
    isDetailVisible,
    selectedIsBookmarked,
    openDetail,
    closeDetail,
    handleCopy,
    handleShare,
    handleToggleBookmark,
    handleToggleSpeech,
  };
}
