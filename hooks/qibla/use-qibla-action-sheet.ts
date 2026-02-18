import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

const SHEET_HIDDEN_OFFSET = 280;

interface UseQiblaActionSheetResult {
  isVisible: boolean;
  backdropOpacity: Animated.AnimatedInterpolation<number>;
  sheetTranslateY: Animated.AnimatedInterpolation<number>;
  openActionMenu: () => void;
  closeActionMenu: () => void;
}

export function useQiblaActionSheet(): UseQiblaActionSheetResult {
  const [isVisible, setIsVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const openActionMenu = useCallback(() => {
    progress.setValue(0);
    setIsVisible(true);

    Animated.timing(progress, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const closeActionMenu = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
      }
    });
  }, [progress]);

  const backdropOpacity = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.1],
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

  return {
    isVisible,
    backdropOpacity,
    sheetTranslateY,
    openActionMenu,
    closeActionMenu,
  };
}
