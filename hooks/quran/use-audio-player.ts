import { Audio } from "expo-av";
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

// Menghitung nomor ayat global berdasarkan surah dan ayat
function getGlobalAyatNumber(surah: number, ayat: number): number {
  let globalNumber = 0;
  for (let i = 0; i < surah - 1; i++) {
    globalNumber += AYAT_PER_SURAH[i];
  }
  return globalNumber + ayat;
}

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
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

  const playAyat = useCallback(
    async (surah: number, ayat: number, ayatId: number) => {
      try {
        // Configure audio mode for iOS
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Stop currently playing audio
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // If same ayat was playing, just stop it
        if (currentAyatId === ayatId && isPlaying) {
          setIsPlaying(false);
          setCurrentAyatId(null);
          return;
        }

        setIsLoading(true);
        setCurrentAyatId(ayatId);

        const audioUrl = getAudioUrl(surah, ayat);
        console.log("Playing audio from:", audioUrl);

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
        );

        soundRef.current = sound;
        setIsPlaying(true);
        setIsLoading(false);

        // Listen for playback status
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setCurrentAyatId(null);
          }
        });
      } catch (error) {
        console.error("Error playing audio:", error);
        console.error("Audio URL was:", getAudioUrl(surah, ayat));
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentAyatId(null);
      }
    },
    [currentAyatId, isPlaying],
  );

  const stopAudio = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setCurrentAyatId(null);
    setIsPlayingFullSurah(false);
    setCurrentSurahPlaying(null);
  }, []);

  // Play full surah audio from santrikoding API
  const playFullSurah = useCallback(
    async (surahNomor: number, audioUrl: string) => {
      try {
        // Configure audio mode for iOS
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        // Stop currently playing audio
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // If same surah was playing, just stop it
        if (currentSurahPlaying === surahNomor && isPlayingFullSurah) {
          setIsPlayingFullSurah(false);
          setCurrentSurahPlaying(null);
          return;
        }

        setFullSurahLoading(true);
        setCurrentSurahPlaying(surahNomor);
        setCurrentAyatId(null);
        setIsPlaying(false);

        console.log("Playing full surah from:", audioUrl);

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
        );

        soundRef.current = sound;
        setIsPlayingFullSurah(true);
        setFullSurahLoading(false);

        // Listen for playback status
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlayingFullSurah(false);
            setCurrentSurahPlaying(null);
          }
        });
      } catch (error) {
        console.error("Error playing full surah:", error);
        setIsPlayingFullSurah(false);
        setFullSurahLoading(false);
        setCurrentSurahPlaying(null);
      }
    },
    [currentSurahPlaying, isPlayingFullSurah],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

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
