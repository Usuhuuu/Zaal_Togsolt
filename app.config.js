import 'dotenv/config';

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
    owner: "zaal_tugsult",
    update: {
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
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.usuhbayr.zaalproject",
        usesAppleSignIn: true,
        config: {
          usesNonExemptEncryption: false
        }
      },
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
      ["@react-native-google-signin/google-signin", {
        iosUrlScheme: 'com.googleusercontent.apps.56931783205-78eeaknokj0nah74h5d53eis9ebj77r6' || `${process.env.GOOGLE_URL}`,
      }],
      ["react-native-fbsdk-next", {
        appID: process.env.FACEBOOK_APP_ID || "8534089993319728",
        clientToken: process.env.FACEBOOK_CLIENT_ID,
        displayName: "Login with Facebook",
        scheme: `fb${process.env.FACEBOOK_APP_ID}`,
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true,
        iosUserTrackingPermission: "This identifier will be used to deliver personalized ads to you."
      }],
      "expo-tracking-transparency",
      ["expo-apple-authentication"],
      ["expo-build-properties", {
        android: {
          manifest: {
            "meta-data": [
              {
                "android:name": "com.google.android.geo.API_KEY",
                "android:value": process.env.GOOGLE_MAPS_API_KEY || "AIzaSyDezC8XCeVeRY1lh34mbxAjuhe1OWJhLRc",
              },
            ],
          },
        },
        ios: {
          infoPlist: {
            GMSApiKey: process.env.GOOGLE_MAPS_API_KEY,
            NSLocationWhenInUseUsageDescription: "Your app needs access to your location to show your position on the map",
            NSLocationAlwaysUsageDescription: "Your app needs access to your location for continuous location updates",
            FacebookAppID: process.env.FACEBOOK_APP_ID,
            FacebookClientToken: process.env.FACEBOOK_CLIENT_ID,
            FacebookDisplayName: "Login with Facebook",
            NSUserTrackingUsageDescription: "This identifier will be used to deliver personalized ads to you.",
            CFBundleURLTypes: [
              {
                CFBundleURLSchemes: [
                  "com.googleusercontent.apps.56931783205-78eeaknokj0nah74h5d53eis9ebj77r6", // Google Sign-In URL scheme
                  `fb${process.env.FACEBOOK_APP_ID}`, // Facebook login scheme
                  "com.usuhbayr.zaalproject", // Your app's bundle identifier
                  "exp+zaalproject", // Expo-specific URL scheme
                ]
              }
            ],
            LSApplicationQueriesSchemes: [
              "google",
              "com.googleusercontent.apps.56931783205-78eeaknokj0nah74h5d53eis9ebj77r6", // Query for Google Sign-In
            ],
          },
        },
      }],
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiUrl: process.env.API_URL,
      eas: {
        projectId: "e5e4a4a7-63c8-4cfa-9371-763389edd149"
      }
    }
  }
};