import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Page = () => {
  return (
    <View>
      <Link href={"/(modals)/login"}>login</Link>
      <Link href={"/(modals)/signup"}>burtgekh</Link>
      <Link href={"/(modals)/chat"}>chat Page</Link>
    </View>
  );
};

export default Page;
