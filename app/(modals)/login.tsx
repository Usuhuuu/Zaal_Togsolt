import React, { useState } from "react";
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
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";
import Colors from "@/constants/Colors";

const Page = () => {
  // Access the API URL from the environment variables
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`, // Use apiUrl from environment variable
        { email, password },
        { ...axiosConfig, withCredentials: true }
      );
      if (response.status === 200) {
        await SecureStore.setItemAsync(
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
      setEr("An error occurred during login.");
      Alert.alert("Error", er);
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
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={mobileVerify}
          >
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
          <TouchableOpacity style={styles.btnOutline}>
            <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Ionicons name="logo-facebook" size={24} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Image
              source={require("../../assets/images/emongolia.png")}
              style={styles.imageIcon}
            />
            <Text style={styles.btnOutlineText}>Continue with E-Mongolia</Text>
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
