import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { auth_Refresh_Function } from "./functions/refresh";
import { throttle } from "lodash";

const apiUrl = "https://32f2-203-246-85-194.ngrok-free.app"; // Define apiUrl properly

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
    throttle(async () => {
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
        console.error("Error retrieving token:", error);
        Sentry.captureException(error);
        setIsItLoading(false);
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
      // Check if the socket is already connected
      if (!socketRef.current || socketRef.current.disconnected) {
        console.log("Connected group:", groupId);
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
          // Handle chat history
          socketRef.current?.on("chatHistory", (sortedMessages: Message[]) => {
            console.log("Received chat history:", sortedMessages);
            setMessages(sortedMessages);
          });
          socketRef.current?.emit("chatHistory");
          // Handle incoming messages
          socketRef.current?.on("receiveMessage", (data: Message) => {
            console.log("Received message:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
          });

          // Handle socket disconnection
          socketRef.current?.on("disconnect", () => {
            console.log("Disconnected from socket server");
          });

          // Handle reconnection attempts
          socketRef.current?.on("reconnect", () => {
            console.log("Reconnected to the socket server");
          });

          socketRef.current?.on("reconnect_failed", () => {
            console.log("Reconnection failed");
          });

          socketRef.current?.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            Sentry.captureException(error);
          });
        });
        // Handle successful connection
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
        console.log("Socket disconnected on cleanup");
      }
    };
  }, [currentGroupId]);

  const sendMessage = async (messageText: string) => {
    try {
      if (!messageText.trim()) {
        console.error("Message cannot be empty");
        return;
      }
      const groupId = currentGroupId;
      if (!groupId) {
        console.error("Group ID is missing");
        return;
      }
      if (!socketRef.current) {
        console.error("Socket is not initialized");
        return;
      }
      const newMessage = {
        groupId: groupId,
        message: messageText,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socketRef.current?.emit("sendMessage", newMessage);
      console.log("Sending message:", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Groups</Text>
      <FlatList
        data={chatGroups}
        renderItem={({ item }) => (
          <Text style={styles.groupItem} onPress={() => chatInit(item.groupId)}>
            {item.groupId}
          </Text>
        )}
        keyExtractor={(item) => item.groupId}
      />

      {currentGroupId && (
        <View>
          <Text style={styles.subtitle}>Chat Messages</Text>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <Text key={item.timestamp.toString()}>{item.message}</Text>
            )}
            keyExtractor={(item) => item.timestamp.toString()}
          />
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message"
          />
          <Button title="Send" onPress={() => sendMessage(newMessage)} />
        </View>
      )}
    </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 8,
  },
  groupItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginVertical: 8,
  },
});

export default ChatComponent;
