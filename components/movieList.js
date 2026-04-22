import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { image342, fallbackMoviePoster } from "../api/moviedb";

export default function MovieList({ title, data = [], type = "upcoming" }) {
  const router = useRouter();
  if (!data?.length) return null;

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>{title}</Text>

        {/* ✅ WORKING See All */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            router.push({
              pathname: "/see-all",
              params: { type, title },
            })
          }
        >
          <Text style={s.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
        {data.map((item, index) => {
          const name = item?.title || item?.name || "Untitled";
          const uri = item?.poster_path ? image342(item.poster_path) : fallbackMoviePoster;

          return (
            <TouchableOpacity
              key={String(item?.id ?? index)}
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
              <Text style={s.name} numberOfLines={1}>
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 22 },
  header: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },
  seeAll: { color: "#eab308", fontSize: 15, fontWeight: "700" },

  row: { paddingHorizontal: 16, paddingTop: 12 },
  card: { marginRight: 14, width: 120 },
  poster: { width: 120, height: 180, borderRadius: 18, backgroundColor: "#222" },
  name: { color: "#d4d4d4", marginTop: 8, marginLeft: 2, fontWeight: "600" },
});