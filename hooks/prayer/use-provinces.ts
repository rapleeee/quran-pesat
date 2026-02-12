import { useEffect, useState } from "react";

interface Provinsi {
  id: string;
  nama: string;
}

export function useProvinces() {
  const [provinces, setProvinces] = useState<Provinsi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://equran.id/api/v2/shalat/provinsi",
        );
        const data = await response.json();
        setProvinces(data.data);
      } catch (e) {
        setError("Gagal mengambil daftar provinsi");
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return { provinces, loading, error };
}
