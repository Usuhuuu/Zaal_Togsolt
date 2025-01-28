import axiosInstance from "./axiosInstanc";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export const fetchRoleAndProfil = async (path: String) => {
  router;
  const token = await SecureStore.getItemAsync("Tokens");
  if (!token) {
    throw new Error("No token found pisda");
  }
  try {
    const response = await axiosInstance.get(`/auth/profile_${path}`);
    return {
      role: response.data.role,
      profileData: response.data.formData,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch role and profile data");
  }
};
