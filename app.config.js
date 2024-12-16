import "dotenv/config";

export default {
  expo: {
    name: "Nocap", // Expo Firebase Starter
    slug: "expo-firebase",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.21.1",
    orientation: "portrait",
    icon: "./assets/flame.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#F57C00",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.djtalpha.nocap",
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
        NSContactsUsageDescription:
          "This app requires access to your contacts to function properly.",
      },
    },
    extra: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "52884eee-d53c-4233-b0da-4fbda6317000",
      },
    },
    android: {
      versionCode: 3,
      package: "com.djtalpha.nocap",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "READ_CONTACTS",
      ],
    },
  },
};
