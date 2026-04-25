import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";

function Gate() {
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) router.replace("/(auth)/login");
    if (user && inAuthGroup) router.replace("/");
  }, [user, initializing, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Gate />
      </FavoritesProvider>
    </AuthProvider>
  );
}