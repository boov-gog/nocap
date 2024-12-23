import 'intl-pluralrules';
import React, { useEffect, useRef } from "react";
import { LogBox, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./providers";
import Toast from "react-native-toast-message";

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; 

import usePushNotification from './hooks/usePushNotification';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'; 

LogBox.ignoreLogs([
  "Warning: ...",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreAllLogs(true);


const App = () => {
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();


  useEffect(() => {




    const listenToNotifications = async () => {
      try {
        const fcm = await getFCMToken();
        console.log("fcm token: ", fcm); 
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();

  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthenticatedUserProvider>
        <SafeAreaProvider>
          <RootNavigator />
          <Toast />
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </I18nextProvider>
  );
};

export default App;
