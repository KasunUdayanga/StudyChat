import React, { forwardRef } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";

const MessageList = forwardRef(
  ({ messages, userId, onContentSizeChange }, ref) => {
    const renderMessage = ({ item }) => {
      const isMine = item?.user?._id === userId;
      return (
        <View
          style={[
            styles.messageRow,
            isMine ? styles.messageRowRight : styles.messageRowLeft,
          ]}
        >
          {!isMine && (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(item?.user?.name || "U").slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.bubble,
              isMine ? styles.bubbleRight : styles.bubbleLeft,
            ]}
          >
            <Text style={[styles.messageText, isMine && { color: "#fff" }]}>
              {item?.text}
            </Text>
            <Text style={styles.messageMeta}>
              {new Date(item?.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <FlatList
        ref={ref}
        data={messages}
        keyExtractor={(item) => `${item?._id}`}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        inverted
        showsVerticalScrollIndicator
        ListFooterComponent={<View style={{ height: 16 }} />}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        onContentSizeChange={onContentSizeChange}
      />
    );
  }
);

MessageList.displayName = "MessageList";

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: "#0b1220" },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 96,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  messageRowRight: {
    justifyContent: "flex-end",
  },
  messageRowLeft: {
    justifyContent: "flex-start",
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: { color: "#3730a3", fontWeight: "700" },
  bubble: {
    maxWidth: "82%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  bubbleRight: {
    backgroundColor: "#e01616de",
    borderColor: "#e01616de",
    marginLeft: 30,
  },
  bubbleLeft: {
    backgroundColor: "#145ae6ff",
    borderColor: "#145ae6ff",
    marginRight: 30,
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  messageMeta: {
    marginTop: 4,
    fontSize: 11,
    color: "#e5e7eb",
    textAlign: "right",
  },
});

export default MessageList;
