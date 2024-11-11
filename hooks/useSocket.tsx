import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import { Message } from "@/constants/types";

interface UseSocketResult {
  socket: Socket | null;
  messages: Message[];
  sendMessage: (message: Message) => void;
}

const useSocket = (): UseSocketResult => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const setupSocket = async () => {
      const token = await SecureStore.getItemAsync("Tokens");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const { accessToken } = JSON.parse(token);

      const newSocket = io("http://192.168.200.163:3001", {
        query: { token: accessToken },
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket server:", newSocket.id);
      });

      newSocket.on("chatHistory", (chatHistory: Message[]) => {
        setMessages(chatHistory);
      });

      newSocket.on("receiveMessage", (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      setSocket(newSocket);
    };

    setupSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  const sendMessage = (message: Message) => {
    socket?.emit("sendMessage", message);
  };

  return { socket, messages, sendMessage };
};

export default useSocket;
