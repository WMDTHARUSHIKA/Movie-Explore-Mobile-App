import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Details() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text>Details Screen</Text>

      <Pressable
        onPress={() => router.back()}
        style={{ padding: 12, backgroundColor: "black", borderRadius: 8 }}
      >
        <Text style={{ color: "white" }}>Back</Text>
      </Pressable>
    </View>
  );
}