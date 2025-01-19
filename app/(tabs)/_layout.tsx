import React, { useEffect, useState } from "react";
import { StyleSheet, Image, Text } from "react-native";
import { Tabs } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { SavedHallsProvider } from "@/app/(modals)/functions/savedhalls"; // Import your SavedHallsProvider
import ExploreHeader from "@/components/ExploreHeader"; // Import your ExploreHeader component
import InfoScreen from "@/components/InfoScreen"; // Example drawer screen
import Dtraining from "@/components/training";
import CustomDrawerContent from "@/components/CostumDrawerContent";
import MainSettings from "../settings/mainSettings";
import useSWR from "swr";
import ProfileNotification from "@/components/profileDrawer/notification";
import { useSWRConfig } from "swr/dist/_internal";
import { fetchRoleAndProfil } from "../(modals)/functions/UserProfile";

// Create a Drawer Navigator
const Drawer = createDrawerNavigator();
const TabsLayout = () => (
  <Tabs
    screenOptions={{
      tabBarInactiveTintColor: Colors.dark,
      tabBarActiveTintColor: Colors.light,
      tabBarStyle: {
        height: 50,
        paddingBottom: 5,
        paddingTop: 5,
        borderColor: Colors.primary,
        position: "absolute",
        overflow: "hidden",
      },
      tabBarBackground: () => (
        <LinearGradient
          colors={[Colors.secondary, Colors.primary]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill]}
        />
      ),
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        tabBarLabel: "Undsen Tses", // Home Tab
        header: () => (
          <ExploreHeader
            onCategoryChanged={(category) => console.log(category)}
          />
        ),
        tabBarIcon: () => (
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
        tabBarIcon: () => (
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
        tabBarIcon: () => (
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
        tabBarIcon: () => (
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
);

const Layout = () => {
  const { cache } = useSWRConfig();
  const [userRole, setUserRole] = useState<string>("user");

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR("RoleAndProfile_main", {
    fetcher: () => fetchRoleAndProfil("main"),
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 10000,
    errorRetryInterval: 4000,
    errorRetryCount: 3,
  });

  useEffect(() => {
    if (userData) {
      setUserRole(userData.role);
    } else if (userError) {
      console.error("Error fetching user data:", userError);
    }
  }, [userData]);

  if (userLoading) {
    return <Text>Loading...</Text>;
  }
  const renderScreens = () => {
    if (userRole === "admin") {
      return (
        <>
          <Drawer.Screen
            name="Homesda"
            component={TabsLayout}
            options={{
              drawerLabel: "Home",
              headerShown: false,
              drawerIcon: () => (
                <Image
                  source={require("../../assets/tab-icons/home.png")}
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="notification"
            component={ProfileNotification}
            options={{
              drawerLabel: "Notification",
              headerShown: true,
              drawerIcon: () => (
                <Image
                  source={require("../../assets/sport-icons/notifications.png")}
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
        </>
      );
    } else if (userRole === "user") {
      return (
        <>
          <Drawer.Screen
            name="Home"
            component={TabsLayout}
            options={{
              drawerLabel: "Home",
              headerShown: false,
              drawerIcon: () => (
                <Image
                  source={require("../../assets/tab-icons/home.png")}
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Medeelel"
            component={InfoScreen}
            options={{
              drawerLabel: "Medeelel",
              headerShown: false,
              drawerIcon: () => (
                <Image
                  source={require("../../assets/tab-icons/news.png")}
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Surgalt"
            component={Dtraining}
            options={{
              headerShown: false,
              drawerIcon: () => (
                <Image
                  source={require("../../assets/tab-icons/training.png")}
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Tohirgoo"
            component={MainSettings}
            options={{
              headerShown: false,
              drawerIcon: () => (
                <Image
                  source={require("../../assets/tab-icons/settings.png")}
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
        </>
      );
    }
    return null;
  };

  return (
    <SavedHallsProvider>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerLabelStyle: {
            marginLeft: -10,
          },
          drawerType: "slide",
          headerShown: false, // Hide header for drawer screens
          drawerStyle: {
            backgroundColor: "#eefafb",
          },
        }}
      >
        {renderScreens()}
      </Drawer.Navigator>
    </SavedHallsProvider>
  );
};

export default Layout;
