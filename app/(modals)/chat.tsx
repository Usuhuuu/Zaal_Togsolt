import React, { useEffect, useState, useCallback, useRef } from "react";
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
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import * as Sentry from "@sentry/react-native";
import { auth_Refresh_Function } from "./functions/refresh";
import { throttle } from "lodash";

const apiUrl = "https://1627-118-176-174-110.ngrok-free.app"; // Define apiUrl properly

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
  const [isItLoading, setIsItLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  const socketRef = useRef<Socket | null>(null);

  const fetchChatGroups = useCallback(
    throttle(async (retries = 3) => {
      if (isItLoading) return;
      setIsItLoading(true);
      try {
        const token: any = await SecureStore.getItemAsync("Tokens");
        if (!token) {
          setShouldFetch(false);
          Alert.alert("No token found.");
          throw new Error("No token found.");
        }
        const { accessToken, refreshToken } = JSON.parse(token);
        const response = await axios.get(`${apiUrl}/chat/check`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
          timeout: 5000,
        });
        if (response.data.auth) {
          setChatGroups(
            response.data.chatGroupIDs.map((groupId: any) => ({ groupId }))
          );
          setShouldFetch(false);
        } else {
          const new_access_token = await auth_Refresh_Function(
            refreshToken,
            apiUrl
          );
          if (new_access_token) {
            await SecureStore.setItemAsync(
              "Tokens",
              JSON.stringify({ accessToken: new_access_token, refreshToken })
            );
            const retryResponse = await axios.get(`${apiUrl}/chat/check`, {
              headers: { Authorization: `Bearer ${new_access_token}` },
              withCredentials: true,
              timeout: 5000,
            });
            if (retryResponse.data.auth) {
              setChatGroups(
                retryResponse.data.chatGroupIDs.map((groupId: any) => ({
                  groupId,
                }))
              );
              setShouldFetch(false);
            }
          }
        }
      } catch (error) {
        if (retries > 0) {
          fetchChatGroups(retries - 1);
        } else {
          console.error("Error fetching chat groups:", error);
          Sentry.captureException(error);
        }
      }
    }, 5000),
    [isItLoading]
  );

  useEffect(() => {
    if (shouldFetch) {
      fetchChatGroups();
    }
  }, [shouldFetch]);

  const chatInit = async (groupId: string) => {
    try {
      setCurrentGroupId(groupId);
      const token = await SecureStore.getItemAsync("Tokens");
      if (!token) {
        throw new Error("Token not found while joining group.");
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  groupItem: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
    borderRadius: 8,
  },
  groupText: {
    fontSize: 18,
    color: "#333",
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#e1f7d5",
    borderRadius: 8,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messagesList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
});

export default ChatComponent;
