import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { image185, fallbackPersonImage } from "../api/moviedb"; // ✅ correct path

const resolveProfile = (profile_path) => {
  if (!profile_path) return fallbackPersonImage;
  const s = String(profile_path);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return image185(s);
};

export default function Cast({ cast = [] }) {
  const router = useRouter();
  if (!cast?.length) return null;

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Top Cast</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
      >
        {cast.map((person, idx) => {
          const uri = resolveProfile(person?.profile_path);

          return (
            <TouchableOpacity
              key={String(person?.id ?? idx)}
              style={s.card}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/person",
                  params: { id: String(person?.id) }, // ✅ PersonScreen will fetch by id
                })
              }
            >
              <View style={s.avatarWrap}>
                <Image source={{ uri }} style={s.avatar} />
              </View>

              <Text style={s.character} numberOfLines={1}>
                {person?.character || "Role"}
              </Text>
              <Text style={s.name} numberOfLines={1}>
                {person?.name || "Actor"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: 18, marginBottom: 10 },
  title: { color: "#fff", fontSize: 18, fontWeight: "800", marginHorizontal: 16 },

  card: { width: 90, marginRight: 14, alignItems: "center" },

  avatarWrap: {
    width: 78,
    height: 78,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: 78, height: 92, resizeMode: "cover" },

  character: { color: "#fff", fontSize: 12, fontWeight: "700", marginTop: 8 },
  name: { color: "#a3a3a3", fontSize: 12, fontWeight: "600", marginTop: 4 },
});