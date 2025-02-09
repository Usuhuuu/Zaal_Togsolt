import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
import { axiosInstanceRegular } from "./functions/axiosInstanc";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { t } = useTranslation();
  const loginDetails: any = t("login", { returnObjects: true });
  const login = loginDetails[0];

  const apiUrl =
    Constants.expoConfig?.extra?.apiUrl ||
    "https://8f9e-118-176-174-110.ngrok-free.app";

  if (!apiUrl) {
    Sentry.captureException(
      "API_URL is not defined in the environment variables"
    );
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [er, setEr] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordHide, setPasswordHide] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isItApple, setIsITApple] = useState(false);
  const [isitGoogle, setIsItGoogle] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (Platform.OS === "ios") {
      setIsITApple(true);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceRegular.post("/login", {
        email,
        userPassword: password,
      });
      if (response.status == 200) {
        await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        Alert.alert("Login Success");
        router.push("/");
        setShouldRender(true);
      } else {
        setEr("Login failed");
        Alert.alert(er);
      }
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setPasswordHide(!passwordHide);
  };

  const mobileVerify = async () => {
    try {
      const response = await axiosInstanceRegular.post(
        "/auth/phoneVerification",
        {
          phoneNumber,
        }
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
      const response = await axiosInstanceRegular.post("/auth/verifyCode", {
        verifyCode,
      });
      response.status === 200
        ? setIsVerified(true)
        : Alert.alert("Error", "Failed to verify");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to verify the code");
    }
  };

  const requestTracking = async () => {
    const { status } = await requestTrackingPermissionsAsync();
    Settings.initializeSDK();
    if (status == "granted") {
      await Settings.setAdvertiserTrackingEnabled(true);
    }
  };
  useEffect(() => {
    if (isitGoogle) {
      requestTracking();
    }
  }, [isitGoogle]);

  const loginWithFacebook = async () => {
    try {
      Alert.alert(`${apiUrl}`);
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        console.log("==> Login cancelled");
        Sentry.captureException("login cancelled");
      } else {
        console.log("Login success with permissions:", result);
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          const fbAccessToken = data.accessToken;
          try {
            const res = await axiosInstanceRegular.post("/auth/facebook", {
              fbAccessToken,
            });

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
              Sentry.captureException("Error on fbLogin");
            }
          } catch (error: any) {
            //Sentry.captureEvent(error)

            Sentry.captureException("Failed to log in with Facebook.");
          }
        } else {
          Sentry.captureException("No Facebook access token found.");
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
            placeholder={login.email}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor={Colors.grey}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder={login.password}
            secureTextEntry={passwordHide}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor={Colors.grey}
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
            placeholder={login.phoneNum}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            placeholderTextColor={Colors.grey}
          />
          <TouchableOpacity style={styles.verifyButton} onPress={mobileVerify}>
            <Text style={styles.verifyButtonText}>{login.verify}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder={login.verifyCode}
            value={verifyCode}
            onChangeText={setVerifyCode}
            style={styles.input}
            placeholderTextColor={Colors.grey}
          />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={mobileVerifyCheck}
          >
            <Text style={styles.verifyButtonText}>{login.CheckCode}</Text>
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
            <Text style={styles.buttonText}>{login.login}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.separatorView}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separatorLine} />
        </View>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.btnOutline} onPress={signup_google}>
            <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>
              {login.continuewithgoogle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={loginWithFacebook}
          >
            <Ionicons name="logo-facebook" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>
              {login.continuewithfacebook}
            </Text>
          </TouchableOpacity>
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
    justifyContent: "center", // Center content
    alignItems: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 30, // Rounded edges
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30, // Rounded edges for the button
    elevation: 3, // For Android button elevation
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtn: {
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18, // Increased font size for readability
  },
  separatorView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },
  separatorLine: {
    flex: 1,
    borderBottomColor: "#ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  separatorText: {
    marginHorizontal: 12,
    color: "#666",
    fontSize: 14, // Slightly smaller text for separation
  },
  socialButtons: {
    marginTop: 25,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50,
    borderRadius: 30, // Rounded edges
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 12, // Spacing between social buttons
    elevation: 2, // Button elevation
  },
  btnOutlineText: {
    color: "#333",
    fontSize: 16,
  },
  btnIcon: {
    marginRight: 15,
  },
  imageIcon: {
    width: 28,
    height: 28,
    marginRight: 15,
  },
});

export default Page;
