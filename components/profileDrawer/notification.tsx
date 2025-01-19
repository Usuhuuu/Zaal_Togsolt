import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProfileNotificationProps {
  copyToClipboard: () => void;
  notificationData: Array<String>;
}

const ProfileNotification = ({ data = [] }) => {
  return (
    <View style={styles.container}>
      <Text>Info Screen</Text>
      <Text>{`Data Length: ${data?.length || 0}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileNotification;
