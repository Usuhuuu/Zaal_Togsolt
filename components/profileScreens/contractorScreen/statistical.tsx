import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import axiosInstance from "@/app/(modals)/functions/axiosInstance";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileStatisticalProps {
  copyToClipboard: () => void;
  notificationData: Array<String>;
}

const ProfileStatistical = ({ data = [] }) => {
  const [value, setValue] = useState<string[]>([]);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const [reallySend, setReallySend] = useState<boolean>(false);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          User Type Select
        </Text>
      );
    }
    return null;
  };
  const userTypes = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Contractor", value: "contractor" },
  ];
  const handleSubmit = async () => {
    try {
      console.log("Sending notification:", formData);
      const response = await axiosInstance.post("/auth/send-notification", {
        formData,
      });
      if (response.status == 200) {
        console.log("Notification sent:", response.data);
      }
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };
  const conformSend = () => {
    Alert.alert("Send notification", "unheer shaah ymu?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          setReallySend(true);
          handleSubmit();
        },
        style: "destructive",
      },
    ]);
  };
  const handleTitleChange = (e: any) => {
    setFormData({ ...formData, title: e });
  };
  const handleSubtitleChange = (e: any) => {
    setFormData({ ...formData, sub_title: e });
  };
  const handleBodyChange = (e: any) => {
    setFormData({ ...formData, body: e });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View>
          <Text>Statistical Screen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light,
    height: Dimensions.get("window").height,
  },
  container: {},
  text: {
    fontSize: 18, // Larger text size
    color: "#333", // Darker text color
  },
  label: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
});

export default ProfileStatistical;
