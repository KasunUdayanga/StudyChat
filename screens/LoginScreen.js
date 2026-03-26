import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Image,
} from "react-native";
import AuthTextInput from "../components/AuthTextInput";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginScreen({
  navigation,
  onLogin,
  errorMessage,
  onDismissError,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLoginPress = async () => {
    setSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      // onLogin already surfaces the error via banner/alert in App
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      {errorMessage ? (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          {onDismissError && (
            <TouchableOpacity onPress={onDismissError}>
              <Text style={styles.errorClose}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrap}>
            <Image
              source={require("../assets/turquoise black minimalist chat book logo design (1).png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>
            Sign in to continue the conversation.
          </Text>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome</Text>
            <AuthTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="you@example.com"
              returnKeyType="next"
            />
            <AuthTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />
            <PrimaryButton
              title={submitting ? "Signing in..." : "Sign in"}
              onPress={handleLoginPress}
              disabled={!email || !password}
              loading={submitting}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.linkWrapper}
            >
              <Text style={styles.linkText}>Need an account? Create one</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            By continuing you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f5f9",
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0d6efd",
    letterSpacing: 0.5,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4a5568",
    marginBottom: 18,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    color: "#1f2933",
  },
  linkWrapper: { marginTop: 18, alignItems: "center" },
  linkText: { color: "#a61e1eff", fontWeight: "700" },
  footerText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
    fontSize: 13,
    lineHeight: 18,
  },
  errorBar: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: { color: "#b91c1c", flex: 1, paddingRight: 12 },
  errorClose: { color: "#b91c1c", fontWeight: "700" },
  logoWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 80,
    borderColor: "#3f3d3dff",
  },
});
