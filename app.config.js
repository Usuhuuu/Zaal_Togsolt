import 'dotenv/config'; // Ensure you have this if using .env files

export default {
  expo: {
    entryPoint: "./app/_layout.tsx",
    name: "Zaalproject",
    slug: "zaalproject",
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
      bundleIdentifier: "com.usuhbayr.zaalproject",
      usesAppleSignIn: true
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
        iosUrlScheme:  `${process.env.GOOGLE_URL}`
      }],
      ["react-native-fbsdk-next",{
          appID: process.env.FACEBOOK_APP_ID || "8534089993319728",
          clientToken: process.env.FACEBOOK_CLIENT_ID,
          displayName: "Login with Facebook",
          scheme: `fb${process.env.FACEBOOK_APP_ID}`,
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
          iosUserTrackingPermission: "This identifier will be used to deliver personalized ads to you."
      },],
      "expo-tracking-transparency",
      ["expo-apple-authentication"]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
       apiUrl: process.env.API_URL || "http://localhost:3001",
       eas: {
        projectId: "4b0c6716-928b-4bce-a376-703b1fed5c6b"
      }
    }
  }
};
