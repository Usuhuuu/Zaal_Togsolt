import axiosInstance from "./axiosInstanc";
import * as SecureStore from "expo-secure-store";

export const fetchRoleAndProfil = async (path: String) => {
  const token = await SecureStore.getItemAsync("Tokens");
  if (!token) {
    throw new Error("Token not founded pisda");
  }

  try {
    const response = await axiosInstance.get(`/auth/profile_${path}`);
    return {
      role: response.data.role,
      profileData: response.data.formData,
    };
  } catch (err) {
    console.log(err, "pisda");
    throw new Error("Failed to fetch role and profile data");
  }
};

export const normalFetch = async (url: string) => {
  const token = await SecureStore.getItemAsync("Tokens");
  if (!token) {
    throw new Error("Token not founded pisda");
  }
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch data");
  }
};
