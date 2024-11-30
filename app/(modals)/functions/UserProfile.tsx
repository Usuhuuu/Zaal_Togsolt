// components/UserProfile.tsx
import React, { useEffect } from "react";
import { Alert } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { auth_Refresh_Function } from "./refresh";
import { throttle } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const user_data_fetching_function = throttle(
  async (path: string, url: string, retries = 3) => {
    const cached_data = await AsyncStorage.getItem(`user_${path}`);
    if (cached_data) {
      const formData = JSON.parse(cached_data);
      return formData;
    } else {
      const token = await SecureStore.getItemAsync("Tokens");
      if (!token) {
        throw new Error("User must login");
      }
      const { accessToken, refreshToken } = JSON.parse(token);
      try {
        // Get user data with accessToken
        const fetchProfileData = await axios.get(
          `${url}/auth/profile_${path}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 5000,
            withCredentials: true,
          }
        );
        // If accessToken expired, refresh and get data again
        if (!fetchProfileData.data.auth) {
          const newAccessToken = await auth_Refresh_Function(refreshToken, url);
          if (newAccessToken) {
            await SecureStore.setItemAsync(
              "Tokens",
              JSON.stringify({ accessToken: newAccessToken, refreshToken })
            );

            // Retry fetching profile data
            const retryFetchProfile = await axios.get(
              `${url}/auth/profile_${path}`,
              {
                headers: { Authorization: `Bearer ${newAccessToken}` },
                timeout: 5000,
                withCredentials: true,
              }
            );

            if (retryFetchProfile.data.auth) {
              const formData = retryFetchProfile.data.formData;
              console.log(formData);
              await AsyncStorage.setItem(
                `user_${path}`,
                JSON.stringify(formData)
              );
              return formData;
            } else {
              Alert.alert("Login required");
            }
          }
        } else {
          const formData = fetchProfileData.data.formData;
          await AsyncStorage.setItem(`user_${path}`, JSON.stringify(formData));
          return formData;
        }
      } catch (err) {
        if (retries > 0) {
          user_data_fetching_function(path, url, retries - 1);
        } else {
          console.error("Error fetching user data:", err);
          throw new Error("Failed to fetch user data. Please try again later.");
        }
      }
    }
  },
  5000
);

module.exports = { user_data_fetching_function };
