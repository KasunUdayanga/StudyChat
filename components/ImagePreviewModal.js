import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import PropTypes from "prop-types";

export default function ImagePreviewModal({ visible, uri, onClose }) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {Platform.OS === "ios" ? (
            <ScrollView
              maximumZoomScale={3}
              minimumZoomScale={1}
              contentContainerStyle={styles.scrollContent}
            >
              <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="contain"
              />
            </ScrollView>
          ) : (
            <Image source={{ uri }} style={styles.image} resizeMode="contain" />
          )}
        </View>
      </View>
    </Modal>
  );
}

ImagePreviewModal.propTypes = {
  visible: PropTypes.bool,
  uri: PropTypes.string,
  onClose: PropTypes.func,
};

ImagePreviewModal.defaultProps = {
  visible: false,
  uri: null,
  onClose: () => {},
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
  },
  header: {
    height: 64,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeText: {
    color: "#fff",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
