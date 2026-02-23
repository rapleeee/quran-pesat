import { Pause, Volume2 } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type SurahAudioButtonProps = {
  loading: boolean;
  isPlaying: boolean;
  onPress: () => void;
};

export function SurahAudioButton({
  loading,
  isPlaying,
  onPress,
}: SurahAudioButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className="mx-4 mt-3 mb-2 bg-[#728d8d] rounded-xl py-3 px-4 flex-row items-center justify-center"
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : isPlaying ? (
        <Pause size={20} color="#fff" fill="#fff" />
      ) : (
        <Volume2 size={20} color="#fff" />
      )}
      <Text className="text-white font-semibold ml-2">
        {isPlaying ? "Pause Audio Surah" : "Putar Full Surah"}
      </Text>
    </TouchableOpacity>
  );
}
