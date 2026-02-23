import {
  ISLAMIC_ONLY_FALLBACK_REPLY,
  ISLAMIC_WELCOME_MESSAGE,
} from "@/data/ai-chat";
import { generateIslamicAssistantReply } from "@/services/ai/islamic-chat-client";
import { AIChatMessage, AIChatPayloadMessage } from "@/types/ai-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const ISLAMIC_KEYWORDS = [
  "islam",
  "allah",
  "quran",
  "alquran",
  "al-quran",
  "hadits",
  "hadis",
  "fiqih",
  "fikih",
  "aqidah",
  "tauhid",
  "akidah",
  "shalat",
  "sholat",
  "puasa",
  "zakat",
  "haji",
  "umrah",
  "sunnah",
  "sunah",
  "doa",
  "dzikir",
  "dzikr",
  "ustadz",
  "fatwa",
  "wudhu",
  "tayamum",
  "najis",
  "halal",
  "haram",
  "ramadhan",
  "syawal",
  "idul fitri",
  "idul adha",
  "jumat",
  "jumat",
  "adab",
  "syariah",
  "syariat",
  "madzhab",
  "mazhab",
];

const OUTSIDE_SCOPE_KEYWORDS = [
  "saham",
  "crypto",
  "bitcoin",
  "trading",
  "forex",
  "kode",
  "coding",
  "programming",
  "javascript",
  "react",
  "nextjs",
  "game",
  "gaming",
  "film",
  "movie",
  "drama",
  "anime",
  "pacaran",
  "dating",
  "selebriti",
  "bola",
  "nfl",
  "nba",
  "mlbb",
  "pubg",
  "valorant",
  "gacha",
];

interface UseIslamicChatResult {
  messages: AIChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
}

const CHAT_STORAGE_KEY = "ai_chat_history";

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function containsKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function hasIslamicContext(messages: AIChatMessage[]): boolean {
  return messages
    .slice(-6)
    .some((message) => containsKeyword(normalize(message.content), ISLAMIC_KEYWORDS));
}

function isOutsideIslamScope(content: string, messages: AIChatMessage[]): boolean {
  const normalizedContent = normalize(content);
  const containsIslamicKeyword = containsKeyword(normalizedContent, ISLAMIC_KEYWORDS);
  if (containsIslamicKeyword) {
    return false;
  }

  const contextIslamic = hasIslamicContext(messages);
  if (contextIslamic && normalizedContent.split(" ").length <= 7) {
    return false;
  }

  const containsOutsideKeyword = containsKeyword(
    normalizedContent,
    OUTSIDE_SCOPE_KEYWORDS,
  );
  if (containsOutsideKeyword) {
    return true;
  }

  return !contextIslamic;
}

function toPayloadMessages(messages: AIChatMessage[]): AIChatPayloadMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function normalizeIslamicTerms(text: string): string {
  return text
    .replace(/\bdhikr\b/gi, "dzikir")
    .replace(/\bhadith\b/gi, "hadits")
    .replace(/\bsalat\b/gi, "shalat");
}

function buildWelcomeMessage(): AIChatMessage {
  return {
    id: createMessageId(),
    role: "assistant",
    content: ISLAMIC_WELCOME_MESSAGE,
    createdAt: new Date().toISOString(),
  };
}

function isValidMessage(value: unknown): value is AIChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const message = value as AIChatMessage;
  return (
    typeof message.id === "string" &&
    (message.role === "assistant" || message.role === "user") &&
    typeof message.content === "string" &&
    typeof message.createdAt === "string"
  );
}

function normalizeStoredMessages(value: unknown): AIChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isValidMessage);
}

export function useIslamicChat(): UseIslamicChatResult {
  const [messages, setMessages] = useState<AIChatMessage[]>([buildWelcomeMessage()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
        if (!active) {
          return;
        }
        if (stored) {
          const parsed = JSON.parse(stored) as unknown;
          const restored = normalizeStoredMessages(parsed);
          setMessages(restored.length > 0 ? restored : [buildWelcomeMessage()]);
        } else {
          setMessages([buildWelcomeMessage()]);
        }
      } catch (loadError) {
        if (__DEV__) {
          console.error("Error loading chat history:", loadError);
        }
        setMessages([buildWelcomeMessage()]);
      } finally {
        hydratedRef.current = true;
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }
    void AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const resetChat = useCallback(() => {
    setMessages([buildWelcomeMessage()]);
    setLoading(false);
    setError(null);
    void AsyncStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();
      if (!trimmedContent || loading) {
        return;
      }

      const userMessage: AIChatMessage = {
        id: createMessageId(),
        role: "user",
        content: trimmedContent,
        createdAt: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setError(null);

      if (isOutsideIslamScope(trimmedContent, messages)) {
        const refusalMessage: AIChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: ISLAMIC_ONLY_FALLBACK_REPLY,
          createdAt: new Date().toISOString(),
        };
        setMessages([...nextMessages, refusalMessage]);
        return;
      }

      setLoading(true);
      try {
        const limitedHistory = nextMessages.slice(-12);
        const rawReply = await generateIslamicAssistantReply(
          toPayloadMessages(limitedHistory),
        );
        const reply = normalizeIslamicTerms(rawReply);

        const assistantMessage: AIChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      } catch (chatError) {
        const fallbackMessage: AIChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content:
            "Maaf, layanan AI sedang bermasalah. Coba lagi sebentar lagi.",
          createdAt: new Date().toISOString(),
        };
        setMessages((currentMessages) => [...currentMessages, fallbackMessage]);
        setError(
          chatError instanceof Error ? chatError.message : "Gagal memproses chat AI",
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    resetChat,
  };
}
