import "../utils/i18";
import "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, ReactNode, useState } from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import * as Sentry from "@sentry/react-native";
import Colors from "@/constants/Colors";
import * as Notifications from "expo-notifications";
import { LanguageProvider } from "./settings/settings_pages/Languages";

Sentry.init({
  dsn: "https://c2284e34e20ae8c69ed3d05f8971fbb2@o4508263161856000.ingest.us.sentry.io/4508263165132800",
  tracesSampleRate: 1.0,
});
SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Error Boundary Component
interface CustomErrorBoundaryProps {
  error?: Error;
  children: ReactNode;
}

function CustomErrorBoundary({ error, children }: CustomErrorBoundaryProps) {
  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
    }
  }, [error]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Something went wrong. Please restart the app.</Text>
      </View>
    );
  }

  return <>{children}</>;
}

// Fix: Notification Permissions as a React Hook
function useNotificationPermissions() {
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert(
            "You need to enable permissions to receive notifications!"
          );
          return;
        }
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log("Expo push token: ", token);
      setNotificationToken(token.data);
    };

    getPermissions();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received", notification);
      }
    );

    return () => {
      notificationListener.remove();
    };
  }, []);

  return notificationToken;
}

function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
      console.error("Error loading fonts:", error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useNotificationPermissions();

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/login"
        options={{
          title: "Burtguuleh",
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
              <Ionicons name="arrow-back" size={28} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.light,
        }}
      />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: " " }} />
      <Stack.Screen
        name="(modals)/sags"
        options={{
          title: "sags",
          presentation: "transparentModal",
          animation: "fade",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="listing/notification"
        options={{
          headerShown: true,
          title: "Мэдэгдэлүүд",
          headerTitleStyle: { fontSize: 28, color: Colors.primary },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="listing/friendRequest"
        options={{
          title: "Friend Request",
          headerTitleStyle: { fontSize: 25, color: Colors.primary },
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

// Wrap the entire app in Sentry and Error Boundary
export default Sentry.wrap(() => (
  <CustomErrorBoundary>
    <LanguageProvider>
      <RootLayout />
    </LanguageProvider>
  </CustomErrorBoundary>
));
