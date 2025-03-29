import { useAuth } from "@/app/(modals)/context/authContext";
import axiosInstance from "@/app/(modals)/functions/axiosInstanc";
import { fetchRoleAndProfile } from "@/app/(modals)/functions/profile_data_fetch";
import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import useSWR from "swr";

const UserInfoScreen = () => {
  const { t } = useTranslation();
  const [path, setPath] = useState<string>("main");
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isitEditable, setIsitEditable] = useState<boolean>(false);
  const { LoginStatus } = useAuth();

  const [formData, setFormData] = useState<any>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    unique_user_ID: "",
  });

  const userInfo: any = t("userInfo", { returnObjects: true });

  const { data, error, isLoading } = useSWR(
    LoginStatus ? [`RoleAndProfile_${path}`, LoginStatus] : null,
    {
      fetcher: () => fetchRoleAndProfile(path, LoginStatus),
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      refreshWhenHidden: false,
      dedupingInterval: 10000,
      errorRetryInterval: 4000,
      errorRetryCount: 3,
    }
  );
  useEffect(() => {
    if (data) {
      const parsedData =
        typeof data.profileData == "string"
          ? JSON.parse(data.profileData)
          : data.profileData;
      setUserData(parsedData);
      setFormData(parsedData);
    } else if (error) {
      console.log("Error fetching role and profile data:", error);
    }
    // Set loading state based on isLoading
    setLoading(isLoading);
  }, [data, error, isLoading]);

  if (loading) {
    return (
      <>
        <ActivityIndicator size="large" color={Colors.primary} />
      </>
    );
  }

  interface UserEditInput {
    label: string;
    value: string;
  }

  const userEditDetails: { inputs: UserEditInput[] } = {
    inputs: [
      {
        label: userInfo.email,
        value: userData.email,
      },
      {
        label: userInfo.firstName,
        value: userData.firstName,
      },
      {
        label: userInfo.lastName,
        value: userData.lastName,
      },
      {
        label: userInfo.phoneNumber,
        value: userData.phoneNumber,
      },
      {
        label: userInfo.userName,
        value: userData.unique_user_ID,
      },
    ],
  };
  const handleEdit = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(
        "/auth/updateProfile",
        formData
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditProfile = () => {
    if (isitEditable) {
      Alert.alert("Profile Updating", "Are you sure ?", [
        {
          text: t("yes"),
          onPress: () => {
            handleSubmit();
          },
        },
        {
          text: t("cancel"),
          onPress: () => setIsitEditable(!isitEditable),
        },
      ]);
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={{
              uri: "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            onPress={() => {
              setIsitEditable(!isitEditable);
              if (isitEditable) {
                Alert.alert("Profile Updating", "Are you sure ?", [
                  {
                    text: t("yes"),
                    onPress: () => {
                      handleSubmit();
                    },
                  },
                  {
                    text: t("cancel"),
                    onPress: () => setIsitEditable(!isitEditable),
                  },
                ]);
              }
            }}
            style={{
              padding: 15,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: Colors.primary,
              backgroundColor: isitEditable ? Colors.primary : "white",
            }}
          >
            <Text
              style={{
                color: isitEditable ? Colors.light : Colors.primary,
                fontWeight: "bold",
              }}
            >
              {isitEditable ? userInfo.saveProfile : userInfo.editProfile}
            </Text>
          </TouchableOpacity>
        </View>
        {userEditDetails.inputs.map(({ label, value }, index) => (
          <View key={index} style={styles.userInfoContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              placeholder={value}
              style={styles.textinput}
              value={formData[label] || value}
              placeholderTextColor={"#9acffd"}
              editable={isitEditable}
              onChangeText={(text) => handleEdit(label, text)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.light,
  },
  userInfoContainer: {
    flexDirection: "column",
    padding: 20,
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  textinput: {
    height: 40,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 5,
    color: "#9acffd",
    fontWeight: "black",
    padding: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});

export default UserInfoScreen;
