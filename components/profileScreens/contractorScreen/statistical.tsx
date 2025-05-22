import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileStatisticalProps {
  copyToClipboard: () => void;
  notificationData: Array<String>;
}

const ProfileStatistical = ({ data = [] }) => {
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
