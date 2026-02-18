import { KiblatActionSheet } from "@/components/menu/kiblat/kiblat-action-sheet";
import { KiblatCompassCard } from "@/components/menu/kiblat/kiblat-compass-card";
import { KiblatHeader } from "@/components/menu/kiblat/kiblat-header";
import { KiblatLocationInfo } from "@/components/menu/kiblat/kiblat-location-info";
import { useQiblaActionSheet } from "@/hooks/qibla/use-qibla-action-sheet";
import { useQiblaDirection } from "@/hooks/qibla/use-qibla-direction";
import { useQiblaDirectionLabel } from "@/hooks/qibla/use-qibla-direction-label";
import { useUserLocation } from "@/hooks/use-user-location";
import { router } from "expo-router";
import React from "react";
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KiblatMenuScreen() {
  const { relativeAngle, isAligned, loading, error, refresh } =
    useQiblaDirection();
  const { lokasi, loading: locationLoading } = useUserLocation();

  const directionLabel = useQiblaDirectionLabel(relativeAngle, isAligned);
  const {
    isVisible,
    backdropOpacity,
    sheetTranslateY,
    openActionMenu,
    closeActionMenu,
  } = useQiblaActionSheet();

  const handleRefreshLocation = () => {
    closeActionMenu();
    void refresh();
  };

  const handleCompassCalibration = () => {
    closeActionMenu();
    Alert.alert(
      "Kalibrasi Kompas",
      "Gerakkan ponsel membentuk angka 8 selama 5-10 detik, lalu jauhkan dari benda logam.",
      [
        {
          text: "Mulai",
          onPress: () => {
            void refresh();
          },
        },
        { text: "Batal", style: "cancel" },
      ],
    );
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("@/assets/images/kabah.png")}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      >
        <View
          className="absolute top-0 right-0 bottom-0 left-0"
          style={{ backgroundColor: "rgba(251,245,234,0.76)" }}
        />
      </ImageBackground>

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1">
          <KiblatHeader
            onBackPress={() => router.back()}
            onMenuPress={openActionMenu}
          />

          <View className="flex-1 px-4 pt-5">
            <KiblatLocationInfo
              locationLabel={locationLoading ? "Mencari lokasi..." : lokasi}
              directionLabel={directionLabel}
              loading={loading}
              error={error}
            />

            <View className="flex-1 items-center justify-center">
              <KiblatCompassCard
                relativeAngle={relativeAngle}
              />
            </View>

            <Text className="text-center text-xs text-gray-600 pb-3">
              Jauhkan ponsel dari benda logam agar kompas stabil.
            </Text>
          </View>
        </View>

        <KiblatActionSheet
          visible={isVisible}
          backdropOpacity={backdropOpacity}
          sheetTranslateY={sheetTranslateY}
          onClose={closeActionMenu}
          onRefreshLocation={handleRefreshLocation}
          onCompassCalibration={handleCompassCalibration}
        />
      </SafeAreaView>
    </View>
  );
}
