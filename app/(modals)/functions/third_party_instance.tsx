import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { axiosInstanceRegular } from "./axiosInstance";
import * as Sentry from "@sentry/react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export const loginWithFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (!result.isCancelled) {
      const data = await AccessToken.getCurrentAccessToken();
      if (data) {
        try {
          const response = await axiosInstanceRegular.post("/auth/facebook", {
            fbAccessToken: data.accessToken,
          });
          if (response.status === 200 && response.data.success) {
            return { modalVisible: true, data: response.data };
          } else if (response.status === 400 && !response.data.success) {
            Alert.alert("error", "User not found");
          }
        } catch (error) {
          console.log("Error fetching data from Facebook:", error);
        }
      }
    } else {
      Alert.alert("User cancelled the login process");
    }
  } catch (error: any) {
    if (error.code) {
      switch (error.code) {
        case 1:
          Alert.alert("Network error");
        case 190:
          Alert.alert("invalid Access Token");
        case 10:
          Alert.alert("App not set up correctly");
        case 429:
          Alert.alert("Too Many Requests");
        default:
          Sentry.captureException("facebook Error", error.code);
      }
    }
  }
};

export const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const user_info = await GoogleSignin.signIn();
    const { idToken, accessToken } = await GoogleSignin.getTokens();
    const googleAccessToken = accessToken;
    if (googleAccessToken) {
      const response = await axiosInstanceRegular.post("/auth/google", {
        googleAccessToken,
      });
      if (response.status == 200) {
        const tokens = await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        Alert.alert("Google Login Success", "You are logged in!");
      } else {
        Alert.alert("error");
      }
    }
  } catch (err: any) {
    if (isErrorWithCode(err)) {
      switch (err.code) {
        case statusCodes.IN_PROGRESS:
          Alert.alert("progressing");
        case statusCodes.SIGN_IN_CANCELLED:
          Alert.alert("User canceled process");
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert("service not available");
      }
    } else {
      Sentry.captureException("Server Has Problem Try Again Later ");
    }
  }
};

export const loginWithApple = () => {};
