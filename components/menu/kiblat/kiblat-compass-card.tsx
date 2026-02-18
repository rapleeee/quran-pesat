import React from "react";
import { Image, StyleSheet, View } from "react-native";

const COMPASS_SIZE = 400;

interface KiblatCompassCardProps {
  relativeAngle: number | null;
}

export function KiblatCompassCard({ relativeAngle }: KiblatCompassCardProps) {
  return (
    <View
      style={{ width: COMPASS_SIZE, height: COMPASS_SIZE }}
      className="items-center justify-center"
    >
      <Image
        source={require("@/assets/images/compass.png")}
        style={[
          styles.compassImage,
          { transform: [{ rotate: `${relativeAngle ?? 0}deg` }] },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  compassImage: {
    ...StyleSheet.absoluteFillObject,
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
  },
});
