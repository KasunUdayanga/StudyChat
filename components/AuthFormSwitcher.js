import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import PropTypes from "prop-types";
import AuthTextInput from "./AuthTextInput";
import PrimaryButton from "./PrimaryButton";

export default function AuthFormSwitcher({
  initialMode,
  onLogin,
  onRegister,
  errorMessage,
  onDismissError,
}) {
  const [mode, setMode] = useState(
    initialMode === "register" ? "register" : "login"
  );
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const progress = useRef(
    new Animated.Value(mode === "register" ? 1 : 0)
  ).current;

  const switchTo = (target) => {
    setMode(target);
    Animated.timing(progress, {
      toValue: target === "register" ? 1 : 0,
      duration: 380,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const loginStyle = useMemo(
    () => ({
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50],
          }),
        },
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.95],
          }),
        },
      ],
      pointerEvents: mode === "login" ? "auto" : "none",
    }),
    [mode, progress]
  );

  const registerStyle = useMemo(
    () => ({
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
      pointerEvents: mode === "register" ? "auto" : "none",
    }),
    [mode, progress]
  );

  const handleLoginPress = async () => {
    if (!onLogin) return;
    setSubmitting(true);
    try {
      await onLogin(loginEmail, loginPassword);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterPress = async () => {
    if (!onRegister) return;
    setSubmitting(true);
    try {
      await onRegister(regName, regEmail, regPassword);
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
            {mode === "login"
              ? "Sign in to continue the conversation."
              : "Create your account to join the chat."}
          </Text>

          <View style={styles.switcherRow}>
            <TouchableOpacity
              style={[styles.toggle, mode === "login" && styles.toggleActive]}
              onPress={() => switchTo("login")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "login" && styles.toggleTextActive,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggle,
                mode === "register" && styles.toggleActive,
              ]}
              onPress={() => switchTo("register")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "register" && styles.toggleTextActive,
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stack}>
            <Animated.View
              style={[styles.card, styles.cardAbsolute, loginStyle]}
            >
              <Text style={styles.title}>Welcome back</Text>
              <AuthTextInput
                label="Email"
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                placeholder="you@example.com"
                returnKeyType="next"
              />
              <AuthTextInput
                label="Password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                placeholder="••••••••"
              />
              <PrimaryButton
                title={
                  submitting && mode === "login" ? "Signing in..." : "Sign in"
                }
                onPress={handleLoginPress}
                disabled={!loginEmail || !loginPassword || submitting}
                loading={submitting && mode === "login"}
              />
            </Animated.View>

            <Animated.View
              style={[styles.card, styles.cardAbsolute, registerStyle]}
            >
              <Text style={styles.title}>Create account</Text>
              <AuthTextInput
                label="Name"
                value={regName}
                onChangeText={setRegName}
                placeholder="Jane Doe"
                autoCapitalize="words"
              />
              <AuthTextInput
                label="Email"
                value={regEmail}
                onChangeText={setRegEmail}
                keyboardType="email-address"
                placeholder="you@example.com"
                returnKeyType="next"
              />
              <AuthTextInput
                label="Password"
                value={regPassword}
                onChangeText={setRegPassword}
                secureTextEntry
                placeholder="Create a strong password"
              />
              <PrimaryButton
                title={
                  submitting && mode === "register"
                    ? "Creating..."
                    : "Create account"
                }
                onPress={handleRegisterPress}
                disabled={!regName || !regEmail || !regPassword || submitting}
                loading={submitting && mode === "register"}
              />
            </Animated.View>
          </View>

          <Text style={styles.footerText}>
            {mode === "login"
              ? "By continuing you agree to our Terms of Service and Privacy Policy."
              : "Strong passwords help keep your account safe. Use at least 8 characters with letters and numbers."}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

AuthFormSwitcher.propTypes = {
  initialMode: PropTypes.oneOf(["login", "register"]),
  onLogin: PropTypes.func,
  onRegister: PropTypes.func,
  errorMessage: PropTypes.string,
  onDismissError: PropTypes.func,
};

AuthFormSwitcher.defaultProps = {
  initialMode: "login",
  onLogin: null,
  onRegister: null,
  errorMessage: null,
  onDismissError: null,
};

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
  subtitle: {
    fontSize: 16,
    color: "#4a5568",
    marginBottom: 18,
    textAlign: "center",
  },
  switcherRow: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  toggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  toggleActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleText: {
    color: "#6b7280",
    fontWeight: "700",
  },
  toggleTextActive: {
    color: "#0d6efd",
  },
  stack: {
    position: "relative",
    minHeight: 440,
    paddingVertical: 6,
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
  cardAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    color: "#1f2933",
  },
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
