import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ChevronLeftIcon, TrashIcon } from "react-native-heroicons/outline";

import { useFavorites } from "../context/FavoritesContext";
import { image342, fallbackMoviePoster } from "../api/moviedb";

const resolvePoster = (poster_path) => {
  if (!poster_path) return fallbackMoviePoster;
  const s = String(poster_path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return image342(s);
};

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, ready, clearFavorites } = useFavorites();

  return (
    <SafeAreaView style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={24} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>

        <Text style={s.title}>Favorites</Text>

        <TouchableOpacity style={s.iconBtn} onPress={clearFavorites}>
          <TrashIcon size={22} strokeWidth={2.2} color="#fff" />
        </TouchableOpacity>
      </View>

      {!ready ? (
        <View style={s.empty}><Text style={s.emptyText}>Loading…</Text></View>
      ) : favorites.length === 0 ? (
        <View style={s.empty}><Text style={s.emptyText}>No favorites yet.</Text></View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => {
            const uri = resolvePoster(item?.poster_path);
            const name = item?.title || item?.name || "Movie";
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                style={s.card}
                onPress={() =>
                  router.push({
                    pathname: "/movie",
                    params: { item: encodeURIComponent(JSON.stringify(item)) },
                  })
                }
              >
                <Image source={{ uri }} style={s.poster} />
                <Text style={s.name} numberOfLines={1}>{name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#bdbdbd", fontSize: 16, fontWeight: "600" },
  card: { width: "48%", marginBottom: 16 },
  poster: { width: "100%", height: 240, borderRadius: 18, backgroundColor: "#222" },
  name: { color: "#d4d4d4", marginTop: 8, marginLeft: 4, fontWeight: "600" },
});