import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";
import { Settings } from "react-native-fbsdk-next";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

type LoginInput = {
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};
const initSteps = [
  {
    steps: 0,
    title: "First Name",
    placeholder: "username",
    buttonText: "Check User Name",
  },
  {
    steps: 1,
    title: "Username",
    placeholder: "password",
    buttonText: "Next",
  },
  {
    steps: 2,
    title: "Final",
    placeholder: "Check the personal information",
    buttonText: "Create Account",
  },
];
const Page = () => {
  const { t } = useTranslation();
  const loginDetails: any = t("login", { returnObjects: true });
  const login = loginDetails[0];

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordHide, setPasswordHide] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isItApple, setIsITApple] = useState<boolean>(false);
  const [isitGoogle, setIsItGoogle] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(0);
  const [formData, setFormData] = useState<LoginInput>({
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [modalPasswordHide, setModalPasswordHide] = useState<boolean>(true);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const fadeCheckUsername = useRef(new Animated.Value(0)).current;
  const fadeConfirm = useRef(new Animated.Value(0)).current;

  const { logIn } = useAuth();

  useEffect(() => {
    Animated.timing(fadeCheckUsername, {
      toValue: formData.userName.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [formData.userName]);

  useEffect(() => {
    Animated.timing(fadeConfirm, {
      toValue: formData.password.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [formData.password]);

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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "56931783205-g9s9glhtlpmjh6vktt3osnh44go1fo7k.apps.googleusercontent.com",
      offlineAccess: true,
      iosClientId:
        "56931783205-78eeaknokj0nah74h5d53eis9ebj77r6.apps.googleusercontent.com",
    });
  }, []);

  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
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
          onPress={() => {
            handleSubmit();
            setKey((k) => k + 1);
          }}
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
          <TouchableOpacity style={styles.btnOutline} onPress={loginWithGoogle}>
            <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>
              {login.continuewithgoogle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={async () => {
              try {
                const facebookResponse = await loginWithFacebook();
                console.log(facebookResponse);
                if (facebookResponse?.modalVisible) {
                  setIsModalVisible(facebookResponse.modalVisible);
                  setFormData({
                    ...formData,
                    firstName: facebookResponse.data.firstName,
                    lastName: facebookResponse.data.lastName,
                  });
                }
              } catch (err) {
                console.log(err);
              }
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
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <View
          style={[
            styles.modalContainer,
            {
              marginBottom: bottom,
              borderBottomWidth: 1,
              borderColor: Colors.primary,
            },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                height: headerHeight,
              },
            ]}
          >
            <TouchableOpacity>
              <Ionicons
                name="arrow-back"
                size={28}
                color={Colors.primary}
                onPress={() => setIsModalVisible(false)}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {initSteps.map((item) => {
                return (
                  <View
                    key={item.steps}
                    style={{
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          steps === item.steps ? Colors.primary : Colors.white,
                        borderWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 25,
                        padding: 5,
                        paddingHorizontal: 10,
                        borderColor: Colors.primary,
                      }}
                    >
                      <Text style={{ color: Colors.grey, fontSize: 20 }}>
                        {item.steps}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor:
                          steps === item.steps ? Colors.primary : Colors.white,
                      }}
                    >
                      <Text>{item.title}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          {steps === 0 && (
            <View style={styles.modalInputContainer}>
              <TextInput style={styles.modalInput} value={formData.firstName} />
              <TextInput style={styles.modalInput} value={formData.lastName} />
              <View style={styles.modalButtonContainerFirst}>
                <TouchableOpacity
                  style={styles.modalNextButton}
                  onPress={() => {
                    setSteps(steps + 1);
                    console.log(formData);
                  }}
                >
                  <Text style={styles.modalButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {steps === 1 && (
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter the username"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.nativeEvent.text })
                }
              />
              <Animated.View
                style={{
                  opacity: fadeCheckUsername,
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setDisableButton(false);
                  }}
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: Colors.white, fontSize: 20 }}>
                    Check User Name
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalNextButton}
                  onPress={() => setSteps(steps - 1)}
                >
                  <Text style={styles.modalButtonText}>Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalNextButton}
                  onPress={() => {
                    setSteps(steps + 1);
                    console.log(formData);
                  }}
                  disabled={disableButton}
                >
                  <Text style={styles.modalButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {steps === 2 && (
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="password"
                onChangeText={(e) => setFormData({ ...formData, password: e })}
                secureTextEntry={modalPasswordHide}
              />
              <Animated.View style={{ opacity: fadeConfirm }}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="again password"
                />
              </Animated.View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalNextButton}
                  onPress={() => setSteps(steps - 1)}
                >
                  <Text style={styles.modalButtonText}>Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalNextButton}
                  onPress={() => {
                    setSteps(steps + 1);
                    console.log(formData);
                  }}
                >
                  <Text style={styles.modalButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
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

  modalContainer: {
    flex: 1,
    width: "95%",
    height: "100%",
    marginHorizontal: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalInputContainer: {
    gap: 20,
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
  },
  modalButtonContainerFirst: {
    alignItems: "flex-end",
  },
  modalNextButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: 20,
  },
});

export default Page;
