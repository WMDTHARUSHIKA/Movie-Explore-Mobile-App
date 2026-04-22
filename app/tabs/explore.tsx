import React from "react";
import { Image, Platform, StyleSheet } from "react-native";

import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.background,
        dark: Colors.dark.background,
      }}
      headerImage={
        <Image
          // ✅ Use relative path for assets (works best)
          source={require("../../assets/images/react-logo.png")}
          style={styles.reactLogo}
          resizeMode="contain"
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      <ThemedText type="default">
        This screen is just a template page. You can replace it with your own UI.
      </ThemedText>

      <Collapsible title="File-based routing">
        <ThemedText>
          Screens are created from files inside the <ThemedText type="link">app/</ThemedText> folder.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Platform info">
        <ThemedText>
          You are running on: <ThemedText type="subtitle">{Platform.OS}</ThemedText>
        </ThemedText>
      </Collapsible>

      <Collapsible title="External link">
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedView style={styles.linkRow}>
            <ThemedText type="link">Open React Native Images docs</ThemedText>
            <IconSymbol name="chevron.right" size={16} />
          </ThemedView>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
});