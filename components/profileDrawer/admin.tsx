import axiosInstance from "@/app/(modals)/functions/axiosInstanc";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileAdminProps {
  copyToClipboard: () => void;
  formData: String;
}

const ProfileAdmin: React.FC<ProfileAdminProps> = ({
  copyToClipboard,
  formData,
}) => {
  const [notificationData, setNotificationData] = useState<Array<String>>([]);
  const sendNotification = async () => {
    try {
      const response = await axiosInstance.post("/auth/send-notification", {});
      console.log("Notification sent:", response.data);
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topContainer}>
        <Text style={styles.headerText}>Admin Dashboard</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        {/* Send Notification */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={sendNotification}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Send Notification</Text>
        </TouchableOpacity>

        {/* Perform Other Action */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Other Action</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    height: 60,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 30,
    width: "80%",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileAdmin;
