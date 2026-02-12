export interface ProvinceCoordinate {
  id: string;
  nama: string;
  kabkota: string;
  lat: number;
  lng: number;
}

export const provincesCoordinates: ProvinceCoordinate[] = [
  {
    id: "1",
    nama: "Aceh",
    kabkota: "Kota Banda Aceh",
    lat: 4.695,
    lng: 96.749,
  },
  {
    id: "2",
    nama: "Sumatera Utara",
    kabkota: "Kota Medan",
    lat: 2.116,
    lng: 99.545,
  },
  {
    id: "3",
    nama: "Sumatera Barat",
    kabkota: "Kota Padang",
    lat: -0.739,
    lng: 100.8,
  },
  {
    id: "4",
    nama: "Riau",
    kabkota: "Kota Pekanbaru",
    lat: 0.293,
    lng: 101.706,
  },
  { id: "5", nama: "Jambi", kabkota: "Kota Jambi", lat: -1.61, lng: 103.613 },
  {
    id: "6",
    nama: "Sumatera Selatan",
    kabkota: "Kota Palembang",
    lat: -3.319,
    lng: 104.914,
  },
  {
    id: "7",
    nama: "Bengkulu",
    kabkota: "Kota Bengkulu",
    lat: -3.792,
    lng: 102.26,
  },
  {
    id: "8",
    nama: "Lampung",
    kabkota: "Kota Bandar Lampung",
    lat: -4.558,
    lng: 105.406,
  },
  {
    id: "9",
    nama: "Kepulauan Bangka Belitung",
    kabkota: "Kota Pangkal Pinang",
    lat: -2.741,
    lng: 106.44,
  },
  {
    id: "10",
    nama: "Kepulauan Riau",
    kabkota: "Kota Batam",
    lat: 3.945,
    lng: 108.142,
  },
  {
    id: "11",
    nama: "DKI Jakarta",
    kabkota: "Kota Jakarta",
    lat: -6.2,
    lng: 106.816,
  },
  {
    id: "12",
    nama: "Jawa Barat",
    kabkota: "Kota Bandung",
    lat: -6.903,
    lng: 107.618,
  },
  {
    id: "13",
    nama: "Jawa Tengah",
    kabkota: "Kota Semarang",
    lat: -7.15,
    lng: 110.14,
  },
  {
    id: "14",
    nama: "D.I. Yogyakarta",
    kabkota: "Kota Yogyakarta",
    lat: -7.797,
    lng: 110.37,
  },
  {
    id: "15",
    nama: "Jawa Timur",
    kabkota: "Kota Surabaya",
    lat: -7.25,
    lng: 112.75,
  },
  { id: "16", nama: "Banten", kabkota: "Kota Serang", lat: -6.12, lng: 106.15 },
  {
    id: "17",
    nama: "Bali",
    kabkota: "Kota Denpasar",
    lat: -8.34,
    lng: 115.092,
  },
  {
    id: "18",
    nama: "Nusa Tenggara Barat",
    kabkota: "Kota Mataram",
    lat: -8.65,
    lng: 117.361,
  },
  {
    id: "19",
    nama: "Nusa Tenggara Timur",
    kabkota: "Kota Kupang",
    lat: -8.657,
    lng: 121.079,
  },
  {
    id: "20",
    nama: "Kalimantan Barat",
    kabkota: "Kota Pontianak",
    lat: -0.278,
    lng: 111.475,
  },
  {
    id: "21",
    nama: "Kalimantan Tengah",
    kabkota: "Kota Palangkaraya",
    lat: -1.681,
    lng: 113.382,
  },
  {
    id: "22",
    nama: "Kalimantan Selatan",
    kabkota: "Kota Banjarmasin",
    lat: -3.092,
    lng: 115.283,
  },
  {
    id: "23",
    nama: "Kalimantan Timur",
    kabkota: "Kota Samarinda",
    lat: 1.693,
    lng: 116.419,
  },
  {
    id: "24",
    nama: "Kalimantan Utara",
    kabkota: "Kota Tarakan",
    lat: 3.073,
    lng: 116.041,
  },
  {
    id: "25",
    nama: "Sulawesi Utara",
    kabkota: "Kota Manado",
    lat: 0.625,
    lng: 123.975,
  },
  {
    id: "26",
    nama: "Sulawesi Tengah",
    kabkota: "Kota Palu",
    lat: -1.43,
    lng: 121.445,
  },
  {
    id: "27",
    nama: "Sulawesi Selatan",
    kabkota: "Kota Makassar",
    lat: -3.669,
    lng: 119.974,
  },
  {
    id: "28",
    nama: "Sulawesi Tenggara",
    kabkota: "Kota Kendari",
    lat: -4.145,
    lng: 122.174,
  },
  {
    id: "29",
    nama: "Gorontalo",
    kabkota: "Kota Gorontalo",
    lat: 0.696,
    lng: 122.446,
  },
  {
    id: "30",
    nama: "Sulawesi Barat",
    kabkota: "Kab. Mamuju",
    lat: -2.844,
    lng: 119.232,
  },
  {
    id: "31",
    nama: "Maluku",
    kabkota: "Kota Ambon",
    lat: -3.239,
    lng: 130.145,
  },
  {
    id: "32",
    nama: "Maluku Utara",
    kabkota: "Kota Ternate",
    lat: 1.57,
    lng: 127.808,
  },
  {
    id: "33",
    nama: "Papua",
    kabkota: "Kota Jayapura",
    lat: -4.269,
    lng: 138.08,
  },
  {
    id: "34",
    nama: "Papua Barat",
    kabkota: "Kab. Manokwari",
    lat: -1.336,
    lng: 133.174,
  },
];

// Fungsi hitung jarak menggunakan Haversine formula
export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Cari provinsi terdekat berdasarkan koordinat user
export function findNearestProvince(
  userLat: number,
  userLng: number,
): ProvinceCoordinate {
  let nearest = provincesCoordinates[0];
  let minDistance = Infinity;

  for (const province of provincesCoordinates) {
    const distance = getDistance(userLat, userLng, province.lat, province.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = province;
    }
  }

  return nearest;
}
