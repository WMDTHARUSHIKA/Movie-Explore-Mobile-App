import React, { useEffect, useMemo, useState } from "react";
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

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

type MovieLike = {
  id?: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  original_language?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: { id: number; name: string }[];
};

const tmdbImage500 = (path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;

export default function MovieScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Movie is passed as JSON string: params.item
  const movie: MovieLike = useMemo(() => {
    try {
      return params.item ? (JSON.parse(String(params.item)) as MovieLike) : {};
    } catch {
      return {};
    }
  }, [params.item]);

  const [isFavourite, setIsFavourite] = useState(false);

  // Placeholder cast (replace later by API fetch using movie.id)
  const [cast, setCast] = useState<any[]>([
    { id: 1, name: "Actor 1", character: "Role 1" },
    { id: 2, name: "Actor 2", character: "Role 2" },
    { id: 3, name: "Actor 3", character: "Role 3" },
    { id: 4, name: "Actor 4", character: "Role 4" },
    { id: 5, name: "Actor 5", character: "Role 5" },
  ]);

  useEffect(() => {
    // later: fetch credits using movie.id
  }, [movie?.id]);

  const posterUri =
    tmdbImage500(movie?.poster_path) ||
    tmdbImage500(movie?.backdrop_path) ||
    (typeof params.poster === "string" ? String(params.poster) : null);

  const posterSource = posterUri
    ? { uri: posterUri }
    : require("../assets/images/moviePoster2.png");

  const title =
    movie?.title ||
    movie?.name ||
    (typeof params.title === "string" ? params.title : "Movie");

  const overview =
    movie?.overview ||
    (typeof params.overview === "string" ? params.overview : "") ||
    "No overview available.";

  const year = movie?.release_date ? String(movie.release_date).slice(0, 4) : "—";
  const lang = movie?.original_language ? String(movie.original_language).toUpperCase() : "—";
  const rating = typeof movie?.vote_average === "number" ? movie.vote_average.toFixed(1) : "—";
  const votes = typeof movie?.vote_count === "number" ? movie.vote_count : null;

  const genres =
    Array.isArray(movie?.genres) && movie.genres.length
      ? movie.genres.map((g) => g.name)
      : ["Action", "Thriller", "Comedy"]; // placeholder

  const goBack = () => {
    // Works in-app; if opened directly in web, go to home
    if (typeof router.canGoBack === "function" && router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: 22 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Poster */}
      <View style={s.posterWrap}>
        <SafeAreaView style={[s.topBar, !ios && { paddingTop: 12 }]}>
          <TouchableOpacity onPress={goBack} style={s.backBtn} activeOpacity={0.7}>
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsFavourite((v) => !v)}
            style={s.favBtn}
            activeOpacity={0.7}
          >
            <HeartIcon size={34} color={isFavourite ? "#eab308" : "#fff"} />
          </TouchableOpacity>
        </SafeAreaView>

        <Image source={posterSource} style={s.poster} resizeMode="cover" />

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

        <View style={s.genresRow}>
          {genres.map((g, idx) => (
            <Text key={`${g}-${idx}`} style={s.genreText}>
              {g}
              {idx !== genres.length - 1 ? " • " : ""}
            </Text>
          ))}
        </View>

        <Text style={s.sectionTitle}>Overview</Text>
        <Text style={s.overview}>{overview}</Text>

        {/* Extra Details box */}
        <Text style={[s.sectionTitle, { marginTop: 18 }]}>Details</Text>
        <View style={s.card}>
          <DetailRow label="Release Date" value={movie?.release_date} />
          <DetailRow label="Language" value={lang !== "—" ? lang : undefined} />
          <DetailRow label="Rating" value={rating !== "—" ? rating : undefined} />
          <DetailRow label="Movie ID" value={movie?.id != null ? String(movie.id) : undefined} />
        </View>

        {/* Cast */}
        <Cast cast={cast} />
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
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

  backBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  favBtn: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },

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