import { Coordinates } from "@/types/qibla";

export const KAABA_COORDINATES: Coordinates = {
  latitude: 21.4225,
  longitude: 39.8262,
};

export const QIBLA_ALIGNMENT_THRESHOLD_DEGREES = 5;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

export function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function calculateBearing(
  from: Coordinates,
  to: Coordinates,
): number {
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);

  const y = Math.sin(deltaLongitude) * Math.cos(toLatitude);
  const x =
    Math.cos(fromLatitude) * Math.sin(toLatitude) -
    Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(deltaLongitude);

  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

export function calculateQiblaBearing(userCoordinates: Coordinates): number {
  return calculateBearing(userCoordinates, KAABA_COORDINATES);
}

export function calculateRelativeQiblaAngle(
  qiblaBearing: number,
  currentHeading: number,
): number {
  return normalizeDegrees(qiblaBearing - currentHeading);
}

export function isQiblaAligned(
  relativeAngle: number,
  threshold: number = QIBLA_ALIGNMENT_THRESHOLD_DEGREES,
): boolean {
  return relativeAngle <= threshold || relativeAngle >= 360 - threshold;
}
