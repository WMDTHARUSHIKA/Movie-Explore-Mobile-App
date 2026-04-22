import React from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import { image500, fallbackMoviePoster } from "../api/moviedb"; // ✅ correct path

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.62;
const ITEM_HEIGHT = height * 0.4;
const GAP = 14;

export default function TrendingMovies({ data = [] }) {
  const router = useRouter();
  if (!data?.length) return null;

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Trending</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        snapToInterval={ITEM_WIDTH + GAP}
        decelerationRate="fast"
        renderItem={({ item }) => {
          const uri = item?.poster_path ? image500(item.poster_path) : fallbackMoviePoster;

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ marginRight: GAP }}
              onPress={() =>
                router.push({
                  pathname: "/movie",
                  params: { item: encodeURIComponent(JSON.stringify(item)) },
                })
              }
            >
              <Image source={{ uri }} style={s.poster} resizeMode="cover" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 22 },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  poster: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 24,
    backgroundColor: "#222",
  },
});