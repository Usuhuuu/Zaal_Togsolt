import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, ReactNode } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import "react-native-reanimated";
import * as Sentry from "@sentry/react-native";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

Sentry.init({
  dsn: "https://c2284e34e20ae8c69ed3d05f8971fbb2@o4508263161856000.ingest.us.sentry.io/4508263165132800",
  tracesSampleRate: 1.0,
});

// Prevent splash screen auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

interface CustomErrorBoundaryProps {
  error?: Error;
  children: ReactNode;
}

function CustomErrorBoundary({ error, children }: CustomErrorBoundaryProps) {
  useEffect(() => {
    if (error) {
      Sentry.captureException(error); // Log boundary error to Sentry
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

function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const router = useRouter();

  useEffect(() => {
    if (error) {
      Sentry.captureException(error); // Log font load errors to Sentry
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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
          title: `Burtguuleh`,
          presentation: `modal`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
              <Ionicons name="arrow-back" size={28} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.light,
        }}
      />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: ` ` }} />
      <Stack.Screen
        name="(modals)/sags"
        options={{
          title: `sags`,
          presentation: `transparentModal`,
          animation: `fade`,
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
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default Sentry.wrap(() => (
  <CustomErrorBoundary>
    <SafeAreaView>
      <RootLayout />
    </SafeAreaView>
  </CustomErrorBoundary>
));
