import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";

import Cast from "../components/cast";
import Loading from "../components/Loading";
import { fetchMovieDetails, fetchMovieCredits, image780, fallbackMoviePoster } from "../api/moviedb";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

const { height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

const decodeParam = (v) => {
  if (v == null) return null;
  const raw = Array.isArray(v) ? v[0] : v;
  if (typeof raw !== "string") return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const fullUrlIfAny = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  const s = String(pathOrUrl);
  return s.startsWith("http://") || s.startsWith("https://") ? s : null;
};

export default function MovieScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const baseMovie = useMemo(() => {
    const rawItem = decodeParam(params.item);
    if (rawItem) {
      try {
        return JSON.parse(rawItem);
      } catch (e) {
        console.log("JSON parse error:", e);
      }
    }
    const idRaw = Array.isArray(params.id) ? params.id[0] : params.id;
    return { id: idRaw ? Number(idRaw) : undefined };
  }, [params]);

  const movieId = typeof baseMovie?.id === "number" ? baseMovie.id : undefined;

  const [details, setDetails] = useState(baseMovie || {});
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [d, c] = await Promise.all([
        fetchMovieDetails(movieId, { language: "en-US" }),
        fetchMovieCredits(movieId, { language: "en-US" }),
      ]);

      if (!mounted) return;

      setDetails(d && d.id ? d : baseMovie || {});
      setCast(Array.isArray(c?.cast) ? c.cast : []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [movieId, baseMovie]);

  // movie object to store in Firestore favorites
  const favMovie = useMemo(() => {
    if (!details?.id) return null;
    return {
      id: details.id,
      title: details.title,
      name: details.name,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      release_date: details.release_date,
      vote_average: details.vote_average,
    };
  }, [details]);

  const fav = details?.id ? isFavorite(details.id) : false;

  const onToggleFav = useCallback(async () => {
    if (!user) {
      router.push("/(auth)/login"); // change to "/auth/login" if your auth folder is app/auth
      return;
    }
    if (!favMovie) return;

    console.log("[Movie] toggling favorite:", favMovie.id);
    await toggleFavorite(favMovie);
  }, [user, favMovie, toggleFavorite, router]);

  const heroUri =
    fullUrlIfAny(details?.backdrop_path) ||
    (details?.backdrop_path ? image780(details.backdrop_path) : null) ||
    (details?.poster_path ? image780(details.poster_path) : null) ||
    fallbackMoviePoster;

  const title = details?.title || details?.name || "Movie";
  const overview = details?.overview || "No overview available.";

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={s.posterWrap}>
        <SafeAreaView style={[s.topBar, !ios && { paddingTop: 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onToggleFav} style={s.favBtn} activeOpacity={0.7} disabled={!favMovie}>
            <HeartIcon size={34} color={fav ? "#eab308" : "#fff"} />
          </TouchableOpacity>
        </SafeAreaView>

        <Image source={{ uri: heroUri }} style={s.poster} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.65)", "rgba(0,0,0,1)"]}
          style={s.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      <View style={s.detailsWrap}>
        <Text style={s.title} numberOfLines={2}>{title}</Text>
        <Text style={s.sectionTitle}>Overview</Text>
        <Text style={s.overview}>{overview}</Text>
        <Cast cast={cast} />
      </View>

      {loading && <Loading />}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  posterWrap: { width: "100%", height: height * 0.62, backgroundColor: "#111" },
  poster: { width: "100%", height: "100%" },
  topBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: { padding: 8, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.55)" },
  favBtn: { padding: 6, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.35)" },
  gradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: 160 },
  detailsWrap: { paddingHorizontal: 16, paddingTop: 14 },
  title: { color: "#fff", fontSize: 30, fontWeight: "800" },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 14 },
  overview: { color: "#bdbdbd", fontSize: 14, lineHeight: 21, marginTop: 8 },
});