import React from "react";
import { View, TextInput, TextInputProps, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemedTextInputProps extends TextInputProps {
  label: string;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedTextInput({
  label,
  lightColor,
  darkColor,
  style,
  ...otherProps
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={[{ color, borderBottomColor: color }, styles.input, style]}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    borderBottomWidth: 1,
    padding: 5
  }
});
