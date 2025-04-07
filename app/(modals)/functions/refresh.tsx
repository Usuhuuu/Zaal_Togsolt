import * as SecureStore from "expo-secure-store";
import { axiosInstanceRegular } from "./axiosInstance";
import { useAuth } from "../context/authContext";

export const auth_Refresh_Function = async (refreshToken: string) => {
  try {
    const refreshTokenAuth = await axiosInstanceRegular.post(
      "/auth/refresh",
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    if (refreshTokenAuth.status == 401 && !refreshTokenAuth.data.success) {
      await SecureStore.deleteItemAsync("Token");
      useAuth().logOut;
    } else if (
      refreshTokenAuth.status == 403 &&
      !refreshTokenAuth.data.success
    ) {
      throw new Error(`${refreshTokenAuth.data.message}`);
    } else if (refreshTokenAuth.data.authAccess) {
      useAuth().logIn();
      const new_access_token = refreshTokenAuth.data.accessToken;
      return new_access_token;
    }
  } catch (err) {
    console.error("Error refreshing token:", err);
    throw new Error("Failed to refresh token. Please try again later.");
  }
};
