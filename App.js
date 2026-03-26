import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { account, databases, ID } from "./appwrite"; // Ensure path is correct

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Handle User Session
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentAccount = await account.get();
        setUser(currentAccount);
      } catch (error) {
        try {
          await account.createAnonymousSession();
          const newUser = await account.get();
          setUser(newUser);
        } catch (loginError) {
          console.error("Login failed:", loginError);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);


const onSend = useCallback(async (newMessages = []) => {
  // 1. ADD THIS SAFETY CHECK
  if (!user || !user.$id) {
    console.error("User not authenticated yet");
    alert("Please wait, connecting to server...");
    return;
  }

  const { text } = newMessages[0];
  
  try {
    await databases.createDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID, 
      process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID, 
      ID.unique(),
      {
        senderId: user.$id, // This was crashing because user was null
        receiverId: "group_chat",
        content: text,
        timestamp: new Date().toISOString(),
        status: "sent",
        messageType: "text",
      }
    );
    
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  } catch (error) {
    console.error("Error sending message:", error);
  }
}, [user]); // user is a dependency here

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user?.$id,
          name: user?.name,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
