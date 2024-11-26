import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { SavedHallsProvider } from "@/app/(modals)/functions/savedhalls"; // Import your SavedHallsProvider

const Layout = () => {
  return (
    <SavedHallsProvider> 
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarInactiveTintColor: Colors.dark,
            tabBarActiveTintColor: Colors.light,
            tabBarStyle: {
              height: 50,
              paddingBottom: 5,
              paddingTop: 5,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              borderColor: Colors.dark,
              borderWidth: 1,
              position: "absolute",
              left: 5,
              right: 5,
              bottom: 5,
              overflow: "hidden",
            },
            tabBarBackground: () => (
              <LinearGradient
                colors={["#fff", "#61b3fa"]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 1]}
                style={[StyleSheet.absoluteFill]}
              />
            ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarLabel: "Undsen Tses", // Home Tab
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require("../../assets/tab-icons/home.png")}
                  style={{ width: 24, height: 24 }}
                  accessibilityLabel="Home Tab"
                  accessibilityHint="Navigates to the home screen"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="inbox"
            options={{
              tabBarLabel: "Hamtdaa", // Inbox Tab
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require("../../assets/tab-icons/teamwork.png")}
                  style={{ width: 26, height: 26 }}
                  accessibilityLabel="Inbox Tab"
                  accessibilityHint="Navigates to the inbox screen"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              tabBarLabel: "Zahialga", // Explore Tab
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require("../../assets/tab-icons/order.png")}
                  style={{ width: 24, height: 24 }}
                  accessibilityLabel="Explore Tab"
                  accessibilityHint="Navigates to the explore screen"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              tabBarLabel: "minii huudas", // Profile Tab
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require("../../assets/tab-icons/athlete.png")}
                  style={{ width: 24, height: 24 }}
                  accessibilityLabel="Profile Tab"
                  accessibilityHint="Navigates to the profile screen"
                />
              ),
              headerShown: false, // Hide header for profile screen
            }}
          />
        </Tabs>
      </View>
    </SavedHallsProvider> 
  );
};

const styles = StyleSheet.create({
  icon: {
    color: `#fff`,
    fontSize: 24,
  }
});

export default Layout;
