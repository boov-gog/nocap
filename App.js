import 'intl-pluralrules';
import React, { useEffect, useRef } from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./providers";
import Toast from "react-native-toast-message";

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Adjust the path as necessary 

import usePushNotification from './hooks/usePushNotification';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'; 

LogBox.ignoreLogs([
  "Warning: ...",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreAllLogs(true);


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});



function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  console.log("registerForPush1"); 


  console.log("registerForPush1"); 

  // if (Device.isDevice) {
    const getPermission = await Notifications.getPermissionsAsync(); 

    let finalStatus = getPermission.status;
    if (finalStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    console.log("finalStatus: ", finalStatus); 

    if (finalStatus != 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId = Constants.expoConfig?.extra?.projectId; 

    console.log("projectId: ", projectId); 

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("pushTokenString: ", pushTokenString);
      return pushTokenString;
    } catch (e) {
      console.log(e);
      // handleRegistrationError(`${e}`);
    }
  // } else {
  //   handleRegistrationError('Must use physical device for push notifications');
  // }
}


const App = () => {
  // const {
  //   requestUserPermission,
  //   getFCMToken,
  //   listenToBackgroundNotifications,
  //   listenToForegroundNotifications,
  //   onNotificationOpenedAppFromBackground,
  //   onNotificationOpenedAppFromQuit,
  // } = usePushNotification();


  useEffect(() => {
    registerForPushNotificationsAsync(); 

    Notifications.addNotificationReceivedListener(notification => {
      console.log("notification: ", notification); 
    });




    // const listenToNotifications = async () => {
    //   try {
    //     const fcm = await getFCMToken();
    //     console.log("fcm token: ", fcm); 
    //     requestUserPermission();
    //     onNotificationOpenedAppFromQuit();
    //     listenToBackgroundNotifications();
    //     listenToForegroundNotifications();
    //     onNotificationOpenedAppFromBackground();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // listenToNotifications();

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
