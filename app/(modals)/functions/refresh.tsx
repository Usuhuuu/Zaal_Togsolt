import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

export const auth_Refresh_Function = async (
  refreshToken: string,
  url: string
) => {
  try {
    // Making the request to refresh the access token
    const refreshTokenAuth = await axios.post(
      `${url}/refresh`,
      {},
      {
        headers: { refresh: refreshToken },
        timeout: 5000,
        withCredentials: true,
      }
    );
    // Handling different HTTP status codes
    const data = refreshTokenAuth.data;
    if (refreshTokenAuth.status === 401) {
      await SecureStore.deleteItemAsync("Token"); // Clear expired tokens
      Alert.alert("User needs to log in again.");
    } else if (refreshTokenAuth.status === 403) {
      // Invalid refresh token
      throw new Error("Refresh token is invalid.");
    } else if (data.authAccess) {
      // Successful refresh, store the new access token
      const new_access_token = data.accessToken;
      return new_access_token; // Return the new access token
    }
  } catch (err) {
    // Improved error handling
    console.error("Error refreshing token:", err);
    throw new Error("Failed to refresh token. Please try again later.");
  }
};

module.exports = { auth_Refresh_Function };
