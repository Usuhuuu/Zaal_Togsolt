import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import useSWR from "swr";
import { normalFetch } from "./functions/UserProfile";

const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://8f9e-118-176-174-110.ngrok-free.app";

interface Message {
  groupId: string;
  message: string;
  timestamp: Date;
}

interface ChatGroup {
  groupId: string;
}

const ChatComponent: React.FC = () => {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const {
    data: chatData,
    error: chatError,
    isLoading,
  } = useSWR("group_chat", {
    fetcher: () => normalFetch("/chat/check"),
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  useEffect(() => {
    if (chatData) {
      setChatGroups(chatData.chatGroupIDs.map((groupId: any) => ({ groupId })));
    } else if (chatError) {
      console.error("Error fetching chat groups:", chatError);
      Sentry.captureException(chatError);
    }
  }, []);

  const chatInit = async (groupId: string) => {
    try {
      setCurrentGroupId(groupId);
      const token = await SecureStore.getItemAsync("Tokens");
      if (!token) {
        Sentry.captureException("Token not found while joining group.");
        return Alert.alert("Login required to join group.");
      }
      const { accessToken } = JSON.parse(token);
      if (!socketRef.current || socketRef.current.disconnected) {
        socketRef.current = io(`${apiUrl}`, {
          auth: { token: accessToken },
          query: { groupId },
          transports: ["websocket"],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });
        socketRef.current.on("connect", () => {
          socketRef.current?.on("chatHistory", (sortedMessages: Message[]) => {
            setMessages(sortedMessages);
          });
          socketRef.current?.emit("chatHistory");
          socketRef.current?.on("receiveMessage", (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
          });
        });
      }
    } catch (error) {
      console.error("Error joining group:", error);
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentGroupId]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    const groupId = currentGroupId;
    if (!groupId || !socketRef.current) return;

    const newMessage = {
      groupId,
      message: messageText,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socketRef.current.emit("sendMessage", newMessage);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {isLoading ? (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Chat Groups</Text>
          <FlatList
            data={chatGroups}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.groupItem}
                onPress={() => chatInit(item.groupId)}
              >
                <Text style={styles.groupText}>{item.groupId}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.groupId}
          />

          {currentGroupId && (
            <View style={styles.chatContainer}>
              <Text style={styles.subtitle}>Chat Messages</Text>
              <FlatList
                data={messages}
                renderItem={({ item }) => (
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{item.message}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.timestamp.toString()}
                style={styles.messagesList}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type your message"
                  maxLength={2000}
                />
                <Button title="Send" onPress={() => sendMessage(newMessage)} />
              </View>
            </View>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    marginVertical: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 12,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
  groupItem: {
    padding: 16,
    backgroundColor: "#4caf50",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  groupText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  chatContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  messageContainer: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: "75%",
    alignSelf: "flex-start",
    backgroundColor: "#e0f7fa",

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messagesList: {
    flex: 1,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f1f1f1",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 20,
    marginLeft: 8,

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatComponent;
