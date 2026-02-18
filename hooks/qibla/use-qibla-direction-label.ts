import { useMemo } from "react";

export function useQiblaDirectionLabel(
  relativeAngle: number | null,
  isAligned: boolean,
): string {
  return useMemo(() => {
    if (relativeAngle === null) {
      return "Menunggu data kompas...";
    }

    if (isAligned) {
      return "Arah kiblat sudah tepat.";
    }

    if (relativeAngle <= 180) {
      return `Putar ke kanan ${relativeAngle.toFixed(0)}°`;
    }

    return `Putar ke kiri ${(360 - relativeAngle).toFixed(0)}°`;
  }, [isAligned, relativeAngle]);
}
