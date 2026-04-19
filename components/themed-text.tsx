import React from "react";
import { StyleSheet, Text, type TextProps, useColorScheme } from "react-native";
import { Colors, Fonts } from "@/constants/theme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const theme = useColorScheme() ?? "light";

  const color =
    theme === "dark"
      ? darkColor ?? Colors.dark.text
      : lightColor ?? Colors.light.text;

  return (
    <Text
      {...rest}
      style={[
        { color, fontFamily: Fonts?.sans },
        styles[type],
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  title: { fontSize: 32, fontWeight: "700", lineHeight: 38 },
  subtitle: { fontSize: 20, fontWeight: "600", lineHeight: 26 },
  link: { fontSize: 16, textDecorationLine: "underline" },
});