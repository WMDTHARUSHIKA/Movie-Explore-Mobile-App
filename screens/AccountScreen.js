import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import {
  ChevronLeftIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "react-native-heroicons/outline";

import { useAuth } from "../context/AuthContext";

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={24} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>

        <Text style={s.title}>Account</Text>

        <View style={{ width: 40 }} />
      </View>

      <View style={s.card}>
        <Text style={s.label}>Signed in as</Text>
        <Text style={s.email} numberOfLines={1}>
          {user?.email ?? "—"}
        </Text>
      </View>

      <TouchableOpacity style={s.row} onPress={() => router.push("/favorites")}>
        <HeartIcon size={22} color="#fff" />
        <Text style={s.rowText}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.row} onPress={() => router.push("/profile")}>
        <Cog6ToothIcon size={22} color="#fff" />
        <Text style={s.rowText}>Profile / Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[s.row, { borderColor: "rgba(255,255,255,0.12)" }]} onPress={logout}>
        <ArrowRightOnRectangleIcon size={22} color="#fff" />
        <Text style={s.rowText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 16 },
  header: {
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

  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginTop: 8,
    marginBottom: 16,
  },
  label: { color: "#aaa", fontWeight: "700" },
  email: { color: "#fff", marginTop: 6, fontSize: 16, fontWeight: "800" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },
  rowText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});