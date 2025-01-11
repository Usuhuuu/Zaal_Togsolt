import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import { Alert } from "react-native";

const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://8f9e-118-176-174-110.ngrok-free.app";

interface Permissions {
  notification_token: string;
  notification_status: Boolean;
  location_status: Boolean;
}

const [permission, setPermission] = useState<Permissions>({
  notification_token: "",
  notification_status: false,
  location_status: false,
});

useEffect(() => {
  const askForNotificationPermission = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();
    const tokenString = token.data;
    console.log("Notification token:", tokenString);

    // Send token to backend and store in cache (e.g., SecureStore)
    await sendTokenToBackend(tokenString);
    await SecureStore.setItemAsync("notificationToken", tokenString);

    setPermission((prevPermission) => ({
      ...prevPermission,
      notification_token: tokenString,
      notification_status: true,
    }));
  };

  askForNotificationPermission();
}, []); // Empty dependency array to run this effect only once when component mounts

const sendTokenToBackend = async (token: string) => {
  try {
    const response = await axios.post(`${apiUrl}/notifications`, {
      user_notification_token: token,
    });

    if (response.status !== 200) {
      throw new Error("Failed to send token to backend");
    }

    console.log("Token sent to backend successfully");
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};
