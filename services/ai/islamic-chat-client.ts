import { ISLAMIC_ASSISTANT_SYSTEM_PROMPT } from "@/data/ai-chat";
import { AIChatPayloadMessage } from "@/types/ai-chat";

const AI_API_URL = process.env.EXPO_PUBLIC_ISLAMIC_AI_API_URL?.trim();
const AI_API_KEY = process.env.EXPO_PUBLIC_ISLAMIC_AI_API_KEY?.trim();
const AI_PROVIDER = process.env.EXPO_PUBLIC_ISLAMIC_AI_PROVIDER?.trim().toLowerCase();
const TOGETHER_API_URL =
  process.env.EXPO_PUBLIC_TOGETHER_API_URL?.trim() ||
  "https://api.together.xyz/v1/chat/completions";
const TOGETHER_API_KEY = process.env.EXPO_PUBLIC_TOGETHER_API_KEY?.trim();
const TOGETHER_MODEL = process.env.EXPO_PUBLIC_TOGETHER_MODEL?.trim();

function shouldUseTogetherProvider(): boolean {
  if (AI_PROVIDER === "together") {
    return true;
  }

  if (AI_API_URL?.includes("together.xyz")) {
    return true;
  }

  return Boolean(TOGETHER_API_KEY && TOGETHER_MODEL);
}

function extractReply(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const source = payload as Record<string, unknown>;
  const directCandidates = [
    source.reply,
    source.response,
    source.answer,
    source.text,
    source.message,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  if (source.data && typeof source.data === "object" && !Array.isArray(source.data)) {
    const nestedData = source.data as Record<string, unknown>;
    for (const key of ["reply", "response", "answer", "text", "message"]) {
      const value = nestedData[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
  }

  if (Array.isArray(source.choices) && source.choices.length > 0) {
    const firstChoice = source.choices[0];
    if (firstChoice && typeof firstChoice === "object") {
      const choice = firstChoice as Record<string, unknown>;
      const message = choice.message;
      if (message && typeof message === "object") {
        const content = (message as Record<string, unknown>).content;
        if (typeof content === "string" && content.trim().length > 0) {
          return content.trim();
        }
      }

      const text = choice.text;
      if (typeof text === "string" && text.trim().length > 0) {
        return text.trim();
      }
    }
  }

  return null;
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const source = payload as Record<string, unknown>;
  const directMessage = source.message;
  if (typeof directMessage === "string" && directMessage.trim().length > 0) {
    return directMessage.trim();
  }

  const error = source.error;
  if (typeof error === "string" && error.trim().length > 0) {
    return error.trim();
  }

  if (error && typeof error === "object") {
    const nestedError = error as Record<string, unknown>;
    const nestedMessage = nestedError.message;
    if (typeof nestedMessage === "string" && nestedMessage.trim().length > 0) {
      return nestedMessage.trim();
    }
    const nestedType = nestedError.type;
    if (typeof nestedType === "string" && nestedType.trim().length > 0) {
      return nestedType.trim();
    }
  }

  return null;
}

async function readErrorText(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    if (!text.trim()) {
      return null;
    }

    try {
      const parsed = JSON.parse(text) as unknown;
      return extractErrorMessage(parsed) || text;
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

export async function generateIslamicAssistantReply(
  history: AIChatPayloadMessage[],
): Promise<string> {
  if (!AI_API_URL && !shouldUseTogetherProvider()) {
    return "Mode AI lokal aktif. Set `EXPO_PUBLIC_ISLAMIC_AI_API_URL` untuk menghubungkan model AI kamu.";
  }

  if (shouldUseTogetherProvider()) {
    if (!TOGETHER_MODEL) {
      throw new Error(
        "Model Together belum diset. Tambahkan `EXPO_PUBLIC_TOGETHER_MODEL`.",
      );
    }

    const endpoint = AI_API_URL || TOGETHER_API_URL;
    const togetherKey = TOGETHER_API_KEY || AI_API_KEY;
    if (!togetherKey) {
      throw new Error(
        "API key Together belum diset. Tambahkan `EXPO_PUBLIC_TOGETHER_API_KEY`.",
      );
    }

    const togetherPayload = {
      model: TOGETHER_MODEL,
      messages: [
        { role: "system", content: ISLAMIC_ASSISTANT_SYSTEM_PROMPT },
        ...history,
      ],
      temperature: 0.3,
      max_tokens: 900,
    };

    const togetherResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${togetherKey}`,
      },
      body: JSON.stringify(togetherPayload),
    });

    if (!togetherResponse.ok) {
      const detailMessage = await readErrorText(togetherResponse);
      throw new Error(
        `Request Together AI gagal (${togetherResponse.status})${
          detailMessage ? `: ${detailMessage}` : ""
        }`,
      );
    }

    const togetherData = await togetherResponse.json();
    const togetherReply = extractReply(togetherData);
    if (!togetherReply) {
      throw new Error("Response Together AI tidak berisi jawaban");
    }

    return togetherReply;
  }

  const payload = {
    scope: "islam-only",
    messages: [
      { role: "system", content: ISLAMIC_ASSISTANT_SYSTEM_PROMPT },
      ...history,
    ],
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (AI_API_KEY) {
    headers.Authorization = `Bearer ${AI_API_KEY}`;
  }

  const response = await fetch(AI_API_URL!, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detailMessage = await readErrorText(response);
    throw new Error(
      `Request AI gagal (${response.status})${detailMessage ? `: ${detailMessage}` : ""}`,
    );
  }

  const data = await response.json();
  const reply = extractReply(data);
  if (!reply) {
    throw new Error("Response AI tidak berisi jawaban");
  }

  return reply;
}
