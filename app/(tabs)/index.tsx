import MenuBeranda from "@/components/menu-beranda";
import RamadhanBanner from "@/components/ramadhan-banner";
import CardPrayer from "@/components/ui/card-prayer";
import HomeLiveClock from "@/components/ui/home-live-clock";
import JadwalSholat from "@/components/ui/jadwalSholat";
import { usePrayerTimes } from "@/hooks/prayer/use-prayer-times";
import { useHijriDate } from "@/hooks/use-hijri-date";
import { useUserLocation } from "@/hooks/use-user-location";
import { router } from "expo-router";
import { Bell, SearchIcon } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./../style/global.css";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.42;

function LocationSkeleton() {
  return (
    <View className="mt-1">
      <View className="h-3 w-28 bg-white dark:bg-[#111827]/40 rounded" />
      <View className="h-3 w-44 bg-white dark:bg-[#111827]/30 rounded mt-1" />
    </View>
  );
}

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const [bannerVersion, setBannerVersion] = useState(0);

  const tanggalHijriyah = useHijriDate();
  const {
    lokasi,
    loading: loadingLocation,
    provinceName,
    kabkota,
    refetch: refetchLocation,
  } = useUserLocation();
  const {
    jadwal,
    loading: loadingPrayer,
    error: prayerError,
    refetch: refetchPrayer,
  } = usePrayerTimes({
    provinceName,
    kabkota,
  });

  const openSearch = () => {
    router.push("/screen/search-all");
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const refreshStartedAt = Date.now();
    try {
      await Promise.all([refetchLocation(), refetchPrayer()]);
      setBannerVersion((prev) => prev + 1);
    } finally {
      const elapsed = Date.now() - refreshStartedAt;
      if (elapsed < 450) {
        await new Promise((resolve) => setTimeout(resolve, 450 - elapsed));
      }
      setRefreshing(false);
    }
  }, [refetchLocation, refetchPrayer]);

  return (
    <ScrollView
      className="bg-[#fbf5ea] dark:bg-[#0b1220] flex-1"
      bounces
      alwaysBounceVertical
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void handleRefresh()}
          tintColor="#728d8d"
          colors={["#728d8d"]}
          progressBackgroundColor="#fbf5ea"
          progressViewOffset={Platform.OS === "android" ? 12 : 0}
        />
      }
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="bg-[#fbf5ea] dark:bg-[#0b1220] flex-1">
        <Image
          source={require("@/assets/images/element.png")}
          style={{ width: "100%", height: IMAGE_HEIGHT }}
          className="absolute top-0 rounded-b-3xl"
          resizeMode="cover"
        />

        <SafeAreaView edges={["top"]}>
          <View className="p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-medium text-lg">
                {tanggalHijriyah}
              </Text>
              {loadingLocation ? (
                <LocationSkeleton />
              ) : (
                <Text className="text-white/70 font-medium text-sm">
                  {lokasi}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => router.push("/screen/notification")}
            >
              <Bell color="white" size={24} fill={"#fff"} fillOpacity={0.8} />
            </TouchableOpacity>
          </View>

          <HomeLiveClock
            jadwal={jadwal}
            loading={loadingPrayer}
            error={prayerError}
          />

          <JadwalSholat
            jadwal={jadwal}
            loading={loadingPrayer}
            error={prayerError}
          />
        </SafeAreaView>

        <View style={{ marginTop: IMAGE_HEIGHT * 0.1 }}>
          <TouchableOpacity
            onPress={openSearch}
            activeOpacity={0.8}
            className="py-3 px-3 mx-4 mt-6 bg-[#f0eee5] rounded-xl border border-[#c2c1c1] flex-row items-center gap-2"
          >
            <TextInput
              placeholder="Cari surat, doa, artikel, hadits ..."
              placeholderTextColor={"gray"}
              className="flex-1 text-sm text-[#336363] dark:text-[#9fb7b7]"
              editable={false}
              pointerEvents="none"
            />
            <SearchIcon color={"gray"} />
          </TouchableOpacity>

          <MenuBeranda />
          <RamadhanBanner key={bannerVersion} />
          <CardPrayer />
          <View className="mt-8 mb-12">
            <Text className="px-4 font-light text-xs text-center text-[#336363] dark:text-[#9fb7b7] mb-6">
              Semua operasional aplikasi ini di develop dengan individu {"\n"}
              bukan kelompok atau organisasi masyarakat
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
