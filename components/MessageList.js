import React, { forwardRef, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import ImagePreviewModal from "./ImagePreviewModal";

const MessageList = forwardRef(
  ({ messages, userId, onContentSizeChange, onDelete }, ref) => {
    const [failedImages, setFailedImages] = useState({});
    const [previewUri, setPreviewUri] = useState(null);

    const closePreview = () => {
      // Do not revoke here because previewUri is also used by the message list;
      // revoking it triggers image reload errors after closing the preview.
      setPreviewUri(null);
    };
    const renderMessage = ({ item }) => {
      const isMine = item?.user?._id === userId;
      const hasImage = item?.messageType === "image" && item?.imageUrl;
      const imageFailed = failedImages[item?._id];
      const timeString = new Date(item?.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

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
            {isMine && onDelete && !!item?._id && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDelete(item)}
                accessibilityLabel="Delete message"
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            )}
            {hasImage && !imageFailed && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setPreviewUri(item.imageUrl)}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.messageImage}
                  resizeMode="cover"
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [item?._id]: true }))
                  }
                />
              </TouchableOpacity>
            )}
            {hasImage && imageFailed && (
              <View style={[styles.messageImage, styles.imageFallback]}>
                <Text style={styles.imageFallbackText}>Image unavailable</Text>
              </View>
            )}
            {!!item?.text && (
              <Text style={[styles.messageText, isMine && { color: "#fff" }]}>
                {item?.text}
              </Text>
            )}
            <Text style={styles.messageMeta}>{timeString}</Text>
          </View>
        </View>
      );
    };

    return (
      <View style={{ flex: 1 }}>
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

        <ImagePreviewModal
          visible={!!previewUri}
          uri={previewUri}
          onClose={closePreview}
        />
      </View>
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
  messageImage: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#0f172a",
  },
  deleteBtn: {
    position: "absolute",
    top: 6,
    left: -35,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#0f172a88",
  },
  deleteText: {
    color: "#fca5a5",
    fontWeight: "800",
    fontSize: 14,
  },
});

export default MessageList;
