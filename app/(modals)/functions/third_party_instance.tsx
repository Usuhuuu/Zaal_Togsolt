import { Alert, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import {
  LoginManager,
  Settings,
  AuthenticationToken,
} from "react-native-fbsdk-next";
import { axiosInstanceRegular } from "./axiosInstance";
import * as Sentry from "@sentry/react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { getTrackingStatus } from "react-native-tracking-transparency";

export const loginWithFacebook = async () => {
  try {
    Settings.initializeSDK();
    let isLimitedLogin = false;
    if (Platform.OS === "ios") {
      const trackStatus = await getTrackingStatus();
      if (trackStatus === "authorized" || trackStatus === "unavailable") {
        await Settings.setAdvertiserTrackingEnabled(true);
        isLimitedLogin = false;
      } else if (trackStatus === "denied") {
        await Settings.setAdvertiserTrackingEnabled(false);
        isLimitedLogin = true;
      }
    } else {
      await Settings.setAdvertiserTrackingEnabled(true);
    }

    LoginManager.logOut();
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) {
      Alert.alert("Login cancelled");
      return { modalVisible: false, data: null };
    }
    const data = await AuthenticationToken.getAuthenticationTokenIOS();
    if (data) {
      const response = await axiosInstanceRegular.post("/auth/facebook", {
        fbData: {
          accessToken: data.authenticationToken,
        },
      });
      console.log("Facebook Login Result:", response);
      console.log("Facebook Login Response:", response);
      if (response.status === 201 && response.data.success) {
        return {
          modalVisible: true,
          data: response.data,
        };
      } else if (response.status === 200 && response.data.success) {
        await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );

        return {
          modalVisible: false,
          data: { message: response.data.message },
        };
      }
    }
  } catch (error: any) {
    console.log("Facebook Login Error:", error);

    if (error.code) {
      switch (error.code) {
        case 1:
          Alert.alert("Network error");
          break;
        case 190:
          Alert.alert("Invalid Access Token");
          break;
        case 10:
          Alert.alert("App not set up correctly");
          break;
        case 429:
          Alert.alert("Too Many Requests");
          break;
        default:
          Sentry.captureException(error);
          Alert.alert("Unknown Error", "Something went wrong.");
      }
    } else {
      Alert.alert("Login failed", "Please try again later.");
      Sentry.captureException(error);
    }

    return { modalVisible: false, data: null };
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
