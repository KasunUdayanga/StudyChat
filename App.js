import "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GiftedChat } from "react-native-gifted-chat";
import { account, databases, ID, Query } from "./appwrite";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [splashMinDone, setSplashMinDone] = useState(false);
  const showApiError = (title, error) => {
    const message = error?.message || "Something went wrong. Please try again.";
    setErrorMessage(`${title}: ${message}`);
    Alert.alert(title, message);
  };

  useEffect(() => {
    const timer = setTimeout(() => setSplashMinDone(true), 2000);
    const checkUser = async () => {
      try {
        const currentAccount = await account.get();
        setUser(currentAccount);
      } catch (error) {
        // no session; surface other errors
        if (error?.code && error.code !== 401) {
          showApiError("Session check failed", error);
        }
      } finally {
        setLoadingUser(false);
      }
    };
    checkUser();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await databases.listDocuments(
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
          [Query.orderDesc("timestamp"), Query.limit(50)]
        );

        const formatted = res.documents.map((doc) => ({
          _id: doc.$id,
          text: doc.content || doc.text,
          createdAt: new Date(doc.timestamp || doc.$createdAt || doc.createdAt),
          user: {
            _id: doc.senderId,
            name: "User",
          },
        }));

        setMessages(formatted);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error loading messages:", error);
        showApiError("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [user]);

  const onSend = useCallback(
    async (newMessages = []) => {
      if (!user) return;
      const { text } = newMessages[0];

      try {
        await databases.createDocument(
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
          ID.unique(),
          {
            senderId: user.$id,
            receiverId: "group_chat",
            content: text,
            timestamp: new Date().toISOString(),
            status: "sent",
            messageType: "text",
          }
        );
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessages)
        );
        setErrorMessage(null);
      } catch (error) {
        showApiError("Error sending message", error);
      }
    },
    [user]
  );

  const handleLogin = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const current = await account.get();
      setUser(current);
      setErrorMessage(null);
    } catch (error) {
      showApiError("Login failed", error);
      throw error;
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      await account.create(ID.unique(), email, password, name || undefined);
      await handleLogin(email, password);
      setErrorMessage(null);
    } catch (error) {
      showApiError("Registration failed", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setMessages([]);
    }
  };

  if (loadingUser || !splashMinDone) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("./assets/for icon.png")}
          style={styles.splashIcon}
          resizeMode="contain"
        />
        <ActivityIndicator
          size="large"
          color="#fd0d0dc6"
          style={styles.loading}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen name="Chat" options={{ headerShown: false }}>
            {(props) => (
              <ChatScreen
                {...props}
                user={user}
                messages={messages}
                onSend={onSend}
                refreshing={loadingMessages}
                onLogout={handleLogout}
                errorMessage={errorMessage}
                onDismissError={() => setErrorMessage(null)}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={handleLogin}
                errorMessage={errorMessage}
                onDismissError={() => setErrorMessage(null)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" options={{ headerShown: false }}>
            {(props) => (
              <RegisterScreen
                {...props}
                onRegister={handleRegister}
                errorMessage={errorMessage}
                onDismissError={() => setErrorMessage(null)}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading:{
    alignSelf:"center",
  },
  splashContainer: {
    flex: 1,
    backgroundColor: "#b495955e",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  splashIcon: {
    width: 250,
    height: 150,
    borderRadius:23,
  },
});
