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
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,

    },
    assetBundlePatterns: [
      "**/*"
    ],
    android: {
      package: "com.yourcompany.zaalproject",
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
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
       apiUrl: process.env.API_URL || "http://localhost:3001"
    }
  }
};
