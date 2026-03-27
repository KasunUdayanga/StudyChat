import React from "react";
import PropTypes from "prop-types";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function MessageInput({ value, onChangeText, onSend }) {
  const disabled = !value.trim();

  return (
    <View style={styles.inputBar}>
      <TextInput
        style={styles.textInput}
        placeholder="Type a message..."
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        multiline
      />
      <TouchableOpacity
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={disabled}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

MessageInput.propTypes = {
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onSend: PropTypes.func,
};

MessageInput.defaultProps = {
  value: "",
  onChangeText: () => {},
  onSend: () => {},
};

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#111827",
    backgroundColor: "#0b1220",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  textInput: {
    flex: 1,
    maxHeight: 110,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
    color: "#e5e7eb",
    minHeight: 48,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#f43f5e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fb7185",
  },
  sendButtonDisabled: {
    backgroundColor: "#1f2937",
    borderColor: "#1f2937",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
