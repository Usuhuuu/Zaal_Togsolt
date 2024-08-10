import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons , Zocial} from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { API_URL } from "@env";
import { defaultStyles } from "@/constants/Styles";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHide, setPasswordHide] = useState(true);
  const [confirmPasswordHide, setConfirmPasswordHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordToggle = () => setPasswordHide(!passwordHide);
  const handleConfirmPasswordToggle = () => setConfirmPasswordHide(!confirmPasswordHide);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { timeout: 5000, withCredentials: true }
      );
      if (response.status === 200) {
        await AsyncStorage.setItem(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        Alert.alert("Login successful");
      } else {
        setError("Login failed");
        Alert.alert("Login failed", response.data.message || "Please try again");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
      Alert.alert("Login failed", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/zurag1.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.emailContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            value={email}
            autoFocus
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        <View style={styles.emailContainer}>
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
              color={Colors.grey}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.verificationContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="utasnii dugaar"
            style={ [defaultStyles.inputField, styles.input]}
          />
          <TouchableOpacity
            style={styles.verifyButton}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
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
            <Text style={styles.btnOutlineText}>zochnoor nevtreh</Text>
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
              source={require('../../assets/images/emongolia.png')}
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
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  emailContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
    color: Colors.grey,
  },
  socialButtons: {
    marginTop: 20,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
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
