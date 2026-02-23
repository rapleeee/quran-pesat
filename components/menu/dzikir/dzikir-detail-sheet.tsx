import { getDzikirTypeTitleLabel } from "@/data/dzikir";
import { DzikirHarianItem } from "@/types/dzikir";
import { Bookmark, Copy, Share2, Volume2 } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DzikirDetailSheetProps {
  visible: boolean;
  item: DzikirHarianItem | null;
  isBookmarked: boolean;
  isSpeaking: boolean;
  onClose: () => void;
  onToggleSpeech: () => void;
  onToggleBookmark: () => void;
  onCopy: () => void;
  onShare: () => void;
}

const SHEET_HIDDEN_OFFSET = 320;

export function DzikirDetailSheet({
  visible,
  item,
  isBookmarked,
  isSpeaking,
  onClose,
  onToggleSpeech,
  onToggleBookmark,
  onCopy,
  onShare,
}: DzikirDetailSheetProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  const animateClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(progress, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(dragY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  }, [dragY, onClose, progress]);

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      dragY.setValue(0);
      return;
    }

    progress.setValue(0);
    dragY.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [dragY, progress, visible]);

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

  const composedTranslateY = useMemo(
    () => Animated.add(sheetTranslateY, dragY),
    [dragY, sheetTranslateY],
  );

  const panResponder = useMemo<PanResponderInstance>(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          dragY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 110 || gestureState.vy > 1.2) {
            animateClose();
            return;
          }

          Animated.spring(dragY, {
            toValue: 0,
            speed: 24,
            bounciness: 4,
            useNativeDriver: true,
          }).start();
        },
      }),
    [animateClose, dragY],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={animateClose}
    >
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={animateClose} />
        </Animated.View>

        <Animated.View
          style={{ transform: [{ translateY: composedTranslateY }] }}
          {...panResponder.panHandlers}
        >
          <View className="bg-white dark:bg-[#111827] rounded-t-3xl px-5 pb-8 pt-4">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

            {item ? (
              <>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] text-[#647b7b] font-semibold">
                    {getDzikirTypeTitleLabel(item.type)}
                  </Text>
                  <Text className="text-[11px] text-[#647b7b] font-semibold">
                    x{item.repeat}
                  </Text>
                </View>

                <Text
                  className="text-right text-[34px] leading-[48px] text-[#1f2937] dark:text-[#e5e7eb] mt-3 font-arabic"
                  style={{ writingDirection: "rtl" }}
                >
                  {item.arabic}
                </Text>
                <Text className="text-[#374151] dark:text-[#e5e7eb] text-sm leading-6 mt-3">
                  {item.translation}
                </Text>

                <View className="mt-5 gap-3">
                  <TouchableOpacity
                    onPress={onToggleSpeech}
                    activeOpacity={0.8}
                    className={`min-h-[44px] rounded-xl flex-row items-center justify-center gap-2 ${
                      isSpeaking ? "bg-[#336363]" : "border border-[#d1d5db] dark:border-[#374151]"
                    }`}
                  >
                    <Volume2 size={18} color={isSpeaking ? "#ffffff" : "#1f2937"} />
                    <Text
                      className={
                        isSpeaking
                          ? "text-white font-medium"
                          : "text-[#1f2937] dark:text-[#e5e7eb] font-medium"
                      }
                    >
                      {isSpeaking ? "Berhenti" : "Dengarkan"}
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={onToggleBookmark}
                      activeOpacity={0.8}
                      className="flex-1 min-h-[44px] rounded-xl border border-[#d1d5db] dark:border-[#374151] flex-row items-center justify-center gap-2"
                    >
                      <Bookmark
                        size={18}
                        color="#1f2937"
                        fill={isBookmarked ? "#1f2937" : "transparent"}
                        fillOpacity={isBookmarked ? 0.9 : 0}
                      />
                      <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-medium">
                        {isBookmarked ? "Tersimpan" : "Simpan"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={onCopy}
                      activeOpacity={0.8}
                      className="flex-1 min-h-[44px] rounded-xl border border-[#d1d5db] dark:border-[#374151] flex-row items-center justify-center gap-2"
                    >
                      <Copy size={18} color="#1f2937" />
                      <Text className="text-[#1f2937] dark:text-[#e5e7eb] font-medium">Copy</Text>
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
