export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface QiblaDirectionState {
  userCoordinates: Coordinates | null;
  qiblaBearing: number | null;
  currentHeading: number | null;
  headingAccuracy: number | null;
  relativeAngle: number | null;
  isAligned: boolean;
  loading: boolean;
  error: string | null;
}
