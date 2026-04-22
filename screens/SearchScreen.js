import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { XMarkIcon } from "react-native-heroicons/outline";

import { searchMovies, image500, fallbackMoviePoster } from "../api/moviedb";

const { width, height } = Dimensions.get("window");

const resolvePoster = (poster_path) => {
  if (!poster_path) return fallbackMoviePoster;
  const s = String(poster_path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return image500(s);
};

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // debounce typing
  useEffect(() => {
    let active = true;
    const q = query.trim();

    const t = setTimeout(async () => {
      if (!active) return;

      if (!q) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await searchMovies({ query: q, page: 1, include_adult: false, language: "en-US" });
      if (!active) return;

      setResults(data?.results || []);
      setLoading(false);
    }, 450);

    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query]);

  const count = results?.length || 0;

  return (
    <SafeAreaView style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Search bar */}
      <View style={s.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Movie"
          placeholderTextColor="#bdbdbd"
          style={s.input}
        />
        <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}>
          <XMarkIcon size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={s.emptyWrap}>
          <Text style={s.emptyText}>Searching…</Text>
        </View>
      ) : count > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 25 }}
        >
          <Text style={s.resultsTitle}>Results ({count})</Text>

          <View style={s.grid}>
            {results.map((item) => {
              const name = item?.title || item?.name || "Untitled";
              const uri = resolvePoster(item?.poster_path);

              return (
                <TouchableWithoutFeedback
                  key={String(item?.id)}
                  onPress={() =>
                    router.push({
                      pathname: "/movie",
                      params: { item: encodeURIComponent(JSON.stringify(item)) },
                    })
                  }
                >
                  <View style={s.card}>
                    <Image source={{ uri }} style={s.poster} resizeMode="cover" />
                    <Text style={s.movieName} numberOfLines={1}>
                      {name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={s.emptyWrap}>
          <Text style={s.emptyText}>
            {query.trim() ? "No results found" : "Type to search movies"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },

  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#525252",
    borderRadius: 999,
    paddingLeft: 14,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
    paddingRight: 10,
    fontWeight: "600",
  },
  closeBtn: {
    backgroundColor: "#525252",
    padding: 10,
    borderRadius: 999,
    margin: 6,
  },

  resultsTitle: { color: "#fff", fontWeight: "800", marginBottom: 12, marginLeft: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  card: { width: width * 0.44, marginBottom: 16 },
  poster: { width: "100%", height: height * 0.3, borderRadius: 22, backgroundColor: "#222" },
  movieName: { color: "#d4d4d4", marginTop: 8, marginLeft: 4, fontWeight: "600" },

  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#bdbdbd", fontSize: 16, fontWeight: "600" },
});