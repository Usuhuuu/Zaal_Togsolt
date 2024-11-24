import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons, Zocial } from "@expo/vector-icons";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";
import { AccessToken, Settings, LoginManager } from "react-native-fbsdk-next";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as Sentry from "@sentry/react-native";

const Page = () => {
  // Access the API URL from the environment variables

  const apiUrl = "https://32f2-203-246-85-194.ngrok-free.app";

  if (!apiUrl) {
    throw new Error("API_URL is not defined in the environment variables");
  }

  const axiosConfig = {
    timeout: 5000,
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [er, setEr] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordHide, setPasswordHide] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isItApple, setIsITApple] = useState(false);
  useEffect(() => {
    if (Platform.OS === "ios") {
      setIsITApple(true);
    }
  }, []);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password },
        { ...axiosConfig, withCredentials: true }
      );
      if (response.status === 200) {
        const tokens = await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        Alert.alert("Login successful");
      } else {
        setEr("Login failed");
        Alert.alert(er);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", er);
      throw new Error("login error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setPasswordHide(!passwordHide);
  };

  const mobileVerify = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/phoneVerification`, // Use apiUrl from environment variable
        { phoneNumber },
        { ...axiosConfig, withCredentials: true }
      );
      response.status === 200
        ? Alert.alert("Verification Sent", "Verification code sent")
        : Alert.alert("Error", "Verification code not sent");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to send verification code");
    }
  };

  const mobileVerifyCheck = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/verifyCode`, // Use apiUrl from environment variable
        { verifyCode },
        { ...axiosConfig, withCredentials: true }
      );
      response.status === 200
        ? setIsVerified(true)
        : Alert.alert("Error", "Failed to verify");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to verify the code");
    }
  };
  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();

      Settings.initializeSDK();

      if (status === "granted") {
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    };
    requestTracking();
  }, []);

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
            } else {
              //Sentry.captureException("Error On fbLogin")
              throw new Error("Error on fbLogin");
            }
          } catch (error: any) {
            //Sentry.captureEvent(error)

            throw new Error("Failed to log in with Facebook.");
          }
        } else {
          throw new Error("No Facebook access token found.");
        }
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
      if (accessToken) {
        const response = await axios.post(
          `${apiUrl}/auth/google`,
          { accessToken },
          { ...axiosConfig, withCredentials: true }
        );
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
        throw new Error("Server Has Problem Try Again Later ");
      }
    }
  };
  const handleAppleLogin = () => {};

  return (
    <ImageBackground
      source={require("../../assets/images/zurag1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry={passwordHide}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={handlePasswordToggle}
          >
            <Ionicons
              name={passwordHide ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.verificationContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
          />
          <TouchableOpacity style={styles.verifyButton} onPress={mobileVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Verification Code"
            value={verifyCode}
            onChangeText={setVerifyCode}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={mobileVerifyCheck}
          >
            <Text style={styles.verifyButtonText}>Check Code</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.loginBtn]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.separatorView}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separatorLine} />
        </View>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.btnOutline}>
            <Zocial name="guest" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Login as Guest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={signup_google}>
            <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={loginWithFacebook}
          >
            <Ionicons name="logo-facebook" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.btnOutline}>
            <Image
              source={require("../../assets/images/emongolia.png")}
              style={styles.imageIcon}
            />
            <Text style={styles.btnOutlineText}>Continue with E-Mongolia</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => handleAppleLogin()}
            style={styles.btnOutline}
          >
            {isItApple ? (
              <>
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
                  }
                  buttonStyle={
                    AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  }
                  cornerRadius={5}
                  style={styles.button}
                  onPress={async () => {
                    try {
                      const credentials = await AppleAuthentication.signInAsync(
                        {
                          requestedScopes: [
                            AppleAuthentication.AppleAuthenticationScope
                              .FULL_NAME,
                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                          ],
                        }
                      );
                      console.log(credentials);
                    } catch (err: any) {
                      if (err.code === "ERR_REQUEST_CANCELED") {
                        console.log("User canceled Login");
                        Alert.alert(`${err}`);
                        Alert.alert("ERR_REQUEST_CANCELED");
                      } else if (err.code === "ERR_INVALID_OPERATION") {
                        Alert.alert(`${err}`);
                        Alert.alert("ERR_INVALID_OPERATION");
                      } else if (err.code === "ERR_REQUEST_FAILED") {
                        Alert.alert("ERR_REQUEST_FAILED");
                        Alert.alert(`${err}`);
                      } else if (err.code === "ERR_REQUEST_NOT_HANDLED") {
                        Alert.alert("ERR_REQUEST_NOT_HANDLED");
                      } else {
                        Alert.alert(`${err}`);
                        Alert.alert(`${err.code}`);
                      }
                    }
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 26,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  verifyButton: {
    marginLeft: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: "#fff",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  loginBtn: {
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  separatorView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    borderBottomColor: "#ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#666",
  },
  socialButtons: {
    marginTop: 20,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
  },
  btnIcon: {
    marginRight: 10,
  },
  imageIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});

export default Page;
