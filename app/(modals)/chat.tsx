import React, { useEffect, useState } from "react";
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

interface Message {
  senderId: string;
  message: string;
}

interface ChatGroup {
  groupId: string;
}

const ChatComponent: React.FC = () => {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  let socket: Socket | null = null;

  useEffect(() => {
    const setupSocket = async () => {
      try {
        const token = await SecureStore.getItemAsync("Tokens");
        const signUpPls = "please login ";
        if (!token) {
          Alert.alert(`${signUpPls}`);
        } else {
          const { accessToken } = JSON.parse(token);

          socket = io("http://localhost:3001", {
            query: { token: accessToken },
          });

          socket.on("connect", () => {
            console.log("Connected to socket server:", socket?.id);
            Alert.alert("socket?.id");
          });

          socket.on("chatHistory", (chatHistory: Message[]) => {
            setMessages(chatHistory);
          });

          socket.on("receiveMessage", (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
          });

          socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
            Alert.alert("Disconnected from WebSocket.");
          });
        }
      } catch (error) {
        console.error("Error setting up socket:", error);
        Sentry.captureException(error); // Log setupSocket error to Sentry
      }
    };

    setupSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  const fetchChatGroups = async () => {
    try {
      const token = await SecureStore.getItemAsync("Tokens");
      if (!token) {
        throw new Error("No token found.");
      }
      const { accessToken } = JSON.parse(token);

      const response = await axios.get<{ chatGroupIDs: string[] }>(
        "http://localhost:3001/chat/check",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const groups: ChatGroup[] = response.data.chatGroupIDs.map((groupId) => ({
        groupId,
      }));
      setChatGroups(groups);
    } catch (error) {
      console.error("Error fetching chat groups:", error);
      Sentry.captureException(error); // Log fetchChatGroups error to Sentry
    }
  };

  useEffect(() => {
    fetchChatGroups();
  }, []);

  const joinGroup = async (groupId: string) => {
    try {
      setCurrentGroupId(groupId);

      const token = await SecureStore.getItemAsync("Tokens");
      if (!token) {
        throw new Error("Token not found while joining group.");
      }
      const { userId } = JSON.parse(token);

      socket?.emit("joinGroup", { groupId, userId });
    } catch (error) {
      console.error("Error joining group:", error);
      Sentry.captureException(error); // Log joinGroup error to Sentry
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && currentGroupId) {
      const messageData = {
        groupId: currentGroupId,
        senderId: currentGroupId, // Replace this with the actual sender ID
        message: newMessage,
      };

      socket?.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Groups</Text>
      <FlatList
        data={chatGroups}
        renderItem={({ item }) => (
          <Text
            style={styles.groupItem}
            onPress={() => joinGroup(item.groupId)}
          >
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
              <Text key={item.senderId}>
                <Text style={{ fontWeight: "bold" }}>{item.senderId}:</Text>{" "}
                {item.message}
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message"
          />
          <Button title="Send" onPress={sendMessage} />
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
