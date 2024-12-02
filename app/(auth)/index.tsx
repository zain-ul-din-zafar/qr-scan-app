import { Input, Text, Button } from "@ui-kitten/components";
import { View, StyleSheet, StatusBar } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View>
        <Text>Login Screen</Text>

        <Input placeholder="email" />
        <Input placeholder="password" />

        <Button>Login</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center"
  }
});
