import { Compass, RefreshCw } from "lucide-react-native";
import React from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface KiblatActionSheetProps {
  visible: boolean;
  backdropOpacity: Animated.AnimatedInterpolation<number>;
  sheetTranslateY: Animated.AnimatedInterpolation<number>;
  onClose: () => void;
  onRefreshLocation: () => void;
  onCompassCalibration: () => void;
}

export function KiblatActionSheet({
  visible,
  backdropOpacity,
  sheetTranslateY,
  onClose,
  onRefreshLocation,
  onCompassCalibration,
}: KiblatActionSheetProps) {
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
          <View className="bg-white rounded-t-3xl px-4 pb-8 pt-4">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

            <TouchableOpacity
              onPress={onRefreshLocation}
              className="flex-row items-center gap-3 px-2 py-4 border-b border-[#e5e5e5]"
            >
              <RefreshCw size={20} color="#363636" />
              <View>
                <Text className="text-[#363636] font-semibold">
                  Refresh Lokasi
                </Text>
                <Text className="text-xs text-gray-500">
                  Ambil ulang lokasi dan arah kiblat terbaru
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCompassCalibration}
              className="flex-row items-center gap-3 px-2 py-4"
            >
              <Compass size={20} color="#363636" />
              <View>
                <Text className="text-[#363636] font-semibold">
                  Kalibrasi Kompas
                </Text>
                <Text className="text-xs text-gray-500">
                  Tampilkan panduan kalibrasi dan perbarui heading
                </Text>
              </View>
            </TouchableOpacity>
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
