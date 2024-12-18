import React from 'react';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

import { showSuccessToast } from '../utils';

const usePushNotification = () => {
  const requestUserPermission = async () => {
    console.log("call requestUserPermission: ", Platform.OS); 

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ); 

    console.log("res1: ", res);

    // if (Platform.OS === 'ios') {
    //   //Request iOS permission
    //   const authStatus = await messaging().requestPermission();
    //   const enabled =
    //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //   if (enabled) {
    //     console.log('Authorization status:', authStatus);
    //   }
    // } else if (Platform.OS === 'android') {
    //   //Request Android permission (For API level 33+, for 32 or below is not required)
      // const res = await PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      // );
    // }
  }

  const getFCMToken = async () => {
    console.log("call getFCMToken"); 

    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();

      console.log("fcmToken result: ", fcmToken); 
  
      if (fcmToken) {
        console.log('Your Firebase Token is:', fcmToken);
      } else {
        console.log('Failed', 'No token received');
      }
  
      return fcmToken; 
    } catch(err) {
      console.log("err: ", err); 
    }

  };

  const listenToForegroundNotifications = async () => {
    console.log("call listenToForegroundNotifications"); 

    messaging().onme

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );

      showSuccessToast(remoteMessage.notification.body); 

      // Alert.alert(
      //   remoteMessage.notification.title,
      //   remoteMessage.notification.body,
      //   [{ text: 'OK' }]
      // );
    });

    console.log("unsubscribe"); 

    return unsubscribe;
  }

  const listenToBackgroundNotifications = async () => { 
    console.log("call listenToBackgroundNotifications"); 

    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'A new message arrived! (BACKGROUND)',
          JSON.stringify(remoteMessage),
        );
      },
    );

    console.log("unsubscribe"); 

    return unsubscribe;
  }

  const onNotificationOpenedAppFromBackground = async () => { 
    console.log("call onNotificationOpenedAppFromBackground"); 

    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'App opened from BACKGROUND by tapping notification:',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromQuit = async () => {
    console.log("call onNotificationOpenedAppFromQuit"); 

    const message = await messaging().getInitialNotification();

    console.log("message: ", message); 

    if (message) {
      console.log('App opened from QUIT by tapping notification:', JSON.stringify(message));
    }
  };

  return {
    requestUserPermission,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit, 
  };
};

export default usePushNotification;