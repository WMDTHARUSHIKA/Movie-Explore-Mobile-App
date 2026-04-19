import React from "react";
import { View, Text, TouchableWithoutFeedback, Dimensions, Image, FlatList } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.62;

export default function TrendingMovies({ data = [] }) {
  const router = useRouter();

  const handleClick = (item, index) => {
    // Navigate only if you have a route like app/movie.js or app/movie.tsx
    // router.push({ pathname: "/movie", params: { item: JSON.stringify(item) } });

    // For now (no route yet), do nothing or create the /movie route.
  };

  if (!data?.length) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "white", fontSize: 20, marginHorizontal: 16, marginBottom: 12 }}>
        Trending
      </Text>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        snapToInterval={ITEM_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item, index }) => {
          const posterSource = item?.poster_path
            ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }
            : require("../assets/images/moviePoster1.png");

          return (
            <TouchableWithoutFeedback onPress={() => handleClick(item, index)}>
              <Image
                source={posterSource}
                style={{
                  width: ITEM_WIDTH,
                  height: height * 0.4,
                  borderRadius: 24,
                  marginRight: 16,
                }}
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          );
        }}
      />
    </View>
  );
}
