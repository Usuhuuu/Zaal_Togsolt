import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

export const zaal_review_update = async (
  accessToken: string,
  message: string,
  zaal_ID: string,
  rating: number,
  url: String,
  retries = 3
) => {
  try {
    const response = await axios.post(
      `${url}/auth/zaal_review_update`,
      { message, zaal_ID, rating },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 5000,
        withCredentials: true,
      }
    );
    if (!response.data.auth) {
      return (response.data.auth = false);
    } else if (response.status == 200) {
      return "Review updated successfully";
    } else {
      return "Failed to update review";
    }
  } catch (err) {
    if (retries > 0) {
      zaal_review_update(
        accessToken,
        message,
        zaal_ID,
        rating,
        url,
        retries - 1
      );
    } else {
      console.error("Error refreshing token:", err);
      throw new Error("Failed to refresh token. Please try again later.");
    }
  }
};

module.exports = { zaal_review_update };
