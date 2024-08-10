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
import { API_URL } from "@env";

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    phoneNumber: "",
    agree_terms: false,
    agree_privacy: false,
    is_adult: false,
  });
  const [er, setEr] = useState("");
  const [loading, setLoading] = useState(true);
  const [passwordHide, setPasswordHide] = useState(true);
  const [verificationCompleted, setVerificationCompleted] = useState(false);

  const axiosConfig = {
    timeout: 5000,
  };
  const handleSubmit = async () => {
    if (formData.password !== formData.confirm_password) {
      Alert.alert("Error", "Must be same password");
    }
    try {
      if (verificationCompleted) {
        const response = await axios.post(
          `${API_URL}/auth/signup`,
          { formData },
          {
            ...axiosConfig,
            withCredentials: true,
            validateStatus: function (status) {
              return status < 500;
            },
          }
        );
        console.log("Response Status:", response.status);
        if (response.status === 200) {
          console.log("200", response.data.message);
          Alert.alert(response.data.message);
        } else if (response.status === 401) {
          Alert.alert("error", "user exist");
        }
      } else {
        Alert.alert("error", "Must verify PhoneNumber");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSendMSJ = async () => {
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
        Alert.alert("Success", "Verify completed");
      } else {
        Alert.alert("error", "try again");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    //ene bol email oruulah heseg
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Ovog"
        value={formData.lastName}
        style={[defaultStyles.inputField, { marginBottom: 20 }]}
        //enenees dooshooo continue button heseg ehlene
      />
      <TextInput
        autoCapitalize="none"
        value={formData.firstName}
        placeholder="Ner"
        style={[defaultStyles.inputField, { marginBottom: 20 }]}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        value={formData.email}
        style={[defaultStyles.inputField, { marginBottom: 20 }]}
      />
      <View style={styles.phoneSection}>
        <TextInput
          autoCapitalize="none"
          placeholder="Utasnii dugaar"
          value={formData.phoneNumber}
          style={[defaultStyles.inputField, { marginBottom: 20 }]}
        />
        <View style={styles.phoneButton}>
          <TouchableOpacity onPress={handleSendMSJ}>
            <Text>utas Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        autoCapitalize="none"
        placeholder="Nuuts ug"
        value={formData.password}
        style={[defaultStyles.inputField, { marginBottom: 20 }]}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Nuuts ug davtalt"
        value={formData.confirm_password}
        style={[defaultStyles.inputField, { marginBottom: 20 }]}
      />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text onPress={handleSubmit} style={defaultStyles.btnText}>
          urgeljluuleh
        </Text>
      </TouchableOpacity>
      <View style={styles.separatorView}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>busad argaar nevtreh</Text>
        <View style={styles.separatorLine} />
      </View>
      <View style={{ gap: 20 }}>
        {/* enedees ehleed log in hiih huvilbaruud garj ehelne fb google geh met */}
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Ionicons
            name="logo-facebook"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Ionicons
            name="call-outline"
            size={24}
            style={defaultStyles.btnIcon}
          />
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
    backgroundColor: `#FFC857`,
    borderWidth: 2,
    borderRadius: 24,
    padding: 15,
    gap: 20,
  },
  btnOutlineText: {
    color: `#000`,
    fontSize: 16,
  },
  phoneButton: {},
  phoneSection: {},
});

export default Page;
