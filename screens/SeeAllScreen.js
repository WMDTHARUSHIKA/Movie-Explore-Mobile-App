import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

import Loading from "../components/Loading";
import {
  fetchTrendingMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
  image342,
  fallbackMoviePoster,
} from "../api/moviedb";

const { width, height } = Dimensions.get("window");

const resolvePoster = (poster_path) => {
  if (!poster_path) return fallbackMoviePoster;
  const s = String(poster_path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return image342(s);
};

export default function SeeAllScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const type = useMemo(() => {
    const raw = Array.isArray(params.type) ? params.type[0] : params.type;
    return (raw || "upcoming").toString();
  }, [params.type]);

  const title = useMemo(() => {
    const raw = Array.isArray(params.title) ? params.title[0] : params.title;
    if (raw) return raw.toString();
    if (type === "trending") return "Trending";
    if (type === "topRated") return "Top Rated";
    return "Upcoming";
  }, [params.title, type]);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      const map = {
        trending: fetchTrendingMovies,
        upcoming: fetchUpcomingMovies,
        topRated: fetchTopRatedMovies,
      };

      const fetcher = map[type] || fetchUpcomingMovies;
      const data = await fetcher({ language: "en-US", page: 1 });

      if (!mounted) return;

      setMovies(data?.results || []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [type]);

  return (
    <SafeAreaView style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={24} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Grid */}
      <FlatList
        data={movies}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => {
          const name = item?.title || item?.name || "Untitled";
          const uri = resolvePoster(item?.poster_path);

          return (
            <TouchableOpacity
              style={s.card}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/movie",
                  params: { item: encodeURIComponent(JSON.stringify(item)) },
                })
              }
            >
              <Image source={{ uri }} style={s.poster} />
              <Text style={s.name} numberOfLines={1}>
                {name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {loading && <Loading />}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800", maxWidth: "70%" },

  card: { width: width * 0.44, marginBottom: 16 },
  poster: {
    width: "100%",
    height: height * 0.3,
    borderRadius: 18,
    backgroundColor: "#222",
  },
  name: { color: "#d4d4d4", marginTop: 8, marginLeft: 4, fontWeight: "600" },
});