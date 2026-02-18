import { AsmaulHusnaItem } from "@/types/asmaul-husna";
import { Copy, Share2 } from "lucide-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AsmaulHusnaDetailSheetProps {
  visible: boolean;
  item: AsmaulHusnaItem | null;
  onClose: () => void;
  onCopy: () => void;
  onShare: () => void;
}

const SHEET_HIDDEN_OFFSET = 320;

export function AsmaulHusnaDetailSheet({
  visible,
  item,
  onClose,
  onCopy,
  onShare,
}: AsmaulHusnaDetailSheetProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      return;
    }

    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [progress, visible]);

  const backdropOpacity = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.2],
      }),
    [progress],
  );

  const sheetTranslateY = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [SHEET_HIDDEN_OFFSET, 0],
      }),
    [progress],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
          <View className="bg-white rounded-t-3xl px-5 pb-8 pt-4">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

            {item ? (
              <>
                <Text className="text-[11px] text-[#647b7b] font-semibold">
                  {item.id}
                </Text>
                <Text
                  className="text-right text-[40px] leading-[52px] text-[#1f2937] mt-2"
                  style={{ writingDirection: "rtl" }}
                >
                  {item.arabic}
                </Text>
                <Text className="text-[#1f2937] font-bold text-lg mt-2">
                  {item.latin}
                </Text>
                <Text className="text-[#374151] text-sm leading-6 mt-2">
                  {item.meaning}
                </Text>

                <View className="flex-row gap-3 mt-5">
                  <TouchableOpacity
                    onPress={onCopy}
                    activeOpacity={0.8}
                    className="flex-1 min-h-[44px] rounded-xl border border-[#d1d5db] flex-row items-center justify-center gap-2"
                  >
                    <Copy size={18} color="#1f2937" />
                    <Text className="text-[#1f2937] font-medium">Copy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onShare}
                    activeOpacity={0.8}
                    className="flex-1 min-h-[44px] rounded-xl bg-[#728d8d] flex-row items-center justify-center gap-2"
                  >
                    <Share2 size={18} color="#ffffff" />
                    <Text className="text-white font-medium">Share</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
});
