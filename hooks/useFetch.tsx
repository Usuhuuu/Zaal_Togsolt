import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { ChatGroup } from "@/constants/types";

const useChatGroups = (): ChatGroup[] => {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);

  useEffect(() => {
    const fetchChatGroups = async () => {
      try {
        const token = await SecureStore.getItemAsync("Tokens");
        if (!token) {
          console.error("No token found.");
          return;
        }
        const { accessToken } = JSON.parse(token);

        const response = await axios.get<{ chatGroupIDs: string[] }>(
          "http://192.168.200.163:3001/chat/check",
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
      }
    };

    fetchChatGroups();
  }, []);

  return chatGroups;
};

export default useChatGroups;
