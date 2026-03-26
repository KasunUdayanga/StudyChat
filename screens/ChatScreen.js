import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default function ChatScreen({
  user,
  messages,
  onSend,
  refreshing,
  onLogout,
  errorMessage,
  onDismissError,
}) {
  return (
    <View style={styles.container}>
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
      {refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.loadingText}>Loading messages…</Text>
        </View>
      )}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user?.$id,
          name: user?.name,
        }}
        placeholder="Type a message"
        alwaysShowSend
        scrollToBottom
      />
      <View style={styles.logoutBar}>
        <Text style={styles.loggedInText}>
          Logged in as {user?.name || "You"}
        </Text>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingOverlay: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: { marginTop: 8, color: "#555" },
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
  logoutBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  loggedInText: { color: "#333" },
  logoutText: { color: "#d00", fontWeight: "700" },
});
