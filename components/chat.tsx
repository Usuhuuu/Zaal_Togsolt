import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { Message } from "@/constants/types";
import useSocket from "@/hooks/useSocket";
import useChatGroups from "@/hooks/useFetch";

const ChatComponent: React.FC = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  const chatGroups = useChatGroups();
  const { socket, messages, sendMessage } = useSocket();

  const joinGroup = (groupId: string) => {
    setCurrentGroupId(groupId);
    // Add logic to join group
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentGroupId) {
      const messageData: Message = {
        senderId: currentGroupId, // Replace with the actual sender ID
        message: newMessage,
      };
      sendMessage(messageData);
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Groups</Text>
      <FlatList
        data={chatGroups}
        renderItem={({ item }) => (
          <Text style={styles.groupItem} onPress={() => joinGroup(item.groupId)}>
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
                <Text style={{ fontWeight: "bold" }}>{item.senderId}:</Text> {item.message}
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
          <Button title="Send" onPress={handleSendMessage} />
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
