import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Sentry from "@sentry/react-native";
import { axiosInstanceRegular } from "./functions/axiosInstance";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "./context/authContext";
import {
  loginWithFacebook,
  loginWithGoogle,
  loginWithApple,
} from "./functions/third_party_instance";
import SignupModal from "./functions/signup_modal";
import { TextInput } from "react-native-paper";

type LoginInput = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  userID: string;
  signUpTimer: string;
};

const Page = () => {
  const { t } = useTranslation();
  const loginDetails: any = t("login", { returnObjects: true });
  const login = loginDetails[0];

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordHide, setPasswordHide] = useState<boolean>(true);
  const [isItApple, setIsITApple] = useState<boolean>(false);
  const [path, setPath] = useState<string>("");

  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [steps, setSteps] = useState<number>(0);
  const [formData, setFormData] = useState<LoginInput>({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    userID: "",
    signUpTimer: "",
  });

  const { logIn } = useAuth();
  useEffect(() => {
    if (Platform.OS == "ios") {
      setIsITApple(true);
    }
  }, [Platform.OS]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceRegular.post("/login", {
        email,
        userPassword: password,
      });
      if (response.data.success) {
        try {
          await SecureStore.setItemAsync(
            "Tokens",
            JSON.stringify({
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            })
          );
          logIn();
        } catch (err) {
          Sentry.captureException(err);
        }
        router.replace("..");
      } else if (!response.data.userNotFound && !response.data.success) {
        Alert.alert(`${response.data.message}`);
      } else if (response.status == 404) {
        Alert.alert("Check your internet connection");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Login Failed", "Please Try Again");
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setPasswordHide(!passwordHide);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "56931783205-14if86k43tt1pip0n5dj08tag8665vk8.apps.googleusercontent.com",
      offlineAccess: true,
      iosClientId:
        "56931783205-78eeaknokj0nah74h5d53eis9ebj77r6.apps.googleusercontent.com",
    });
  }, []);

  const handleFacebookLogin = async () => {
    try {
      const facebookResponse = await loginWithFacebook();
      const returnData = facebookResponse?.data;
      console.log(returnData);
      if (facebookResponse?.modalVisible) {
        setFormData({
          ...formData,
          userID: returnData.data.userID,
          email: returnData.data.email || "",
          firstName: returnData.data.firstName || "",
          lastName: returnData.data.lastName || "",
          signUpTimer: returnData.data.signUpTimer || "",
        });
        setPath(facebookResponse.path || "");
        setTimeout(() => {
          setIsModalVisible(true);
        }, 500);
      } else if (
        facebookResponse?.data.message ===
        "Successfully logged in with Facebook"
      ) {
        logIn();
        Alert.alert(`${facebookResponse?.data.message}`);
      }
    } catch (err) {
      console.log(err);
    }
    return;
  };
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      const googleAccessToken = accessToken;
      if (googleAccessToken) {
        const responseGoogle = await loginWithGoogle(googleAccessToken);
        const responseData = responseGoogle?.data;
        if (responseGoogle?.modalVisible && responseData?.data.signUpTimer) {
          setFormData({
            ...formData,
            userID: responseData.data.googleID,
            email: responseData.data.email || "",
            firstName: responseData.data.firstName || "",
            lastName: responseData.data.lastName || "",
            signUpTimer: responseData.data.signUpTimer || "",
          });
          setPath(responseGoogle.path || "");
          setTimeout(() => {
            setIsModalVisible(true);
          }, 500);
        } else if (
          responseGoogle?.success &&
          responseData?.message === "Successfully logged in with Google"
        ) {
          logIn();
          Alert.alert(`${responseGoogle?.data.message}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

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
            label={login.email}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor={Colors.grey}
            mode="outlined"
            theme={{
              colors: { primary: Colors.primary },
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            label={login.password}
            secureTextEntry={passwordHide}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor={Colors.grey}
            mode="outlined"
            theme={{
              colors: { primary: Colors.primary },
            }}
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

        <TouchableOpacity
          style={[styles.button, styles.loginBtn]}
          onPress={() => {
            handleSubmit();
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{login.login}</Text>
        </TouchableOpacity>
        <View style={styles.separatorView}>
          <View style={styles.separatorLine} />
          <Text style={[styles.separatorText, { fontSize: 18 }]}>or</Text>
          <View style={styles.separatorLine} />
        </View>
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={handleGoogleLogin}
          >
            <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>
              {login.continuewithgoogle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => {
              handleFacebookLogin();
            }}
          >
            <Ionicons name="logo-facebook" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>
              {login.continuewithfacebook}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => loginWithApple()}
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
      <SignupModal
        isModalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        formData={formData}
        setFormData={setFormData}
        steps={steps}
        setSteps={setSteps}
        path={path}
      />
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowOpacity: 0.8,
    shadowRadius: 5,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
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
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 12,
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
