import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";

const Page = () => {
  const axiosConfig = {
    timeout: 5000,
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [er, setEr] = useState("");
  const [loading, setLoading] = useState(true);
  const [passwordHide, setPasswordHide] = useState(true);
  const [isVerified, setISVerified] = useState(false);
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { ...axiosConfig, withCredentials: true }
      );
      console.log("respond status", response.status);
      if (response.status === 200) {
        await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        setLoading(false);
        Alert.alert("Login successful");
      } else {
        setEr("Login failed");
        Alert.alert(er);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const navigation = useNavigation();
  const handleEmail = (inputText: string) => {
    setEmail(inputText);
  };
  const handlePassword = (inputText: string) => {
    setPassword(inputText);
  };
  const handlePasswordToggle = () => {
    setPasswordHide(!passwordHide);
  };

  const mobileVerify = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/phoneVerification`,
        { phoneNumber },
        { ...axiosConfig, withCredentials: true }
      );
      response.status === 200
        ? Alert.alert("Verification Sent", "Verification sended")
        : Alert.alert("Error", "Verification code didn't sended");
    } catch (err) {
      console.log(err);
    }
  };

  const mobileVerifyCheck = async () => {
    try {
      const response = await axios.post(
        `${API_URL}`,
        { verifyCode },
        { ...axiosConfig, withCredentials: true }
      );
      response.status === 200
        ? setISVerified(true)
        : Alert.alert("Error", "Failed to verify");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Email Or User ID"
        value={email}
        autoFocus={true}
        onChangeText={(text) => handleEmail(text)}
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        secureTextEntry={passwordHide}
        value={password}
        onChangeText={(text) => handlePassword(text)}
        blurOnSubmit={true}
        clearTextOnFocus={true}
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />
      <TouchableOpacity onPress={handlePasswordToggle}>
        <Text>password harah</Text>
      </TouchableOpacity>
      <TouchableOpacity style={defaultStyles.btn} onPress={handleSubmit}>
        <Text style={defaultStyles.btnText}>Login shaa sda</Text>
      </TouchableOpacity>
      <View style={styles.separatorView}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separatorLine} />
      </View>
      <View style={{ gap: 20 }}>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="call-outline"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>dfidfhidhvidv</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="logo-facebook"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="call-outline"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Book a Court</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },
  separatorView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    gap: 10,
  },
  separatorLine: {
    flex: 1,
    borderBottomColor: "#000",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  separatorText: {
    marginHorizontal: 10,
    color: Colors.grey,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
  },
});

export default Page;
