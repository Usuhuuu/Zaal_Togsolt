import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Constants from "expo-constants";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const API_URL = "https://1627-118-176-174-110.ngrok-free.app";
//Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:3001";

const Page = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    phoneNumber: "",
    verificationCode: "",
    agree_terms: false,
    agree_privacy: false,
    is_adult: false,
  });
  const [loading, setLoading] = useState(false);
  const [passwordHide, setPasswordHide] = useState(true);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const [isItPossible, setIsItPossible] = useState(false);
  const axiosConfig = {
    timeout: 5000,
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirm_password) {
      Alert.alert("Error", "Passwords must match.");
      return;
    }

    if (!formData.agree_terms || !formData.agree_privacy) {
      Alert.alert("Error", "Please agree to the terms and privacy policy.");
      return;
    }

    if (!verificationCompleted) {
      Alert.alert("Error", "Phone number verification required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, formData, {
        ...axiosConfig,
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
      } else if (response.status === 401) {
        Alert.alert("Error", "User already exists.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setPasswordHide(!passwordHide);
  };

  const handleSendMSJ = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/verification`,
        { phoneNumber: formData.phoneNumber },
        {
          ...axiosConfig,
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setVerificationCompleted(true);
        Alert.alert("Success", "Verification code sent.");
      } else {
        Alert.alert("Error", "Failed to send verification code.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        "An error occurred while sending verification code."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleUserID = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/checkunique`,
        { unique_user_ID: formData.user_id },
        { timeout: 5000, withCredentials: true }
      );
      if (response.data.user_id_available) {
        console.log(response.data);
        setIsItPossible(true);
      } else if (!response.data.user_id_available) {
        Alert.alert("User already exists.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/zurag2.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.container_Vieww}>
          <TextInput
            autoCapitalize="none"
            placeholder="ID"
            value={formData.user_id}
            onChangeText={(value) => handleInputChange("user_id", value)}
            clearTextOnFocus={true}
            //eniig hiiseneer button dahij darj bolno
            onPressIn={() => setIsItPossible(false)}
            style={[styles.input_field_user_id, { marginBottom: 10 }]}
          />
          <TouchableOpacity
            onPress={handleUserID}
            style={styles.user_id_button}
            disabled={isItPossible}
          >
            <Text>Check ID</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          autoCapitalize="none"
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange("lastName", value)}
          style={[defaultStyles.inputField, { marginBottom: 10 }]}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange("firstName", value)}
          style={[defaultStyles.inputField, { marginBottom: 10 }]}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          style={[defaultStyles.inputField, { marginBottom: 10 }]}
        />
        <View style={styles.verificationContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange("phoneNumber", value)}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSendMSJ} style={styles.verifyButton}>
            <Text style={styles.verifyButtonText}>Send Verification Code</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verificationContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Verification Code"
            value={formData.verificationCode}
            onChangeText={(value) =>
              handleInputChange("verificationCode", value)
            }
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => setVerificationCompleted(true)}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry={passwordHide}
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
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
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Confirm Password"
            secureTextEntry={passwordHide}
            value={formData.confirm_password}
            onChangeText={(value) =>
              handleInputChange("confirm_password", value)
            }
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
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() =>
              handleInputChange("agree_terms", !formData.agree_terms)
            }
            style={styles.termsContainer}
          >
            <Ionicons
              name={formData.agree_terms ? "checkbox" : "square-outline"}
              size={24}
              color={formData.agree_terms ? Colors.primary : "#fff"}
            />
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL("https://your-terms-and-conditions-url.com")
                }
              >
                Terms and Conditions
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleInputChange("agree_privacy", !formData.agree_privacy)
            }
            style={styles.termsContainer}
          >
            <Ionicons
              name={formData.agree_privacy ? "checkbox" : "square-outline"}
              size={24}
              color={formData.agree_privacy ? Colors.primary : "#fff"}
            />
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL("https://your-privacy-policy-url.com")
                }
              >
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={defaultStyles.btn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={defaultStyles.btnText}>Submit</Text>
          )}
        </TouchableOpacity>
        <View style={styles.separatorView}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>Or sign up with</Text>
          <View style={styles.separatorLine} />
        </View>
        <View style={[styles.socialContainer, { gap: 20 }]}>
          <TouchableOpacity style={styles.btnOutline}>
            <Ionicons name="logo-google" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Ionicons name="logo-facebook" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Image
              source={require("../../assets/images/emongolia.png")}
              style={styles.imageIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
  },
  container_Vieww: {
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
  user_id_button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  input_field_user_id: {
    backgroundColor: "white",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: "30%",
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
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  verifyButton: {
    marginLeft: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignContent: "center",
    borderColor: "#000",
    borderWidth: 1,
  },
  verifyButtonText: {
    color: "#fff",
  },
  btnOutline: {
    backgroundColor: `#FFC857`,
    borderWidth: 1,
    borderRadius: 24,
    padding: 15,
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
  link: {
    color: "#000",
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: {
    width: 24,
    height: 24,
  },
});

export default Page;
