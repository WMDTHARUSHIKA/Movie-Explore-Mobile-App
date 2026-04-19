import * as React from "react";
import { Linking, Pressable, type PressableProps } from "react-native";

type ExternalLinkProps = PressableProps & {
  href: string;
  children: React.ReactNode;
};

export function ExternalLink({ href, children, onPress, ...props }: ExternalLinkProps) {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        onPress?.(e);
        Linking.openURL(href);
      }}
    >
      {children}
    </Pressable>
  );
}