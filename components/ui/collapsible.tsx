import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  containerStyle?: ViewStyle;
};

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  containerStyle,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  const caret = useMemo(() => (open ? "▼" : "▶"), [open]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.header}>
        <Text style={styles.caret}>{caret}</Text>
        <Text style={styles.title}>{title}</Text>
      </Pressable>

      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  caret: {
    width: 18,
    textAlign: "center",
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  body: {
    paddingLeft: 26,
  },
});