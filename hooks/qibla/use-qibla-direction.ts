import {
  calculateQiblaBearing,
  calculateRelativeQiblaAngle,
  isQiblaAligned,
  normalizeDegrees,
} from "@/data/qibla";
import { Coordinates, QiblaDirectionState } from "@/types/qibla";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseQiblaDirectionResult extends QiblaDirectionState {
  refresh: () => Promise<void>;
}

function resolveHeading(
  headingObject: Location.LocationHeadingObject,
): number | null {
  if (headingObject.trueHeading >= 0) {
    return normalizeDegrees(headingObject.trueHeading);
  }

  if (headingObject.magHeading >= 0) {
    return normalizeDegrees(headingObject.magHeading);
  }

  return null;
}

export function useQiblaDirection(): UseQiblaDirectionResult {
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(
    null,
  );
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [currentHeading, setCurrentHeading] = useState<number | null>(null);
  const [headingAccuracy, setHeadingAccuracy] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const headingSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null,
  );

  const setupQibla = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setError("Izin lokasi dibutuhkan untuk menentukan arah kiblat.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coordinates: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserCoordinates(coordinates);
      setQiblaBearing(calculateQiblaBearing(coordinates));

      const initialHeadingObject = await Location.getHeadingAsync();
      setCurrentHeading(resolveHeading(initialHeadingObject));
      setHeadingAccuracy(initialHeadingObject.accuracy ?? null);

      if (headingSubscriptionRef.current) {
        headingSubscriptionRef.current.remove();
      }

      headingSubscriptionRef.current = await Location.watchHeadingAsync(
        (headingObject) => {
          setCurrentHeading(resolveHeading(headingObject));
          setHeadingAccuracy(headingObject.accuracy ?? null);
        },
      );
    } catch (hookError) {
      setError(
        hookError instanceof Error
          ? hookError.message
          : "Gagal mengambil data kompas.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void setupQibla();

    return () => {
      if (headingSubscriptionRef.current) {
        headingSubscriptionRef.current.remove();
      }
    };
  }, [setupQibla]);

  const relativeAngle = useMemo(() => {
    if (qiblaBearing === null || currentHeading === null) {
      return null;
    }

    return calculateRelativeQiblaAngle(qiblaBearing, currentHeading);
  }, [currentHeading, qiblaBearing]);

  const aligned = useMemo(() => {
    if (relativeAngle === null) {
      return false;
    }

    return isQiblaAligned(relativeAngle);
  }, [relativeAngle]);

  return {
    userCoordinates,
    qiblaBearing,
    currentHeading,
    headingAccuracy,
    relativeAngle,
    isAligned: aligned,
    loading,
    error,
    refresh: setupQibla,
  };
}
