import { Button } from "@ui-kitten/components";
import { View, StyleSheet, StatusBar } from "react-native";

export default function HomeScreen() {
  return <View style={[styles.safeArea]}></View>;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white"
  }
});
