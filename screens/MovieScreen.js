// screens/MovieScreen.js (UPDATED - uses FavoritesContext, real-time favourites)
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
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return null;
};

export default function MovieScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { isFavorite, toggleFavorite } = useFavorites();

  // Base movie from params for quick render
  const baseMovie = useMemo(() => {
    const rawItem = decodeParam(params.item);
    if (rawItem) {
      try {
        return JSON.parse(rawItem);
      } catch {}
    }

    const idRaw = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = idRaw ? Number(idRaw) : undefined;

    return {
      id,
      title: decodeParam(params.title) || undefined,
      overview: decodeParam(params.overview) || undefined,
      poster_path: decodeParam(params.poster) || undefined,
      backdrop_path: decodeParam(params.backdrop) || undefined,
    };
  }, [params]);

  const movieId = typeof baseMovie?.id === "number" ? baseMovie.id : undefined;

  const [details, setDetails] = useState(baseMovie || {});
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch full movie details + credits
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

  const title = details?.title || details?.name || "Movie";
  const overview = details?.overview || "No overview available.";
  const year = details?.release_date ? String(details.release_date).slice(0, 4) : "—";
  const lang = details?.original_language ? String(details.original_language).toUpperCase() : "—";
  const rating = typeof details?.vote_average === "number" ? details.vote_average.toFixed(1) : "—";
  const votes = typeof details?.vote_count === "number" ? details.vote_count : null;

  const genres =
    Array.isArray(details?.genres) && details.genres.length
      ? details.genres.map((g) => g?.name).filter(Boolean)
      : [];

  // Hero image (supports full URL or TMDB relative path)
  const heroFull = fullUrlIfAny(details?.backdrop_path) || fullUrlIfAny(details?.poster_path);

  const heroUri =
    heroFull ||
    (details?.backdrop_path ? image780(details.backdrop_path) : null) ||
    (details?.poster_path ? image780(details.poster_path) : null) ||
    fallbackMoviePoster;

  const fav = details?.id ? isFavorite(details.id) : false;

  const onToggleFav = useCallback(() => {
    // If details not loaded yet, do nothing
    if (!details?.id) return;
    toggleFavorite(details); // ✅ updates favorites everywhere in real-time via context
  }, [details, toggleFavorite]);

  const goBack = () => {
    // Expo Router back; if no history, go home
    try {
      router.back();
    } catch {
      router.replace("/");
    }
  };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Poster */}
      <View style={s.posterWrap}>
        <SafeAreaView style={[s.topBar, !ios && { paddingTop: 12 }]}>
          <TouchableOpacity onPress={goBack} style={s.backBtn} activeOpacity={0.7}>
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onToggleFav} style={s.favBtn} activeOpacity={0.7}>
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

      {/* Details */}
      <View style={s.detailsWrap}>
        <Text style={s.title} numberOfLines={2}>
          {title}
        </Text>

        <Text style={s.metaText}>
          {year} • {lang} • ⭐ {rating}
          {votes != null ? ` (${votes})` : ""}
        </Text>

        {!!genres.length && (
          <View style={s.genresRow}>
            {genres.map((g, idx) => (
              <Text key={`${g}-${idx}`} style={s.genreText}>
                {g}
                {idx !== genres.length - 1 ? " • " : ""}
              </Text>
            ))}
          </View>
        )}

        <Text style={s.sectionTitle}>Overview</Text>
        <Text style={s.overview}>{overview}</Text>

        <Text style={[s.sectionTitle, { marginTop: 18 }]}>Details</Text>
        <View style={s.card}>
          <DetailRow label="Release Date" value={details?.release_date} />
          <DetailRow label="Language" value={lang !== "—" ? lang : undefined} />
          <DetailRow label="Rating" value={rating !== "—" ? rating : undefined} />
          <DetailRow label="Movie ID" value={details?.id != null ? String(details.id) : undefined} />
        </View>

        {/* Cast */}
        <Cast cast={cast} />
      </View>

      {loading && <Loading />}
    </ScrollView>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{String(value)}</Text>
    </View>
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
  metaText: { color: "#bdbdbd", marginTop: 8, fontSize: 13 },

  genresRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  genreText: { color: "#e5e5e5", fontSize: 13 },

  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 14 },
  overview: { color: "#bdbdbd", fontSize: 14, lineHeight: 21, marginTop: 8 },

  card: {
    marginTop: 10,
    backgroundColor: "#0b0b0b",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { color: "#9a9a9a", fontSize: 13 },
  rowValue: { color: "#fff", fontSize: 13, fontWeight: "600" },
});