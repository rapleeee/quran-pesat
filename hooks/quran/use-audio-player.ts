import {
  setAudioModeAsync,
  useAudioPlayer as useExpoAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";

// Jumlah ayat per surah untuk menghitung ayat global
const AYAT_PER_SURAH = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111,
  110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45,
  83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55,
  78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20,
  56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21,
  11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

const logDev = (...args: unknown[]) => {
  if (__DEV__) {
    console.log(...args);
  }
};

const warnDev = (...args: unknown[]) => {
  if (__DEV__) {
    console.warn(...args);
  }
};

const errorDev = (...args: unknown[]) => {
  if (__DEV__) {
    console.error(...args);
  }
};

// Menghitung nomor ayat global berdasarkan surah dan ayat
function getGlobalAyatNumber(surah: number, ayat: number): number {
  let globalNumber = 0;
  for (let i = 0; i < surah - 1; i++) {
    globalNumber += AYAT_PER_SURAH[i];
  }
  return globalNumber + ayat;
}

export function useAudioPlayer() {
  const player = useExpoAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const pendingPlaybackRef = useRef<"ayat" | "surah" | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyatId, setCurrentAyatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [currentSurahPlaying, setCurrentSurahPlaying] = useState<number | null>(
    null,
  );
  const [fullSurahLoading, setFullSurahLoading] = useState(false);

  // Generate audio URL for specific ayat using Islamic Network CDN
  // Format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/{global_ayat}.mp3
  const getAudioUrl = (surah: number, ayat: number) => {
    const globalAyat = getGlobalAyatNumber(surah, ayat);
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyat}.mp3`;
  };

  const stopAndReset = useCallback(async () => {
    player.pause();
    if (status.isLoaded) {
      try {
        await player.seekTo(0);
      } catch (error) {
        warnDev("Failed to reset audio position:", error);
      }
    }
  }, [player, status.isLoaded]);

  const markPendingPlayback = useCallback((type: "ayat" | "surah") => {
    pendingPlaybackRef.current = type;
    if (type === "ayat") {
      setIsLoading(true);
      setFullSurahLoading(false);
    } else {
      setFullSurahLoading(true);
      setIsLoading(false);
    }
  }, []);

  const playAyat = useCallback(
    async (surah: number, ayat: number, ayatId: number) => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: "duckOthers",
        });

        // If same ayat was playing, just stop it
        if (currentAyatId === ayatId && isPlaying) {
          await stopAndReset();
          pendingPlaybackRef.current = null;
          setIsPlaying(false);
          setIsLoading(false);
          setCurrentAyatId(null);
          return;
        }

        if (status.playing) {
          await stopAndReset();
        }

        setCurrentAyatId(ayatId);
        setCurrentSurahPlaying(null);
        setIsPlayingFullSurah(false);
        setIsPlaying(false);
        markPendingPlayback("ayat");

        const audioUrl = getAudioUrl(surah, ayat);
        logDev("Playing audio from:", audioUrl);

        player.replace(audioUrl);
        void player.seekTo(0);
        player.play();
      } catch (error) {
        errorDev("Error playing audio:", error);
        errorDev("Audio URL was:", getAudioUrl(surah, ayat));
        pendingPlaybackRef.current = null;
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentAyatId(null);
      }
    },
    [
      currentAyatId,
      isPlaying,
      markPendingPlayback,
      player,
      status.playing,
      stopAndReset,
    ],
  );

  const stopAudio = useCallback(async () => {
    await stopAndReset();
    pendingPlaybackRef.current = null;
    setIsPlaying(false);
    setCurrentAyatId(null);
    setIsPlayingFullSurah(false);
    setCurrentSurahPlaying(null);
    setIsLoading(false);
    setFullSurahLoading(false);
  }, [stopAndReset]);

  // Play full surah audio from santrikoding API
  const playFullSurah = useCallback(
    async (surahNomor: number, audioUrl: string) => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: "duckOthers",
        });

        // If same surah was playing, just stop it
        if (currentSurahPlaying === surahNomor && isPlayingFullSurah) {
          await stopAndReset();
          pendingPlaybackRef.current = null;
          setIsPlayingFullSurah(false);
          setFullSurahLoading(false);
          setCurrentSurahPlaying(null);
          return;
        }

        if (status.playing) {
          await stopAndReset();
        }

        setCurrentSurahPlaying(surahNomor);
        setCurrentAyatId(null);
        setIsPlaying(false);
        setIsPlayingFullSurah(false);
        markPendingPlayback("surah");

        logDev("Playing full surah from:", audioUrl);
        logDev("Playing full surah from:", audioUrl);

        player.replace(audioUrl);
        void player.seekTo(0);
        player.play();
      } catch (error) {
        errorDev("Error playing full surah:", error);
        pendingPlaybackRef.current = null;
        setIsPlayingFullSurah(false);
        setFullSurahLoading(false);
        setCurrentSurahPlaying(null);
      }
    },
    [
      currentSurahPlaying,
      isPlayingFullSurah,
      markPendingPlayback,
      player,
      status.playing,
      stopAndReset,
    ],
  );

  useEffect(() => {
    if (!pendingPlaybackRef.current || !status.playing) {
      return;
    }

    if (pendingPlaybackRef.current === "ayat") {
      setIsLoading(false);
    } else {
      setFullSurahLoading(false);
    }

    pendingPlaybackRef.current = null;
  }, [status.playing]);

  useEffect(() => {
    if (!status.didJustFinish) {
      return;
    }

    if (currentAyatId !== null) {
      setIsPlaying(false);
      setCurrentAyatId(null);
    }

    if (currentSurahPlaying !== null) {
      setIsPlayingFullSurah(false);
      setCurrentSurahPlaying(null);
    }

    pendingPlaybackRef.current = null;
    setIsLoading(false);
    setFullSurahLoading(false);
    void player.seekTo(0);
  }, [currentAyatId, currentSurahPlaying, player, status.didJustFinish]);

  useEffect(() => {
    if (currentAyatId !== null) {
      setIsPlaying(status.playing);
      setIsPlayingFullSurah(false);
      return;
    }

    if (currentSurahPlaying !== null) {
      setIsPlayingFullSurah(status.playing);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(false);
    setIsPlayingFullSurah(false);
  }, [currentAyatId, currentSurahPlaying, status.playing]);

  return {
    playAyat,
    playFullSurah,
    stopAudio,
    isPlaying,
    isLoading,
    currentAyatId,
    isPlayingFullSurah,
    fullSurahLoading,
    currentSurahPlaying,
  };
}
