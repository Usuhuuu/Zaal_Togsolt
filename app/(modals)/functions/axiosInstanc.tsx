import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { Alert } from "react-native";

const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ??
  "https://8f9e-118-176-174-110.ngrok-free.app";

// Create the main axios instance for normal requests
export const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceRegular = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("Tokens");

    if (token) {
      const { accessToken } = JSON.parse(token);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status == 401 &&
      error.response.data.success == false &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const token = await SecureStore.getItemAsync("Tokens");
      if (token) {
        const { refreshToken } = JSON.parse(token);
        try {
          const newAccessToken = await axiosInstance.post("/refresh", {
            refreshToken,
          });
          if (newAccessToken.status == 401 && !newAccessToken.data.success) {
            await SecureStore.deleteItemAsync("Tokens");
            Alert.alert(`${newAccessToken.data.message}`);
          } else if (
            newAccessToken.status == 403 &&
            !newAccessToken.data.success
          ) {
            throw new Error(`${newAccessToken.data.message}`);
          } else if (newAccessToken.data.success) {
            await SecureStore.setItemAsync(
              "Tokens",
              JSON.stringify({
                accessToken: newAccessToken.data.accessToken,
                refreshToken,
              })
            );
          }
          if (newAccessToken) {
            await SecureStore.setItemAsync(
              "Tokens",
              JSON.stringify({ accessToken: newAccessToken, refreshToken })
            );
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          throw refreshError;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
