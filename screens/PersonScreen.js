import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

import {
  fetchPersonDetails,
  fetchPersonMovies,
  image500,
  fallbackPersonImage,
  image342,
  fallbackMoviePoster,
} from "../api/moviedb";

const ios = Platform.OS === "ios";

const resolveImg = (path, sizeFn, fallback) => {
  if (!path) return fallback;
  const s = String(path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return sizeFn(s);
};

export default function PersonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const personId = useMemo(() => {
    const raw = Array.isArray(params.id) ? params.id[0] : params.id;
    return raw ? Number(raw) : null;
  }, [params.id]);

  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!personId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [p, m] = await Promise.all([
        fetchPersonDetails(personId, { language: "en-US" }),
        fetchPersonMovies(personId, { language: "en-US" }),
      ]);

      if (!mounted) return;

      setPerson(p && p.id ? p : null);
      setMovies(m && Array.isArray(m.cast) ? m.cast : []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [personId]);

  const avatarUri = resolveImg(person?.profile_path, image500, fallbackPersonImage);

  return (
    <SafeAreaView style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["rgba(255,140,0,0.18)", "rgba(0,0,0,1)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[s.topBar, !ios && { paddingTop: 12 }]}>
        <TouchableOpacity style={s.roundBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={22} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>
        <Text style={s.topTitle} numberOfLines={1}>
          {person?.name || "Person"}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={s.center}>
          <View style={s.avatarRing}>
            <Image source={{ uri: avatarUri }} style={s.avatar} />
          </View>

          <Text style={s.name}>{person?.name || "—"}</Text>
          <Text style={s.place}>{person?.place_of_birth || "—"}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Biography</Text>
          <Text style={s.bio}>
            {person?.biography ? person.biography : "Biography not available."}
          </Text>
        </View>

        {!!movies.length && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Known For</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {movies.slice(0, 12).map((mv, idx) => {
                const posterUri = resolveImg(mv?.poster_path, image342, fallbackMoviePoster);
                return (
                  <TouchableOpacity
                    key={String(mv?.id ?? idx)}
                    activeOpacity={0.85}
                    style={s.movieCard}
                    onPress={() =>
                      router.push({
                        pathname: "/movie",
                        params: { item: encodeURIComponent(JSON.stringify(mv)) },
                      })
                    }
                  >
                    <Image source={{ uri: posterUri }} style={s.moviePoster} />
                    <Text style={s.movieName} numberOfLines={1}>
                      {mv?.title || mv?.name || "Movie"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {loading && (
          <Text style={{ color: "#bdbdbd", textAlign: "center", marginTop: 14 }}>
            Loading…
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  topBar: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 5,
  },
  roundBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  topTitle: { color: "#fff", fontWeight: "800", maxWidth: "70%" },

  center: { alignItems: "center", paddingHorizontal: 16, marginTop: 10 },
  avatarRing: {
    width: 170,
    height: 170,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: 156, height: 156, borderRadius: 999 },

  name: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 12 },
  place: { color: "#a3a3a3", fontSize: 13, marginTop: 6, fontWeight: "600" },

  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "800", marginBottom: 10 },
  bio: { color: "#a3a3a3", fontSize: 13.5, lineHeight: 20 },

  movieCard: { width: 120, marginRight: 12 },
  moviePoster: { width: 120, height: 180, borderRadius: 16, backgroundColor: "#222" },
  movieName: { color: "#d4d4d4", marginTop: 8, fontWeight: "600" },
});