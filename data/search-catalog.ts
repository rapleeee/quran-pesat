export interface SearchCatalogItem {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  keywords: string[];
  type: "feature";
}

export const searchCatalog: SearchCatalogItem[] = [
  {
    id: "feature-artikel",
    title: "Artikel Islam",
    subtitle: "Kumpulan artikel dan insight Islami",
    route: "/(tabs)/artikel",
    keywords: ["artikel", "berita", "islam", "konten"],
    type: "feature",
  },
  {
    id: "feature-doa",
    title: "Doa Harian",
    subtitle: "Kumpulan doa untuk aktivitas sehari-hari",
    route: "/doa",
    keywords: ["doa", "harian", "dzikir", "permohonan"],
    type: "feature",
  },
  {
    id: "feature-hadits",
    title: "Hadits",
    subtitle: "Riwayat hadits dan penjelasannya",
    route: "/hadits",
    keywords: ["hadits", "hadis", "riwayat", "sunnah"],
    type: "feature",
  },
  {
    id: "feature-dzikir",
    title: "Dzikir Duha",
    subtitle: "Dzikir harian (API) + kategori Dzikir Duha",
    route: "/dzikir",
    keywords: ["dzikir", "duha", "harian", "wirid", "tasbih"],
    type: "feature",
  },
  {
    id: "feature-asmaul-husna",
    title: "Asmaul Husna",
    subtitle: "99 nama Allah beserta arti",
    route: "/asmaul-husna",
    keywords: ["asmaul", "husna", "nama allah", "asma"],
    type: "feature",
  },
];
