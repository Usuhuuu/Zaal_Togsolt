import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

let socket: Socket | null = null;
let isConnecting = false;
let connectPromise: Promise<Socket | null> | null = null;

export const connectSocket = async (): Promise<Socket | null> => {
  if (socket?.connected) {
    console.log("🔄 Already connected");
    return socket;
  }

  if (isConnecting && connectPromise) {
    return connectPromise;
  }

  isConnecting = true;

  connectPromise = new Promise(async (resolve) => {
    const token = await SecureStore.getItemAsync("Tokens");
    const notificationToken = await SecureStore.getItemAsync(
      "notificationToken"
    );

    if (!token) {
      console.warn("🚫 No token found");
      isConnecting = false;
      resolve(null);
      return false;
    }

    const { accessToken, refreshToken } = JSON.parse(token);

    socket = io(apiUrl!, {
      auth: { token: accessToken },
      query: { notificationToken },
      extraHeaders: { "x-app-source": "MobileApp" },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      isConnecting = false;
      resolve(socket);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${reason}`);
    });

    socket.on("connect_error", async (error) => {
      console.log("⚠️ Connection error:", error.message);

      if (error.message === "websocket error") {
        console.log("WebSocket error, retrying...");
        return;
      }

      try {
        const res = await axios.post(
          `${apiUrl}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "x-app-source": "MobileApp",
            },
          }
        );

        if (res.status === 200 && res.data.success) {
          const newAccessToken = res.data.newAccessToken;

          await SecureStore.setItemAsync(
            "Tokens",
            JSON.stringify({ accessToken: newAccessToken, refreshToken })
          );

          if (socket) {
            socket.auth = { token: newAccessToken };
            socket.connect(); // Retry connection
          }
        } else {
          await SecureStore.deleteItemAsync("Tokens");
          alert("Session expired. Please log in again.");
        }
      } catch (err) {
        console.log("Token refresh failed:", err);
      }

      isConnecting = false;
      resolve(null);
    });
  });

  return connectPromise;
};

export const getSocket = (): Socket | null => socket;
