import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { Alert } from "react-native";

const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ??
  "https://8f9e-118-176-174-110.ngrok-free.app";

const tokenWithRetry = async (
  maxRetry: number = 5,
  maxInterval: number = 1000
) => {
  let token = null;
  let retry = 0;
  token = await SecureStore.getItemAsync("Tokens");
  while (!token && retry <= maxRetry) {
    token = await SecureStore.getItemAsync("Tokens");
    if (!token) {
      retry++;
      await new Promise((resolve) => setTimeout(resolve, maxInterval));
    }
  }
  if (!token) {
    throw new Error("Token not found after retries");
  }
  return token;
};

// Create the main axios instance for normal requests
export const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceRegular = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenWithRetry();
    if (!token) {
      throw new Error("Token not founded");
    }
    if (token) {
      const { accessToken } = JSON.parse(token);
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      config.headers.Authorization = null;
      throw new Error("Token not founded");
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
          const newAccessToken = await axiosInstanceRegular.post(
            "/auth/refresh",
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } }
          );
          if (newAccessToken.status == 400) {
            await SecureStore.deleteItemAsync("Tokens");
            Alert.alert(`${newAccessToken.data.message} pisda`);
          } else if (
            newAccessToken.status == 200 &&
            newAccessToken.data.success
          ) {
            await SecureStore.setItemAsync(
              "Tokens",
              JSON.stringify({
                accessToken: newAccessToken.data.newAccessToken,
                refreshToken,
              })
            );

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {}
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
