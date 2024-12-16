import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// add firebase config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey,
  authDomain: Constants.expoConfig?.extra?.authDomain,
  projectId: Constants.expoConfig?.extra?.projectId,
  storageBucket: Constants.expoConfig?.extra?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.appId,
};

// console.log("Constants: ", Constants);

let auth;

if (!getApps().length) {
  const app = initializeApp(firebaseConfig); // Initialize the app

  // Initialize auth with persistence if the app was just created
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  console.log("Firebase initialized: ", auth);
} else {
  console.log("Firebase already initialized.");
  auth = initializeAuth(getApps()[0], {
    persistence: getReactNativePersistence(AsyncStorage), // Ensure persistence for existing app
  }); // Use the existing app to initialize auth
}

export { auth };
