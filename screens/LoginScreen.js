import React from "react";
import { View, StyleSheet } from "react-native";
import AuthFormSwitcher from "../components/AuthFormSwitcher";

export default function LoginScreen({
  navigation,
  onLogin,
  errorMessage,
  onDismissError,
}) {
  return (
    <View style={styles.screen}>
      <AuthFormSwitcher
        initialMode="login"
        onLogin={onLogin}
        onRegister={(name, email, password) =>
          navigation.navigate("Register", { name, email, password })
        }
        errorMessage={errorMessage}
        onDismissError={onDismissError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
