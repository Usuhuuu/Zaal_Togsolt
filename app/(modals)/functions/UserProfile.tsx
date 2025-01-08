// components/UserProfile.tsx
import React, { useEffect } from "react";
import { Alert } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { auth_Refresh_Function } from "./refresh";
import { throttle } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosInstanc";
import useSWR from "swr";

// export const user_data_fetching_function = throttle(
//   async (
//     path: string,
//     url: string,
//     accessToken: String | undefined,
//     refreshToken: String | undefined,
//     retries: number
//   ) => {
//     const cached_data = await AsyncStorage.getItem(`user_${path}`);
//     if (cached_data) {
//       const formData = JSON.parse(cached_data);
//       return formData;
//     } else {
//       const token = await SecureStore.getItemAsync("Tokens");
//       if (!token) {
//         throw new Error("User must login");
//       }
//       const { accessToken, refreshToken } = JSON.parse(token);
//       try {
//         // Get user data with accessToken
//         const fetchProfileData = await axios.get(
//           `${url}/auth/profile_${path}`,
//           {
//             headers: { Authorization: `Bearer ${accessToken}` },
//             timeout: 5000,
//             withCredentials: true,
//           }
//         );
//         // If accessToken expired, refresh and get data again
//         if (!fetchProfileData.data.auth) {
//           const newAccessToken = await auth_Refresh_Function(refreshToken, url);
//           if (newAccessToken) {
//             await SecureStore.setItemAsync(
//               "Tokens",
//               JSON.stringify({ accessToken: newAccessToken, refreshToken })
//             );

//             // Retry fetching profile data
//             const retryFetchProfile = await axios.get(
//               `${url}/auth/profile_${path}`,
//               {
//                 headers: { Authorization: `Bearer ${newAccessToken}` },
//                 timeout: 5000,
//                 withCredentials: true,
//               }
//             );

//             if (retryFetchProfile.data.auth) {
//               const formData = retryFetchProfile.data.formData;
//               await AsyncStorage.setItem(
//                 `user_${path}`,
//                 JSON.stringify(formData)
//               );
//               return formData;
//             } else {
//               Alert.alert("Login required");
//             }
//           }
//         } else {
//           const formData = fetchProfileData.data.formData;
//           console.log(formData);
//           await AsyncStorage.setItem(`user_${path}`, JSON.stringify(formData));
//           return formData;
//         }
//       } catch (err) {
//         if (retries > 0) {
//           user_data_fetching_function(
//             path,
//             url,
//             accessToken,
//             refreshToken,
//             retries - 1
//           );
//         } else {
//           console.error("Error fetching user data:", err);
//           throw new Error("Failed to fetch user data. Please try again later.");
//         }
//       }
//     }
//   },
//   5000
// );

const fetch_user_data = async (path: string, url: string) => {
  const token = await SecureStore.getItemAsync("Tokens");
  if (!token) {
    throw new Error("User must login sda");
  }
  const { accessToken, refreshToken } = JSON.parse(token);
  try {
    const response = await axiosInstance.get(`${url}/auth/profile_${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
      withCredentials: true,
    });
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
    throw new Error("Failed to fetch user data. Please try again later.");
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
