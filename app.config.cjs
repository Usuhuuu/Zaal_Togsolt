import 'dotenv/config'; // Ensure you have this if using .env files

export default {
  expo: {
    entryPoint: "./app/_layout.tsx",
    name: "Zaalproject",
    slug: "Zaalproject",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    update:{
      enabled: true,
      checkOnLaunch: "ALWAYS",
      fallbackToCacheTimeout: 0
    },
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      bundleIdentifier: "com.usuhbayr.zaalproject"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    android: {
      package: "com.usuhbayr.zaalproject",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      ["@react-native-google-signin/google-signin",{
        iosUrlScheme: "com.googleusercontent.apps._some_id_here_"
      }],
      ["react-native-fbsdk-next",{
        appID: "8534089993319728",
          clientToken: "61512c22202b566ea162d58871409595",
          displayName: "Login with Facebook",
          scheme: "fb8534089993319728",
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
          iosUserTrackingPermission: "This identifier will be used to deliver personalized ads to you."
      },],
      "expo-tracking-transparency"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
       apiUrl: process.env.API_URL || "http://localhost:3001",
       eas: {
        projectId: "71f5f6ae-97cc-4683-bb1e-e8af92dc2bec"
      }
    }
  }
};
