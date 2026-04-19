import * as React from "react";
import { Platform, Text, type TextProps } from "react-native";

type IconSymbolProps = TextProps & {
  name: string;
  size?: number;
  color?: string;
};

/**
 * Simple cross-platform icon placeholder.
 * If you later install an icon library (expo/vector-icons, lucide-react-native, etc.)
 * you can swap the implementation while keeping the same API.
 */
export function IconSymbol({ name, size = 18, color, style, ...rest }: IconSymbolProps) {
  // Map a few common names to symbols (adjust if your app uses different names)
  const symbol = getSymbol(name);

  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: size,
          color,
          // makes iOS look a bit nicer for SF Symbols-like glyphs
          ...(Platform.OS === "ios" ? { fontWeight: "600" as const } : null),
        },
        style,
      ]}
    >
      {symbol}
    </Text>
  );
}

function getSymbol(name: string) {
  switch (name) {
    case "chevron.right":
    case "chevron-right":
      return "›";
    case "chevron.left":
    case "chevron-left":
      return "‹";
    case "xmark":
    case "close":
      return "×";
    case "link":
      return "🔗";
    case "info":
      return "ℹ";
    case "star":
      return "★";
    default:
      // fallback: show the name if no mapping exists
      return name;
  }
}