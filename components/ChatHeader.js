import React from "react";
import PropTypes from "prop-types";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatHeader({
  userName,
  onLogout,
  onOpenMembers,
  conversationLabel,
  onClearPrivate,
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandBlock}>
        <Image
          source={require("../assets/turquoise black minimalist chat book logo design (1).png")}
          style={styles.topAvatar}
          resizeMode="contain"
        />
        <View style={styles.topInfo}>
          <Text style={styles.topTitle}>
            {conversationLabel || "StudyChat"}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {onClearPrivate && (
          <TouchableOpacity style={styles.groupChip} onPress={onClearPrivate}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color="#e5e7eb"
            />
          </TouchableOpacity>
        )}
        {onOpenMembers && (
          <TouchableOpacity style={styles.membersChip} onPress={onOpenMembers}>
            <Ionicons name="people-outline" size={20} color="#e5e7eb" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.logoutChip} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#7f1d1d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

ChatHeader.propTypes = {
  userName: PropTypes.string,
  onLogout: PropTypes.func,
  onOpenMembers: PropTypes.func,
  conversationLabel: PropTypes.string,
  onClearPrivate: PropTypes.func,
};

ChatHeader.defaultProps = {
  userName: "",
  onLogout: () => {},
  onOpenMembers: null,
  conversationLabel: null,
  onClearPrivate: null,
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderColor: "#111827",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
    rowGap: 6,
    maxWidth: "50%",
  },
  topAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#fff",
  },
  topInfo: { flex: 1 },
  topTitle: { fontSize: 18, fontWeight: "800", color: "#e5e7eb" },
  topSubtitle: { fontSize: 13, color: "#cbd5f5", marginTop: 2 },
  membersChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  membersChipText: { color: "#e5e7eb", fontWeight: "700" },
  groupChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#0b5ed7",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  groupChipText: { color: "#e5e7eb", fontWeight: "700" },
  logoutChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#fca5a5",
    borderWidth: 1,
    borderColor: "#fb7185",
  },
  logoutChipText: { color: "#7f1d1d", fontWeight: "800" },
});
