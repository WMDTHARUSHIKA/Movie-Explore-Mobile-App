import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>Profile</Text>
      <Text style={{ color: "#aaa", marginTop: 10 }}>Email: {user?.email}</Text>

      <Pressable
        onPress={logout}
        style={{ marginTop: 20, backgroundColor: "#fff", padding: 12, borderRadius: 10 }}
      >
        <Text style={{ fontWeight: "800" }}>Log out</Text>
      </Pressable>
    </View>
  );
}