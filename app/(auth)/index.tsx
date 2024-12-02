import React, { useEffect, useState } from "react";
import { Input, Text, Button, Icon } from "@ui-kitten/components";

import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSecureText, setShowSecureText] = useState(true);

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

  const renderInputIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={() => setShowSecureText((v) => !v)}>
      <Icon {...props} name={!showSecureText ? "eye" : "eye-off"} />
    </TouchableWithoutFeedback>
  );

  const { signIn, user } = useAuth();
  const navigator = useNavigation();

  useEffect(() => {
    if (user) {
      navigator.navigate("(tabs)" as never);
    }
  }, [user]);

  const handleLogin = async () => {
    if (validateInputs()) {
      setIsSubmitting(true);

      const { success, error } = await signIn(email, password);

      setIsSubmitting(false);
      if (!success) {
        alert(error);
      }
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
          Enter email & password to login
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
          secureTextEntry={showSecureText}
          style={styles.input}
          accessoryRight={renderInputIcon}
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
    width: 240,
    height: 200,
    resizeMode: "contain",
    marginBottom: 12
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
