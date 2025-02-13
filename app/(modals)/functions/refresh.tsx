import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { axiosInstanceRegular } from "./axiosInstanc";

export const auth_Refresh_Function = async (refreshToken: string) => {
  try {
    const refreshTokenAuth = await axiosInstanceRegular.post("/refresh", {
      headers: { refresh: refreshToken },
    });
    const data = refreshTokenAuth.data;
    if (refreshTokenAuth.status == 401 && !data.success) {
      await SecureStore.deleteItemAsync("Token");
      Alert.alert(`${data.message}`);
    } else if (refreshTokenAuth.status == 403 && !data.success) {
      throw new Error(`${data.message}`);
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
