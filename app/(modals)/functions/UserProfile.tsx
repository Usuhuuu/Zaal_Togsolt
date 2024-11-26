// components/UserProfile.tsx
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { auth_Refresh_Function } from "./refresh";

const UserProfile: React.FC = () => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3001";

  const user_data_fetching_function = async () => {
    const token = await SecureStore.getItemAsync("Tokens");
    if (!token) {
      throw new Error("User must login");
    }

    const { accessToken, refreshToken } = JSON.parse(token);
    try {
      // Get user data with accessToken
      const fetchProfileData = await axios.get(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 5000,
        withCredentials: true,
      });

      // If accessToken expired, refresh and get data again
      if (!fetchProfileData.data.auth) {
        const newAccessToken = await auth_Refresh_Function(refreshToken, apiUrl);
        if (newAccessToken) {
          await SecureStore.setItemAsync(
            "Tokens",
            JSON.stringify({ accessToken: newAccessToken, refreshToken })
          );

          // Retry fetching profile data
          const retryFetchProfile = await axios.get(`${apiUrl}/auth/profile`, {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            timeout: 5000,
            withCredentials: true,
          });

          if (retryFetchProfile.data.auth) {
            Alert.alert(`Successfully fetched user data: ${JSON.stringify(retryFetchProfile.data.formData)}`);
          }
        }
      } else {
        Alert.alert(`Successfully fetched user data: ${JSON.stringify(fetchProfileData.data.formData)}`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await user_data_fetching_function();
    };
    fetchData();
  }, []);

  return null;
};

export default UserProfile;
