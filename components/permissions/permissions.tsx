import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export const NotificationPermissions = async () => {
  const [notificatonToken, setNotificatonToken] = useState<string | null>(null);
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status == "granted") {
      } else {
        Alert.alert("You need to enable permissions to receive notifications!");
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      setNotificatonToken(token.data);
    };
    getPermissions();

    const comingNotification = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received", notification);
      }
    );
    return () => {
      comingNotification.remove();
    };
  }, []);
};
