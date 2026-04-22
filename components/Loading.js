import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

const { width, height } = Dimensions.get("window");

export default function Loading({
  size = 160,
  thickness = 12,
  color = "#eab308",
  overlayOpacity = 0.35,
}) {
  return (
    <View style={[s.overlay, { width, height, backgroundColor: `rgba(0,0,0,${overlayOpacity})` }]}>
      <Progress.CircleSnail thickness={thickness} size={size} color={color} />
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});