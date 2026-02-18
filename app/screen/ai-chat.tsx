import { AI_QUICK_PROMPTS } from "@/data/ai-chat";
import { useIslamicChat } from "@/hooks/ai/use-islamic-chat";
import { AIChatMessage } from "@/types/ai-chat";
import { router } from "expo-router";
import { ArrowLeft, RotateCcw, Send, Sparkles } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MarkdownTextProps {
  content: string;
  className: string;
  boldClassName?: string;
}

function normalizeMarkdownLine(line: string): string {
  const headingMatch = line.match(/^\s{0,3}#{1,6}\s+(.+)$/);
  if (headingMatch?.[1]) {
    return headingMatch[1];
  }

  const bulletMatch = line.match(/^\s*[-*]\s+(.+)$/);
  if (bulletMatch?.[1]) {
    return `• ${bulletMatch[1]}`;
  }

  return line;
}

function MarkdownText({ content, className, boldClassName }: MarkdownTextProps) {
  const lines = useMemo(
    () => content.replace(/\r\n/g, "\n").split("\n").map(normalizeMarkdownLine),
    [content],
  );

  return (
    <Text className={className}>
      {lines.map((line, lineIndex) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <React.Fragment key={`line-${lineIndex}`}>
            {parts.map((part, partIndex) => {
              const isBoldPart = part.startsWith("**") && part.endsWith("**");
              const normalizedPart = isBoldPart ? part.slice(2, -2) : part;

              return (
                <Text
                  key={`part-${lineIndex}-${partIndex}`}
                  className={isBoldPart ? boldClassName : undefined}
                >
                  {normalizedPart}
                </Text>
              );
            })}
            {lineIndex < lines.length - 1 ? "\n" : null}
          </React.Fragment>
        );
      })}
    </Text>
  );
}

function ChatBubble({ message }: { message: AIChatMessage }) {
  const isAssistant = message.role === "assistant";

  if (isAssistant) {
    return (
      <View className="bg-white rounded-2xl p-4 mb-3 max-w-[88%] self-start border border-[#e9e9e9]">
        <View className="flex-row items-center mb-2">
          <View className="w-6 h-6 rounded-full bg-[#728d8d] items-center justify-center mr-2">
            <Sparkles size={12} color="#fff" />
          </View>
          <Text className="font-semibold text-[#728d8d]">Asisten AI</Text>
        </View>
        <MarkdownText
          content={message.content}
          className="text-[#363636] leading-6"
          boldClassName="font-bold text-[#1f2937]"
        />
      </View>
    );
  }

  return (
    <View className="bg-[#336363] rounded-2xl p-4 mb-3 max-w-[88%] self-end">
      <MarkdownText
        content={message.content}
        className="text-white leading-6"
        boldClassName="font-bold text-white"
      />
    </View>
  );
}

export default function AIChat() {
  const [message, setMessage] = useState("");
  const { messages, loading, error, sendMessage, resetChat } = useIslamicChat();
  const scrollRef = useRef<ScrollView>(null);

  const showQuickPrompts = useMemo(
    () =>
      messages.length <= 1 &&
      message.trim().length === 0 &&
      !loading,
    [loading, message, messages.length],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);

    return () => clearTimeout(timer);
  }, [loading, messages.length]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading) {
      return;
    }

    setMessage("");
    await sendMessage(trimmedMessage);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#363636" />
        </TouchableOpacity>
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-[#728d8d] items-center justify-center mr-3">
            <Sparkles size={20} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg text-[#363636]">Asisten Islami AI</Text>
            <Text className="text-xs text-gray-500">Fokus tanya jawab seputar Islam</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={resetChat}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-[#e5e5e5]"
        >
          <RotateCcw size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {showQuickPrompts ? (
            <View className="mb-4">
              <Text className="text-[#4b5563] text-xs font-semibold mb-2">Contoh pertanyaan:</Text>
              <View className="gap-2">
                {AI_QUICK_PROMPTS.map((prompt) => (
                  <TouchableOpacity
                    key={prompt}
                    onPress={() => handleQuickPrompt(prompt)}
                    className="rounded-xl bg-white border border-[#e8e8e8] px-3 py-2"
                  >
                    <Text className="text-[#374151] text-sm">{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {messages.map((chatMessage) => (
            <ChatBubble key={chatMessage.id} message={chatMessage} />
          ))}

          {loading ? (
            <View className="bg-white rounded-2xl px-4 py-3 self-start border border-[#e5e5e5] flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#728d8d" />
              <Text className="text-[#6b7280] text-sm">Asisten sedang mengetik...</Text>
            </View>
          ) : null}

          {error ? <Text className="text-xs text-red-500 mt-3">{error}</Text> : null}
        </ScrollView>

        <View className="px-4 pb-6 pt-2 border-t border-[#e5e5e5] bg-[#fbf5ea]">
          <View className="flex-row items-end gap-2">
            <View className="flex-1 bg-white rounded-2xl px-4 py-3 border border-[#e5e5e5]">
              <TextInput
                placeholder="Tanyakan seputar Islam..."
                placeholderTextColor="#9ca3af"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={1000}
                className="text-[#363636] max-h-24"
              />
            </View>
            <TouchableOpacity
              onPress={() => void handleSend()}
              disabled={!message.trim() || loading}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                !message.trim() || loading ? "bg-[#9db4b4]" : "bg-[#728d8d]"
              }`}
            >
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
