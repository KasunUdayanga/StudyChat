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
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { storage, ID, bucketId, Permission, Role } from "../appwrite";

export default function ChatScreen({
  user,
  messages,
  onSend,
  refreshing,
  onLogout,
  errorMessage,
  onDismissError,
  onDelete,
  navigation,
  route,
}) {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const listRef = useRef(null);

  const userId = user?.$id || "anonymous";
  const targetUser = route?.params?.privateUser;
  const isPrivate = Boolean(targetUser);

  // keep local list in sync and show optimistic sends
  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages]);

  const sortedMessages = useMemo(() => {
    return [...localMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [localMessages]);

  const displayMessages = useMemo(() => {
    if (!isPrivate) {
      return sortedMessages.filter(
        (m) => !m.receiverId || m.receiverId === "group_chat"
      );
    }

    return sortedMessages.filter((m) => {
      const senderId = m?.user?._id;
      const receiverId = m?.receiverId;
      const isOutgoing = senderId === userId && receiverId === targetUser?.id;
      const isIncoming = senderId === targetUser?.id && receiverId === userId;
      return isOutgoing || isIncoming;
    });
  }, [isPrivate, sortedMessages, targetUser, userId]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const receiverId = isPrivate ? targetUser?.id : "group_chat";

    const newMessage = {
      _id: `${Date.now()}`,
      text,
      receiverId,
      createdAt: new Date(),
      messageType: "text",
      user: {
        _id: userId,
        name: user?.name || "User",
      },
    };

    setLocalMessages((prev) => [newMessage, ...prev]);
    setInput("");
    onSend([newMessage], receiverId);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  };

  const handleAttach = async () => {
    if (!bucketId) {
      alert("Image upload is not configured. Missing bucket ID.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission is required to access photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const receiverId = isPrivate ? targetUser?.id : "group_chat";

    const optimisticMessage = {
      _id: `${Date.now()}`,
      text: "",
      imageUrl: asset.uri,
      receiverId,
      messageType: "image",
      createdAt: new Date(),
      user: { _id: userId, name: user?.name || "You" },
      pending: true,
    };

    setLocalMessages((prev) => [optimisticMessage, ...prev]);

    try {
      const fileId = ID.unique();
      let filePayload;
      const filename = `image-${fileId}.jpg`;

      if (Platform.OS === "web") {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        filePayload = new File([blob], filename, {
          type: blob.type || asset.mimeType || "image/jpeg",
        });
      } else {
        filePayload = {
          uri: asset.uri,
          name: filename,
          type: asset.mimeType || "image/jpeg",
        };
      }

      await storage.createFile(bucketId, fileId, filePayload, [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
      ]);

      // storage.getFileView may return binary data in the SDK; on web we must
      // convert it to an object URL that <Image> can load.
      let imageUrl = null;
      try {
        const fileViewResult = await storage.getFileView(bucketId, fileId);
        if (Platform.OS === "web") {
          // result is an ArrayBuffer — create a blob URL
          const buf = fileViewResult;
          const blob = new Blob([buf], { type: "image/jpeg" });
          imageUrl = URL.createObjectURL(blob);
        } else {
          // Native SDK may return a URL or binary; try to handle common cases
          if (typeof fileViewResult === "string") {
            imageUrl = fileViewResult;
          } else if (fileViewResult instanceof ArrayBuffer) {
            // fallback for native if it returns ArrayBuffer
            const blob = new Blob([fileViewResult], { type: "image/jpeg" });
            imageUrl = URL.createObjectURL(blob);
          } else {
            imageUrl = fileViewResult;
          }
        }
      } catch (err) {
        console.warn("getFileView failed", err?.message || err);
        imageUrl = null;
      }

      const sentMessage = {
        ...optimisticMessage,
        _id: fileId,
        imageUrl,
        fileId,
        pending: false,
      };

      setLocalMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== optimisticMessage._id);
        return [sentMessage, ...filtered];
      });

      onSend([sentMessage], receiverId);
    } catch (error) {
      setLocalMessages((prev) =>
        prev.filter((m) => m._id !== optimisticMessage._id)
      );
      alert("Failed to upload image. Please try again.");
      console.error("Image upload failed", error);
    }
  };

  const handleDelete = (message) => {
    const messageId = message?._id;
    setLocalMessages((prev) => prev.filter((m) => m._id !== messageId));
    if (onDelete && messageId) {
      onDelete(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        userName={user?.name}
        onLogout={onLogout}
        onOpenMembers={() => navigation?.navigate("Members")}
        conversationLabel={
          isPrivate ? `Private ${targetUser?.name}` : "StudyChat"
        }
        onClearPrivate={
          isPrivate ? () => navigation?.setParams({ privateUser: null }) : null
        }
      />

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
            messages={displayMessages}
            userId={userId}
            onDelete={handleDelete}
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
          onAttach={handleAttach}
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
  onDelete: PropTypes.func,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

ChatScreen.defaultProps = {
  user: null,
  messages: [],
  onSend: () => {},
  refreshing: false,
  onLogout: () => {},
  errorMessage: null,
  onDismissError: null,
  onDelete: null,
  navigation: null,
  route: null,
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
