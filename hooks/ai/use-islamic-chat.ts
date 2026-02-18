import {
  ISLAMIC_ONLY_FALLBACK_REPLY,
  ISLAMIC_WELCOME_MESSAGE,
} from "@/data/ai-chat";
import { generateIslamicAssistantReply } from "@/services/ai/islamic-chat-client";
import { AIChatMessage, AIChatPayloadMessage } from "@/types/ai-chat";
import { useCallback, useState } from "react";

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

export function useIslamicChat(): UseIslamicChatResult {
  const [messages, setMessages] = useState<AIChatMessage[]>([buildWelcomeMessage()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetChat = useCallback(() => {
    setMessages([buildWelcomeMessage()]);
    setLoading(false);
    setError(null);
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
