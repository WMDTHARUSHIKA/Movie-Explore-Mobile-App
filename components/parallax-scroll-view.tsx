import * as React from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { Colors } from "@/constants/theme";

type Props = React.ComponentProps<typeof ScrollView> & {
  headerImage?: React.ReactNode;
  headerBackgroundColor?: { light: string; dark: string };
};

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  contentContainerStyle,
  ...rest
}: Props) {
  const theme = useColorScheme() ?? "light";

  const backgroundColor =
    theme === "dark"
      ? headerBackgroundColor?.dark ?? Colors.dark.background
      : headerBackgroundColor?.light ?? Colors.light.background;

  return (
    <ScrollView
      {...rest}
      contentContainerStyle={[styles.content, contentContainerStyle]}
    >
      {headerImage ? (
        <View style={[styles.header, { backgroundColor }]}>{headerImage}</View>
      ) : null}

      <View style={styles.body}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  header: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
});