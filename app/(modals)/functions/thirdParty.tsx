import { AccessToken, Settings, LoginManager } from "react-native-fbsdk-next";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import * as AppleAuthentication from "expo-apple-authentication";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axios from "axios";
import { Alert } from "react-native";
import { useEffect } from "react";

const axiosConfig = {
  timeout: 5000,
};
const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://8f9e-118-176-174-110.ngrok-free.app";
if (!apiUrl) {
  throw new Error("API_URL is not defined in the environment variables");
}
const loginWithFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) {
      console.log("==> Login cancelled");
      throw new Error("login cancelled");
    } else {
      console.log("Login success with permissions:", result);
      const data = await AccessToken.getCurrentAccessToken();
      if (data) {
        const accessToken = data.accessToken;
        try {
          const res = await axios.post(
            `${apiUrl}/auth/facebook`,
            { accessToken },
            { ...axiosConfig, withCredentials: true }
          );
          console.log("Facebook login result:", res);
          if (res.status == 200) {
            const tokens = await SecureStore.setItemAsync(
              "Tokens",
              JSON.stringify({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
              })
            );
            Alert.alert(`${tokens}`);
            Alert.alert("Facebook Login Success", "You are logged in!");
          }
        } catch (error) {
          console.error("Error sending Facebook token:", error);
          Alert.alert("Error", "Failed to log in with Facebook.");
        }
      } else {
        Alert.alert("Error", "No Facebook access token found.");
      }
    }
  } catch (error) {
    console.error("Facebook login error:", error);
    Alert.alert("Error", "Failed to log in with Facebook.");
    throw new Error("facebook login zailaad oglo" + error);
  }
};

useEffect(() => {
  GoogleSignin.configure({
    webClientId:
      "56931783205-g9s9glhtlpmjh6vktt3osnh44go1fo7k.apps.googleusercontent.com",
    offlineAccess: true,
    iosClientId:
      "56931783205-78eeaknokj0nah74h5d53eis9ebj77r6.apps.googleusercontent.com",
  });
}, []);

const signup_google = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const user_info = await GoogleSignin.signIn();
    const { idToken, accessToken } = await GoogleSignin.getTokens();
    console.log("Access Token:", accessToken);
    if (accessToken) {
      const response = await axios.post(
        `${apiUrl}/auth/google`,
        { accessToken },
        { ...axiosConfig, withCredentials: true }
      );
      console.log("Facebook login result:", response);
      if (response.status == 200) {
        await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        Alert.alert(`${accessToken}`);
        Alert.alert("Facebook Login Success", "You are logged in!");
      }
    }
  } catch (err: any) {
    console.log(err);
    if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert("canceled");
    } else if (err.code == statusCodes.IN_PROGRESS) {
      Alert.alert("progressing");
    } else if (err.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert("sdas");
      console.log(err);
    }
  }
};
const handleAppleLogin = () => {};

module.exports = { handleAppleLogin, signup_google, loginWithFacebook };
