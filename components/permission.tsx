import React, { useRef } from "react";
import * as Notification from "expo-notifications";

export const usePushNotifications = async ()=> {
    const pushTokenRef = useRef<string | null>(null);
    let token 
    const {status} = await Notification.requestPermissionsAsync();
    if(status === "granted"{
        token = await Notification.getExpoPushTokenAsync();
        pushTokenRef.current = token.data;
    } else {
        console.log("Push notification permission not granted");
    }
)
}
