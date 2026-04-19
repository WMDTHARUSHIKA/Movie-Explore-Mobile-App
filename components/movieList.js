import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

import { styles } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function MovieList({ title, data = [] }) {
  const router = useRouter();

  if (!data?.length) return null;

  return (
    <View className="mb-8 space-y-4">
      {/* header */}
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-xl">{title}</Text>

        <TouchableOpacity>
          <Text style={styles.text} className="text-lg">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* movie row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => {
          const movieName = item?.title || item?.name || 'Untitled';

          const posterSource = item?.poster_path
            ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }
            : require('../assets/images/moviePoster2.png');

          return (
            <TouchableWithoutFeedback
              key={String(item?.id ?? index)}
              onPress={() => {
                // Works only if you create a route like app/movie.js
                // router.push({ pathname: "/movie", params: { item: JSON.stringify(item) } });

                // For now do nothing to avoid navigation errors
              }}
            >
              <View className="space-y-1 mr-4">
                <Image
                  source={posterSource}
                  className="rounded-3xl"
                  style={{ width: width * 0.33, height: height * 0.22 }}
                  resizeMode="cover"
                />
                <Text className="text-neutral-300 ml-1">
                  {movieName.length > 14 ? movieName.slice(0, 14) + '...' : movieName}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}