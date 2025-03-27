import "@/utils/i18";
import "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, ReactNode, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Sentry from "@sentry/react-native";
import Colors from "@/constants/Colors";
import { LanguageProvider } from "./(modals)/context/Languages";
export { ErrorBoundary } from "expo-router";

import { Provider } from "react-redux";
import { persistor, store } from "./(modals)/functions/store";
import { useTranslation } from "react-i18next";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "./(modals)/context/authContext";
import { useNavigation } from "@react-navigation/native";
import { SavedHallsProvider } from "./(modals)/functions/savedhalls";
import Layout, { TabsLayout } from "./(tabs)/_layout";

Sentry.init({
  dsn: "https://c2284e34e20ae8c69ed3d05f8971fbb2@o4508263161856000.ingest.us.sentry.io/4508263165132800",
  tracesSampleRate: 1.0,
});

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
    // Show an error message if an error is caught in the boundary
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 18 }}>
          Something went wrong!
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const [fontError, setFontError] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
      console.error("Error loading fonts:", error);
      setFontError(true);
      Alert.alert("Error loading fonts", "Please try again later");
    }
  }, [error, loaded]);

  if (!loaded || fontError) {
    // Show a loading/fallback UI if fonts are still loading or if there's an error
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/login"
        options={{
          headerTitle: "Burtguuleh",
          headerTitleAlign: "left",
          animation: "slide_from_bottom",
          headerTintColor: Colors.primary,
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => router.replace("/")}>
                <Ionicons name="home" size={24} color={Colors.primary} />
              </TouchableOpacity>
            );
          },
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
          title: `${t("notificationText")}`,

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
const ScreenTracker: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const state = navigation.getState();
    const currentScreen =
      state?.index !== undefined ? state.routeNames?.[state.index] : undefined;
    console.log("Current screen is:", currentScreen);
  }, [navigation]);

  return null; // You can return null as we just need the side effect
};

export default Sentry.wrap(() => (
  <Provider store={store}>
    <PersistGate
      persistor={persistor}
      loading={<ActivityIndicator size={24} color={Colors.primary} />}
    >
      <CustomErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <SavedHallsProvider>
              <RootLayout>
                <Layout />
                <TabsLayout />
              </RootLayout>
            </SavedHallsProvider>
          </LanguageProvider>
        </AuthProvider>
      </CustomErrorBoundary>
    </PersistGate>
  </Provider>
));
