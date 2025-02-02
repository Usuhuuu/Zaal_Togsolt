import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InfoScreen = ({ data = [] }) => {
  console.log("Received data:", data);

  return (
    <View style={styles.container}>
      <Text>Info Screen</Text>
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

export default InfoScreen;
