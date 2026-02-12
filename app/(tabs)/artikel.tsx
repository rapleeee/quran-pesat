import { BookOpen, ExternalLink, RefreshCw } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
}

// Using RSS2JSON API to fetch from Indonesian Islamic news RSS feeds
// Alternative APIs:
// - NewsAPI.org (requires API key, has Indonesian news)
// - GNews API (has Indonesian support)
// - RSS feeds: republika.co.id, nu.or.id, kemenag.go.id

const RSS_FEEDS = [
  {
    name: "Republika Islam",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://republika.co.id/rss/khazanah",
    category: "Islam",
  },
];

// Mock data as fallback when API fails
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Keutamaan Membaca Al-Quran di Bulan Ramadhan",
    description:
      "Membaca Al-Quran di bulan Ramadhan memiliki keutamaan yang berlipat ganda. Rasulullah SAW bersabda bahwa setiap huruf yang dibaca mendapat 10 kebaikan.",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400",
    source: "Republika",
    publishedAt: "2026-02-12",
    url: "https://republika.co.id",
    category: "Ramadhan",
  },
  {
    id: "2",
    title: "Tata Cara Sholat Tahajud yang Benar",
    description:
      "Sholat tahajud adalah sholat sunnah yang dikerjakan pada malam hari setelah tidur. Berikut panduan lengkap tata cara sholat tahajud.",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400",
    source: "NU Online",
    publishedAt: "2026-02-11",
    url: "https://nu.or.id",
    category: "Ibadah",
  },
  {
    id: "3",
    title: "Kisah Nabi Yusuf AS: Teladan Kesabaran",
    description:
      "Nabi Yusuf AS adalah contoh teladan dalam kesabaran menghadapi cobaan hidup. Dari dibuang ke sumur hingga menjadi menteri di Mesir.",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400",
    source: "Kemenag",
    publishedAt: "2026-02-10",
    url: "https://kemenag.go.id",
    category: "Kisah Nabi",
  },
  {
    id: "4",
    title: "Panduan Zakat Fitrah: Syarat dan Ketentuan",
    description:
      "Zakat fitrah wajib dikeluarkan sebelum sholat Idul Fitri. Ketahui syarat, ketentuan, dan cara menghitung zakat fitrah.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400",
    source: "Republika",
    publishedAt: "2026-02-09",
    url: "https://republika.co.id",
    category: "Zakat",
  },
  {
    id: "5",
    title: "Doa-doa Penting Sehari-hari untuk Muslim",
    description:
      "Kumpulan doa sehari-hari yang penting untuk diamalkan, mulai dari bangun tidur hingga hendak tidur kembali.",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400",
    source: "NU Online",
    publishedAt: "2026-02-08",
    url: "https://nu.or.id",
    category: "Doa",
  },
  {
    id: "6",
    title: "Tafsir Surah Al-Fatihah: Makna dan Kandungan",
    description:
      "Al-Fatihah adalah surah pembuka Al-Quran yang wajib dibaca dalam setiap rakaat sholat. Pelajari tafsir dan makna mendalam surah ini.",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400",
    source: "Kemenag",
    publishedAt: "2026-02-07",
    url: "https://kemenag.go.id",
    category: "Tafsir",
  },
];

const categories = [
  "Semua",
  "Islam",
  "Ramadhan",
  "Ibadah",
  "Kisah Nabi",
  "Tafsir",
  "Doa",
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ArticleCard({
  article,
  onPress,
}: {
  article: Article;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-4 mb-4 bg-white rounded-xl overflow-hidden"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: article.image }}
        className="w-full h-40"
        resizeMode="cover"
        fadeDuration={300}
      />
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <View className="bg-[#728d8d]/20 px-2 py-1 rounded">
            <Text className="text-[#728d8d] text-xs font-medium">
              {article.category}
            </Text>
          </View>
          <Text className="text-gray-400 text-xs ml-auto">
            {formatDate(article.publishedAt)}
          </Text>
        </View>
        <Text className="font-semibold text-[#363636] text-base mb-2">
          {article.title}
        </Text>
        <Text className="text-gray-500 text-sm leading-5" numberOfLines={2}>
          {article.description}
        </Text>
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <Text className="text-gray-400 text-xs">{article.source}</Text>
          <View className="flex-row items-center">
            <Text className="text-[#728d8d] text-xs mr-1">
              Baca Selengkapnya
            </Text>
            <ExternalLink size={12} color="#728d8d" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <View className="border-b border-[#e5e5e5]">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="py-3"
      >
        {categories.map((item, index) => (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(item)}
            className="flex-row items-center"
          >
            <Text
              className={`text-sm ${
                selected === item
                  ? "text-[#728d8d] font-semibold"
                  : "text-gray-400"
              }`}
            >
              {item}
            </Text>
            {index < categories.length - 1 && (
              <Text className="text-gray-300 mx-3">•</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function Artikel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setError(null);

      // Try fetching from RSS2JSON API
      // You can replace this with any news API you prefer:
      // - NewsAPI.org: https://newsapi.org/v2/everything?q=islam&language=id&apiKey=YOUR_KEY
      // - GNews: https://gnews.io/api/v4/search?q=islam&lang=id&token=YOUR_KEY

      const response = await fetch(RSS_FEEDS[0].url);
      const data = await response.json();

      if (data.status === "ok" && data.items) {
        const fetchedArticles: Article[] = data.items
          .slice(0, 10)
          .map((item: any, index: number) => ({
            id: index.toString(),
            title: item.title,
            description:
              item.description?.replace(/<[^>]*>/g, "").slice(0, 150) + "..." ||
              "",
            image:
              item.thumbnail ||
              item.enclosure?.link ||
              "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400",
            source: item.author || "Republika",
            publishedAt: item.pubDate,
            url: item.link,
            category: "Islam",
          }));
        setArticles(fetchedArticles);
      } else {
        // Fallback to mock data
        setArticles(mockArticles);
      }
    } catch (err) {
      console.log("Using mock data due to fetch error");
      setArticles(mockArticles);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArticles();
  }, [fetchArticles]);

  const handleArticlePress = (article: Article) => {
    // Open article in browser
    Linking.openURL(article.url).catch(() => {
      // If can't open URL, just log
      console.log("Cannot open URL:", article.url);
    });
  };

  const filteredArticles =
    selectedCategory === "Semua"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea]" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-[#e5e5e5]">
        <View className="flex-row items-center gap-2">
          <BookOpen size={28} color="#728d8d" />
          <Text className="font-bold text-2xl text-[#363636]">Artikel</Text>
        </View>
        <Text className="text-gray-500 text-sm mt-1">
          Berita dan artikel Islami terkini
        </Text>
      </View>

      {/* Category Filter */}
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#728d8d" />
          <Text className="mt-2 text-gray-500">Memuat artikel...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={fetchArticles}
            className="flex-row items-center bg-[#728d8d] px-4 py-2 rounded-lg"
          >
            <RefreshCw size={16} color="#fff" />
            <Text className="text-white ml-2">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              onPress={() => handleArticlePress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#728d8d"]}
              tintColor="#728d8d"
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-10 px-4">
              <BookOpen size={64} color="#9ca3af" />
              <Text className="text-gray-500 mt-4 text-center">
                Tidak ada artikel untuk kategori ini
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
