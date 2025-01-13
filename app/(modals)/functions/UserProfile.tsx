// components/UserProfile.tsx
import * as SecureStore from "expo-secure-store";
import { auth_Refresh_Function } from "./refresh";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axiosInstanc";
import useSWR from "swr";
import * as Sentry from "@sentry/react-native";
import { Alert } from "react-native";

const fetch_user_data = async (path: string, url: string) => {
  const token = await SecureStore.getItemAsync("Tokens");
  if (!token) {
    Alert.alert("Error", "User must login");
    throw new Error("User must login sda");
  }
  const { accessToken, refreshToken } = JSON.parse(token);
  try {
    const response = await axiosInstance.get(`${url}/auth/profile_${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
      withCredentials: true,
    });
    console.log(response.data);
    if (!response.data.auth) {
      const newAccessToken = await auth_Refresh_Function(refreshToken, url);
      if (newAccessToken) {
        await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({ accessToken: newAccessToken, refreshToken })
        );
        const retryResponse = await axiosInstance.get(
          `${url}/auth/profile_${path}`,
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            timeout: 5000,
            withCredentials: true,
          }
        );
        if (retryResponse.data.auth) {
          const formData = retryResponse.data.formData;
          await AsyncStorage.setItem(`user_${path}`, JSON.stringify(formData));
          return formData;
        }
      }
    } else {
      const formData = response.data.formData;
      return formData;
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    Sentry.captureException(err);
  }
};

export const useUserProfile = (path: string, url: string) => {
  console.log("useUserProfile path:", path);
  const fetcher = (endpoint: string) => fetch_user_data(path, url);
  const { data, error, isValidating, mutate } = useSWR(
    `${url}/auth/profile_${path}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      dedupingInterval: 1000 * 60,
    }
  );
  return {
    data,
    isLoading: !data && !error,
    error,
    isValidating,
    mutate,
  };
};

module.exports = { useUserProfile };
