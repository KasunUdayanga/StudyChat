import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function AuthTextInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  placeholder,
  keyboardType,
  returnKeyType = "done",
  autoCapitalize = "none",
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor="#0d6efd"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: { marginBottom: 18 },
  inputLabel: { marginBottom: 6, color: "#1f2933", fontWeight: "700" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#d4d7dd",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f8f9fb",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#0d6efd",
    backgroundColor: "#fff",
    shadowColor: "#0d6efd",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
});
