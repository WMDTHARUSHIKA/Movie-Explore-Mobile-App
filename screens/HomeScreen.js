// screens/HomeScreen.js
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Platform, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MagnifyingGlassIcon, UserCircleIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";

import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import Loading from "../components/Loading";

import { fetchTrendingMovies, fetchUpcomingMovies, fetchTopRatedMovies } from "../api/moviedb";

const ios = Platform.OS === "ios";

export default function HomeScreen() {
  const router = useRouter();

  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const params = { language: "en-US", page: 1 };

      const [t, u, r] = await Promise.all([
        fetchTrendingMovies(params),
        fetchUpcomingMovies(params),
        fetchTopRatedMovies(params),
      ]);

      if (!mounted) return;

      setTrending(t?.results || []);
      setUpcoming(u?.results || []);
      setTopRated(r?.results || []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const searchSeedMovies = useMemo(
    () => [...trending, ...upcoming, ...topRated].filter(Boolean),
    [trending, upcoming, topRated]
  );

  return (
    <View style={s.container}>
      <SafeAreaView style={[s.safeArea, ios ? { marginBottom: -8 } : { marginBottom: 12 }]}>
        <StatusBar style="light" />

        <View style={s.header}>
          {/* ✅ Account icon -> Account page */}
          <TouchableOpacity
            style={s.headerIconBtn}
            activeOpacity={0.7}
            onPress={() => router.push("/account")}
          >
            <UserCircleIcon size={34} strokeWidth={2} color="#fff" />
          </TouchableOpacity>

          <Text style={s.logo}>Movies</Text>

          {/* ✅ Search icon -> Search page */}
          <TouchableOpacity
            style={s.headerIconBtn}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/search",
                params: {
                  seed: encodeURIComponent(JSON.stringify(searchSeedMovies.slice(0, 20))),
                },
              })
            }
          >
            <MagnifyingGlassIcon size={28} strokeWidth={2} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
        <TrendingMovies data={trending} />
        <MovieList title="Upcoming" data={upcoming} type="upcoming" />
        <MovieList title="Top Rated" data={topRated} type="topRated" />
      </ScrollView>

      {loading && <Loading />}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { backgroundColor: "#000" },

  header: {
    marginHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { color: "#fff", fontSize: 28, fontWeight: "800" },
  headerIconBtn: { padding: 6 },
});