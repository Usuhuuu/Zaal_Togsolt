import "@/utils/i18";
import "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, ReactNode, useState } from "react";
import { TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import * as Sentry from "@sentry/react-native";
import Colors from "@/constants/Colors";
import { LanguageProvider } from "./(modals)/context/Languages";
export { ErrorBoundary } from "expo-router";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "./(modals)/context/authContext";
import { SavedHallsProvider } from "@/app/(modals)/context/savedHall";
import Layout, { TabsLayout } from "./(tabs)/_layout";
import { CustomErrorBoundary } from "./(modals)/context/errorContext";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

Sentry.init({
  dsn: "https://c2284e34e20ae8c69ed3d05f8971fbb2@o4508263161856000.ingest.us.sentry.io/4508263165132800",
  tracesSampleRate: 1.0,
});

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
          presentation: "modal",
          headerTintColor: Colors.primary,
          headerShown: true,
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color={Colors.primary} />
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

export default Sentry.wrap(() => (
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
));
