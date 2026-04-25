import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr("");
    setLoading(true);
    try {
      await register(email.trim(), password);
    } catch (e) {
      setErr(e?.message ?? "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#000", "#0b1220", "#000"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.container}>
        <Text style={s.title}>Create Account</Text>
        <Text style={s.sub}>Create an account to save favorites.</Text>

        <View style={s.card}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#7b7b7b"
            autoCapitalize="none"
            keyboardType="email-address"
            style={s.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password (min 6 chars)"
            placeholderTextColor="#7b7b7b"
            secureTextEntry
            style={s.input}
          />

          {!!err && <Text style={s.err}>{err}</Text>}

          <Pressable disabled={loading} onPress={onSubmit} style={({ pressed }) => [s.btn, pressed && { opacity: 0.8 }]}>
            <Text style={s.btnText}>{loading ? "Creating..." : "Register"}</Text>
          </Pressable>

          <Text style={s.footerText}>
            Already have an account?{" "}
            <Link href="/auth/login" style={s.link}>
              Login
            </Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 18 },
  title: { color: "#fff", fontSize: 34, fontWeight: "900" },
  sub: { color: "#bdbdbd", marginTop: 6, marginBottom: 18, fontWeight: "600" },
  card: { backgroundColor: "rgba(255,255,255,0.06)", padding: 16, borderRadius: 18 },
  input: { backgroundColor: "rgba(0,0,0,0.35)", color: "#fff", padding: 12, borderRadius: 12, marginBottom: 10 },
  err: { color: "#ff6b6b", marginBottom: 10, fontWeight: "700" },
  btn: { backgroundColor: "#fff", padding: 12, borderRadius: 12, alignItems: "center", marginTop: 4 },
  btnText: { fontWeight: "900" },
  footerText: { color: "#bdbdbd", marginTop: 14, fontWeight: "700" },
  link: { color: "#fff", fontWeight: "900" },
});