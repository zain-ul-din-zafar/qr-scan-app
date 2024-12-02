import React, { useState } from "react";
import { Input, Text, Button } from "@ui-kitten/components";
import { View, StyleSheet, StatusBar, Image, Alert } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = () => {
    if (validateInputs()) {
      setIsSubmitting(true);

      // Simulate an API call
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert("Login successful", `Welcome, ${email}!`);
      }, 2000);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.formContainer}>
        <Image
          source={require("@/assets/images/colored logo.png")}
          style={styles.logo}
        />
        <Text category="h5" style={styles.title}>
          Login Screen
        </Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          status={emailError ? "danger" : "basic"}
          caption={emailError ? emailError : ""}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          status={passwordError ? "danger" : "basic"}
          caption={passwordError ? passwordError : ""}
          secureTextEntry={true}
          style={styles.input}
        />

        <Button
          onPress={handleLogin}
          disabled={isSubmitting}
          style={styles.loginButton}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  formContainer: {
    width: "100%",
    alignItems: "center"
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20
  },
  title: {
    marginBottom: 20
  },
  input: {
    width: "100%",
    marginBottom: 10
  },
  loginButton: {
    marginTop: 20,
    width: "100%"
  }
});
