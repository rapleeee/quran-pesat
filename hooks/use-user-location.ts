import { findNearestProvince } from "@/data/provinces-coordinates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

const PROVINCE_STORAGE_KEY = "selected_province_id";

interface UserLocationResult {
  lokasi: string;
  provinceId: string | null;
  provinceName: string | null;
  kabkota: string | null;
  loading: boolean;
  error: string | null;
  coords: { lat: number; lng: number } | null;
}

export function useUserLocation(): UserLocationResult {
  const [lokasi, setLokasi] = useState("Memuat...");
  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [provinceName, setProvinceName] = useState<string | null>(null);
  const [kabkota, setKabkota] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Cek dulu apakah sudah ada provinsi yang tersimpan
        const savedProvinceId =
          await AsyncStorage.getItem(PROVINCE_STORAGE_KEY);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Izin lokasi ditolak");
          // Pakai default Jakarta jika tidak ada izin dan tidak ada cache
          if (!savedProvinceId) {
            setProvinceId("11");
            setProvinceName("DKI Jakarta");
            setKabkota("Kota Jakarta");
            setLokasi("DKI Jakarta, Indonesia");
          }
          setLoading(false);
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        // Cari provinsi terdekat
        const nearestProvince = findNearestProvince(latitude, longitude);
        setProvinceId(nearestProvince.id);
        setProvinceName(nearestProvince.nama);
        setKabkota(nearestProvince.kabkota);

        // Simpan provinsi ke AsyncStorage
        await AsyncStorage.setItem(PROVINCE_STORAGE_KEY, nearestProvince.id);

        // Reverse geocode untuk nama lokasi yang lebih detail
        const alamat = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (alamat.length > 0) {
          const { city, subregion, country } = alamat[0];
          const locationName = city || subregion || nearestProvince.nama;
          setLokasi(`${locationName}, ${country || "Indonesia"}`);
        } else {
          setLokasi(`${nearestProvince.nama}, Indonesia`);
        }
      } catch (e) {
        setError("Gagal mengambil lokasi");
        // Fallback ke Jakarta
        setProvinceId("11");
        setProvinceName("DKI Jakarta");
        setKabkota("Kota Jakarta");
        setLokasi("DKI Jakarta, Indonesia");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { lokasi, provinceId, provinceName, kabkota, loading, error, coords };
}

// Helper untuk mengubah provinsi secara manual
export async function setSelectedProvince(provinceId: string): Promise<void> {
  await AsyncStorage.setItem(PROVINCE_STORAGE_KEY, provinceId);
}

// Helper untuk mengambil provinsi yang tersimpan
export async function getSelectedProvince(): Promise<string | null> {
  return await AsyncStorage.getItem(PROVINCE_STORAGE_KEY);
}
