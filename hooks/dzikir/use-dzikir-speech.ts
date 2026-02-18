import { useCallback, useEffect, useState } from "react";

type SpeechOptions = {
  language?: string;
  voice?: string;
  pitch?: number;
  rate?: number;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: () => void;
};

type SpeechVoice = {
  identifier?: string;
  language?: string;
  quality?: string;
};

type SpeechModule = {
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => Promise<void> | void;
  getAvailableVoicesAsync?: () => Promise<SpeechVoice[]>;
};

export type SpeakArabicHandlers = {
  onMissingModule?: () => void;
  onMissingArabicVoice?: () => void;
  onError?: () => void;
};

let cachedSpeechModule: SpeechModule | null | undefined;

function getSpeechModule(): SpeechModule | null {
  if (cachedSpeechModule !== undefined) {
    return cachedSpeechModule;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedSpeechModule = require("expo-speech") as SpeechModule;
  } catch {
    cachedSpeechModule = null;
  }

  return cachedSpeechModule;
}

export function useDzikirSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [arabicVoiceId, setArabicVoiceId] = useState<string | null>(null);
  const [hasArabicVoice, setHasArabicVoice] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const prepareArabicVoice = async () => {
      const speech = getSpeechModule();
      if (!speech?.getAvailableVoicesAsync) {
        return;
      }

      try {
        const voices = await speech.getAvailableVoicesAsync();
        if (!isMounted) {
          return;
        }

        const arabicVoices = voices.filter((voice) =>
          voice.language?.toLowerCase().startsWith("ar"),
        );

        if (arabicVoices.length === 0) {
          setHasArabicVoice(false);
          setArabicVoiceId(null);
          return;
        }

        const selectedVoice =
          arabicVoices.find((voice) =>
            voice.language?.toLowerCase().startsWith("ar-sa"),
          ) ??
          arabicVoices.find(
            (voice) => voice.quality?.toLowerCase() === "enhanced",
          ) ??
          arabicVoices[0];

        setHasArabicVoice(true);
        setArabicVoiceId(selectedVoice?.identifier ?? null);
      } catch {
        if (isMounted) {
          setHasArabicVoice(null);
          setArabicVoiceId(null);
        }
      }
    };

    void prepareArabicVoice();

    return () => {
      isMounted = false;
      const speech = getSpeechModule();
      if (speech) {
        void speech.stop();
      }
    };
  }, []);

  const stopSpeech = useCallback(() => {
    const speech = getSpeechModule();
    if (!speech) {
      return;
    }

    void speech.stop();
    setIsSpeaking(false);
  }, []);

  const speakArabic = useCallback(
    (text: string, handlers?: SpeakArabicHandlers) => {
      const speech = getSpeechModule();
      if (!speech) {
        handlers?.onMissingModule?.();
        return;
      }

      if (isSpeaking) {
        stopSpeech();
        return;
      }

      if (hasArabicVoice === false) {
        handlers?.onMissingArabicVoice?.();
      }

      setIsSpeaking(true);
      speech.speak(text, {
        language: "ar-SA",
        voice: arabicVoiceId ?? undefined,
        pitch: 1,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          handlers?.onError?.();
        },
      });
    },
    [arabicVoiceId, hasArabicVoice, isSpeaking, stopSpeech],
  );

  return {
    isSpeaking,
    hasArabicVoice,
    stopSpeech,
    speakArabic,
  };
}
