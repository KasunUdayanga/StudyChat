import React from "react";
import { View, StyleSheet } from "react-native";
import AuthFormSwitcher from "../components/AuthFormSwitcher";

export default function RegisterScreen({
  navigation,
  onRegister,
  errorMessage,
  onDismissError,
}) {
  return (
    <View style={styles.screen}>
      <AuthFormSwitcher
        initialMode="register"
        onLogin={(email, password) => navigation.navigate("Login", { email })}
        onRegister={async (name, email, password) => {
          await onRegister(name, email, password);
          navigation.popToTop();
        }}
        errorMessage={errorMessage}
        onDismissError={onDismissError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
