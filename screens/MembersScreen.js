import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

export default function MembersScreen({ navigation, route, user, messages }) {
  const dataSource = route?.params?.messages || messages || [];
  const currentUserId = user?.$id;

  const members = useMemo(() => {
    const map = new Map();
    dataSource.forEach((m) => {
      const senderId = m?.user?._id || m?.senderId;
      if (!senderId || senderId === currentUserId) return;
      const name = m?.user?.name || "Member";
      if (!map.has(senderId)) {
        map.set(senderId, { id: senderId, name });
      }
    });

    dataSource.forEach((m) => {
      const receiverId = m?.receiverId;
      if (
        !receiverId ||
        receiverId === "group_chat" ||
        receiverId === currentUserId
      )
        return;
      const name = m?.receiverName || "Member";
      if (!map.has(receiverId)) {
        map.set(receiverId, { id: receiverId, name });
      }
    });
    return Array.from(map.values());
  }, [dataSource, currentUserId]);

  const handleSelect = (member) => {
    navigation.navigate("Chat", { privateUser: member });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>
          {(item.name || "M").slice(0, 1).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name || "Member"}</Text>
        <Text style={styles.sub}>ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Members ({members.length})</Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          members.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No other members yet.</Text>
        }
      />
    </View>
  );
}

MembersScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  user: PropTypes.object,
  messages: PropTypes.array,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { color: "#e5e7eb", fontSize: 18, fontWeight: "800" },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  closeText: { color: "#e5e7eb", fontWeight: "700" },
  listContent: { paddingBottom: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f43f5e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  info: { flex: 1 },
  name: { color: "#e5e7eb", fontSize: 16, fontWeight: "700" },
  sub: { color: "#9ca3af", marginTop: 2 },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { color: "#9ca3af" },
});
