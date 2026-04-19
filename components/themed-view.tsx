import React from "react";
import { View, type ViewProps, useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedViewProps) {
  const theme = useColorScheme() ?? "light";

  const backgroundColor =
    theme === "dark"
      ? darkColor ?? Colors.dark.background
      : lightColor ?? Colors.light.background;

  return <View {...rest} style={[{ backgroundColor }, style]} />;
}