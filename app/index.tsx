import React from "react";
import { Stack } from "expo-router";
import HomeScreen from "../screens/HomeScreen";

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </>
  );
}