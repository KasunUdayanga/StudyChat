import React, { useMemo, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

export default function ChatScreen({
  user,
  messages,
  onSend,
  refreshing,
  onLogout,
  errorMessage,
  onDismissError,
}) {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const listRef = useRef(null);

  const userId = user?.$id || "anonymous";

  // keep local list in sync and show optimistic sends
  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages]);

  const sortedMessages = useMemo(() => {
    return [...localMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [localMessages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMessage = {
      _id: `${Date.now()}`,
      text,
      createdAt: new Date(),
      user: {
        _id: userId,
        name: user?.name || "User",
      },
    };

    setLocalMessages((prev) => [newMessage, ...prev]);
    setInput("");
    onSend([newMessage]);
    // scroll to bottom (inverted list -> offset 0)
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader userName={user?.name} onLogout={onLogout} />

      {/* Status Indicators */}
      {errorMessage && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          {onDismissError && (
            <TouchableOpacity onPress={onDismissError}>
              <Text style={styles.errorClose}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#145ae6ff" />
          <Text style={styles.loadingText}>Loading messages…</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1 }}>
          <MessageList
            ref={listRef}
            messages={sortedMessages}
            userId={userId}
            onContentSizeChange={() =>
              requestAnimationFrame(() =>
                listRef.current?.scrollToOffset({ offset: 0, animated: true })
              )
            }
          />
        </View>
        <MessageInput
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

ChatScreen.propTypes = {
  user: PropTypes.shape({
    $id: PropTypes.string,
    name: PropTypes.string,
  }),
  messages: PropTypes.arrayOf(PropTypes.object),
  onSend: PropTypes.func,
  refreshing: PropTypes.bool,
  onLogout: PropTypes.func,
  errorMessage: PropTypes.string,
  onDismissError: PropTypes.func,
};

ChatScreen.defaultProps = {
  user: null,
  messages: [],
  onSend: () => {},
  refreshing: false,
  onLogout: () => {},
  errorMessage: null,
  onDismissError: null,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fb" },
  loadingOverlay: {
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: { color: "#555", fontWeight: "600" },
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
});
