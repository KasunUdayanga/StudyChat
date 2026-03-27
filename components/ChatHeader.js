import React from "react";
import PropTypes from "prop-types";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ChatHeader({ userName, onLogout }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandBlock}>
        <Image
          source={require("../assets/turquoise black minimalist chat book logo design (1).png")}
          style={styles.topAvatar}
          resizeMode="contain"
        />
        <View style={styles.topInfo}>
          <Text style={styles.topTitle}>StudyChat</Text>
          <Text style={styles.topSubtitle}>
            Connected as {userName || "You"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutChip} onPress={onLogout}>
        <Text style={styles.logoutChipText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

ChatHeader.propTypes = {
  userName: PropTypes.string,
  onLogout: PropTypes.func,
};

ChatHeader.defaultProps = {
  userName: "",
  onLogout: () => {},
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
