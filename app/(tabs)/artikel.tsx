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
      className="mx-4 mb-4 bg-white dark:bg-[#111827] rounded-xl overflow-hidden"
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
          <Text className="text-gray-400 dark:text-[#94a3b8] text-xs ml-auto">
            {formatDate(article.publishedAt)}
          </Text>
        </View>
        <Text className="font-semibold text-[#363636] dark:text-[#f8fafc] text-base mb-2">
          {article.title}
        </Text>
        <Text className="text-gray-500 dark:text-[#cbd5e1] text-sm leading-5" numberOfLines={2}>
          {article.description}
        </Text>
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#1f2937]">
          <Text className="text-gray-400 dark:text-[#94a3b8] text-xs">{article.source}</Text>
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
    <View className="border-b border-[#e5e5e5] dark:border-[#1f2937]">
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
                  : "text-gray-400 dark:text-[#94a3b8]"
              }`}
            >
              {item}
            </Text>
            {index < categories.length - 1 && (
              <Text className="text-gray-300 dark:text-[#94a3b8] mx-3">•</Text>
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

  const fetchArticles = useCallback(async (options?: { showLoader?: boolean }) => {
    const showLoader = options?.showLoader ?? true;
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError(null);

      // Try fetching from RSS2JSON API
      // You can replace this with any news API you prefer:
      // - NewsAPI.org: https://newsapi.org/v2/everything?q=islam&language=id&apiKey=YOUR_KEY
      // - GNews: https://gnews.io/api/v4/search?q=islam&lang=id&token=YOUR_KEY

      const response = await fetch(RSS_FEEDS[0].url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
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
        setError(null);
      } else {
        throw new Error("Data artikel tidak tersedia");
      }
    } catch {
      setError("Gagal memuat artikel. Coba lagi.");
      setArticles([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles({ showLoader: true });
  }, [fetchArticles]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArticles({ showLoader: false });
  }, [fetchArticles]);

  const handleArticlePress = (article: Article) => {
    // Open article in browser
    Linking.openURL(article.url).catch(() => {
      if (__DEV__) {
        console.log("Cannot open URL:", article.url);
      }
    });
  };

  const filteredArticles =
    selectedCategory === "Semua"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf5ea] dark:bg-[#0b1220]" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-[#e5e5e5] dark:border-[#1f2937]">
        <View className="flex-row items-center gap-2">
          <BookOpen size={28} color="#728d8d" />
          <Text className="font-bold text-2xl text-[#363636] dark:text-[#f8fafc]">Artikel</Text>
        </View>
        <Text className="text-gray-500 dark:text-[#cbd5e1] text-sm mt-1">
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
          <Text className="mt-2 text-gray-500 dark:text-[#cbd5e1]">Memuat artikel...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => fetchArticles({ showLoader: true })}
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
              <Text className="text-gray-500 dark:text-[#cbd5e1] mt-4 text-center">
                Tidak ada artikel untuk kategori ini
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
