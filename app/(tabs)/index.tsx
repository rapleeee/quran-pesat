import MenuBeranda from "@/components/menu-beranda";
import RamadhanBanner from "@/components/ramadhan-banner";
import CardPrayer from "@/components/ui/card-prayer";
import JadwalSholat from "@/components/ui/jadwalSholat";
import { formatCountdown, useNextPrayer } from "@/hooks/prayer/use-next-prayer";
import { usePrayerTimes } from "@/hooks/prayer/use-prayer-times";
import { useCurrentTime } from "@/hooks/use-current-time";
import { useHijriDate } from "@/hooks/use-hijri-date";
import { useUserLocation } from "@/hooks/use-user-location";
import { router } from "expo-router";
import { Bell, SearchIcon } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./../style/global.css";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.42; // 42% tinggi layar

export default function index() {
  const date = useCurrentTime();
  const tanggalHijriyah = useHijriDate();
  const { lokasi, loading, provinceName, kabkota } = useUserLocation();
  const { jadwal } = usePrayerTimes({ provinceName, kabkota });
  const nextPrayer = useNextPrayer(jadwal);

  return (
    <ScrollView
      className="bg-[#fbf5ea] flex-1"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-[#fbf5ea] flex-1">
        <Image
          source={require("@/assets/images/element.png")}
          style={{ width: "100%", height: IMAGE_HEIGHT }}
          className="absolute top-0 rounded-b-3xl"
          resizeMode="cover"
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <SafeAreaView edges={["top"]}>
            <View className="p-4 flex-row justify-between items-center">
              <View>
                <Text className="text-white font-medium text-lg">
                  {tanggalHijriyah} H
                </Text>
                <Text className="text-white/70 font-medium text-sm">
                  {loading ? "Mencari lokasi..." : lokasi}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/screen/notification")}
              >
                <Bell color="white" size={24} fill={"#fff"} fillOpacity={0.8} />
              </TouchableOpacity>
            </View>
            <View className="justify-center items-center mt-6 mb-2">
              <Text className="text-6xl text-white font-medium">
                {date.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
              {nextPrayer && (
                <View className="items-center flex-row gap-2 mt-1">
                  <Text className="text-white/80 text-sm">
                    {nextPrayer.name} dalam
                  </Text>
                  <Text className="text-white text-sm">
                    {formatCountdown(
                      nextPrayer.hours,
                      nextPrayer.minutes,
                      nextPrayer.seconds,
                    )}
                  </Text>
                </View>
              )}
            </View>
            <JadwalSholat />
          </SafeAreaView>
          <View style={{ marginTop: IMAGE_HEIGHT * 0.1 }} className=" ">
            <View className="py-3 px-3 mx-4 mt-4 bg-[#f0eee5] rounded-xl border border-[#c2c1c1] flex-row items-center gap-2">
              <TextInput
                placeholder="Cari surat, doa, artikel ..."
                placeholderTextColor={"gray"}
                className="flex-1 text-sm text-[#336363]"
              />
              <SearchIcon color={"gray"} />
            </View>
            <MenuBeranda />
            <RamadhanBanner />
            <CardPrayer />
            <View className="mt-4 mb-32">
              <Text className="px-4 font-light text-xs text-center text-[#336363] mb-6">
                Semua operasional aplikasi ini di develop dengan individu {"\n"}
                bukan kelompok atau organisasi masyarakat
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
