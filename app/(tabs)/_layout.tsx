import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router, Tabs } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { SavedHallsProvider } from "@/app/(modals)/functions/savedhalls"; // Import your SavedHallsProvider
import ExploreHeader from "@/components/ExploreHeader"; // Import your ExploreHeader component
import InfoScreen from "@/components/InfoScreen"; // Example drawer screen
import Dtraining from "@/components/training";
import CustomDrawerContent from "@/components/CostumDrawerContent";
import useSWR from "swr";
import { fetchRoleAndProfil } from "../(modals)/functions/UserProfile";
import { Ionicons } from "@expo/vector-icons";
import ProfileNotification from "@/components/profileScreens/drawerScreen/notification";
import ProfileStatistical from "@/components/profileScreens/contractorScreen/statistical";
import UserInfoScreen from "@/components/profileScreens/drawerScreen/userInfoScreen";
import { useTranslation } from "react-i18next";
import ProfileSettings from "../settings/profileSettings";
import { Provider } from "react-redux";
import { store } from "../(modals)/functions/store";

// Create a Drawer Navigator
const TabsLayout = () => {
  const { t } = useTranslation();
  return (
    <>
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
            tabBarLabel: t("home"),
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
            tabBarLabel: t("together"),
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
            tabBarLabel: `${t("order")}`, // Explore Tab
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
            tabBarLabel: `${t("profile")}`, // Profile Tab
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
    </>
  );
};

const Layout = () => {
  const [userRole, setUserRole] = useState<string>("default");

  const Drawer = createDrawerNavigator();
  const { t } = useTranslation();
  const drawerDef: any = t("DrawerScreen", { returnObjects: true });
  const drawer = Array.isArray(drawerDef) ? drawerDef[0] : [];
  const userDrawerLng = drawer?.userDrawer[0];
  const adminDrawerLng = drawer?.adminDrawer[0];
  const contractorDrawerLng = drawer?.contractorDrawer[0];

  const drawerScreens: any = {
    default: [
      { name: userDrawerLng.home, component: TabsLayout, icon: "home" },
      {
        name: userDrawerLng.settings,
        component: ProfileSettings,
        icon: "settings",
      },
    ],
    user: [
      { name: userDrawerLng.home, component: TabsLayout, icon: "home" },
      { name: userDrawerLng.news, component: InfoScreen, icon: "newspaper" },
      { name: userDrawerLng.academy, component: Dtraining, icon: "newspaper" },
      {
        name: userDrawerLng.settings,
        component: ProfileSettings,
        icon: "settings",
      },
    ],
    admin: [
      { name: adminDrawerLng.adminPage, component: TabsLayout, icon: "home" },
      {
        name: adminDrawerLng.userInfo,
        component: UserInfoScreen,
        icon: "person",
      },
      {
        name: adminDrawerLng.notificationPage,
        component: ProfileNotification,
        icon: "notifications",
      },
      {
        name: adminDrawerLng.settings,
        component: ProfileSettings,
        icon: "settings",
      },
    ],
    contractor: [
      {
        name: contractorDrawerLng.contractorPage,
        component: TabsLayout,
        icon: "home",
      },
      {
        name: contractorDrawerLng.statisticalPage,
        component: ProfileStatistical,
        icon: "checkmark-circle",
      },
      {
        name: contractorDrawerLng.userInfo,
        component: UserInfoScreen,
        icon: "person",
      },
      {
        name: contractorDrawerLng.settings,
        component: ProfileSettings,
        icon: "settings",
      },
    ],
  };

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
    }
    if (userError) {
      console.log("Error fetching user data:", userError);
    }
  }, [userData, userError]);

  if (userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  const noHeadRender = ["Home", "Нүүр хуудас", "홈"];

  const renderScreens = () => {
    const screensToRender = drawerScreens[userRole] || drawerScreens.default;
    return screensToRender?.map(
      ({
        name,
        component,
        icon,
      }: {
        name: string;
        component: React.FC;
        icon: string;
      }) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          options={{
            drawerLabel: name,
            headerShown: noHeadRender.includes(name) ? false : true,
            drawerIcon: () => (
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={Colors.primary}
              />
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="arrow-back"
                  size={28}
                  color={Colors.primary}
                  style={{
                    marginLeft: 15,
                  }}
                />
              </TouchableOpacity>
            ),
          }}
        />
      )
    );
  };

  return (
    <Provider store={store}>
      <SavedHallsProvider>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerLabelStyle: {
              marginLeft: -10,
            },
            drawerType: "slide",
            headerShown: false,
            drawerStyle: {
              backgroundColor: "#eefafb",
            },
          }}
        >
          {renderScreens()}
        </Drawer.Navigator>
      </SavedHallsProvider>
    </Provider>
  );
};

export default Layout;
