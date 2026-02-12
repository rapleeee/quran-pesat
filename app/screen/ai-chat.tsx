import { router } from "expo-router";
import { ArrowLeft, Send, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AIChat() {
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#e5e5e5]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#363636" />
        </TouchableOpacity>
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-[#728d8d] items-center justify-center mr-3">
            <Sparkles size={20} color="#fff" />
          </View>
          <View>
            <Text className="font-bold text-lg text-[#363636]">
              Asisten Islami AI
            </Text>
            <Text className="text-xs text-gray-500">
              Tanya seputar Islam & Al-Quran
            </Text>
          </View>
        </View>
      </View>

      {/* Chat Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Welcome Message */}
          <View className="bg-white rounded-2xl p-4 mb-4 max-w-[85%] shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-6 h-6 rounded-full bg-[#728d8d] items-center justify-center mr-2">
                <Sparkles size={12} color="#fff" />
              </View>
              <Text className="font-semibold text-[#728d8d]">Asisten AI</Text>
            </View>
            <Text className="text-[#363636] leading-5">
              Assalamualaikum! 👋{"\n\n"}
              Saya asisten AI yang siap membantu Anda dengan pertanyaan seputar:
              {"\n\n"}• Tafsir Al-Quran{"\n"}• Hadits dan penjelasannya{"\n"}•
              Fiqih dan hukum Islam{"\n"}• Doa-doa harian{"\n"}• Sejarah Islam
              {"\n\n"}
              Silakan ketik pertanyaan Anda di bawah 🤲
            </Text>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View className="px-4 pb-6 pt-2 border-t border-[#e5e5e5] bg-[#fbf5ea]">
          <View className="flex-row items-end gap-2">
            <View className="flex-1 bg-white rounded-2xl px-4 py-3 border border-[#e5e5e5]">
              <TextInput
                placeholder="Ketik pertanyaan..."
                placeholderTextColor="#9ca3af"
                value={message}
                onChangeText={setMessage}
                multiline
                className="text-[#363636] max-h-24"
              />
            </View>
            <TouchableOpacity className="w-12 h-12 bg-[#728d8d] rounded-full items-center justify-center">
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
