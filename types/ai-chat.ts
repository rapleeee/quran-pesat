export type AIChatRole = "system" | "user" | "assistant";

export interface AIChatMessage {
  id: string;
  role: Exclude<AIChatRole, "system">;
  content: string;
  createdAt: string;
}

export interface AIChatPayloadMessage {
  role: AIChatRole;
  content: string;
}
