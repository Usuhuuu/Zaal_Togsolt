import axios from "axios";

export const zaal_review_update = async (
  accessToken: string,
  message: string,
  zaal_ID: string,
  rating: number,
  url: string,
  retries = 3
): Promise<string | boolean> => {
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
      return false; 
    } else if (response.status === 200) {
      return "Review updated successfully"; // Success response
    } else {
      return "Failed to update review"; // Unexpected response
    }
  } catch (err) {
    if (retries > 0) {
      if (err instanceof Error) {
        console.warn(`Retrying... (${3 - retries} attempts left)`, err.message);
      } else {
        console.warn(`Retrying... (${3 - retries} attempts left)`, err);
      }
      return zaal_review_update(
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
