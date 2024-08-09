import "dotenv/config";

export default {
  expo: {
    name: "Expo Firebase Starter",
    slug: "expo-firebase",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.19.2",
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
    },
    extra: {
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
      versionCode: 2,
      package: "com.djtalpha.nocap",
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
    },
  },
};
