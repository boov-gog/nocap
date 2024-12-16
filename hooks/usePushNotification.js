import React from 'react';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

// import firebase from '@react-native-firebase/app';

// const firebaseConfig = {
//   // Your Firebase configuration
//   apiKey: 'AIzaSyDjGVXOrtn4_CNEbdY1B5cIVEAv4mZuQxY',
//   authDomain: 'djt-alpha---adrian---no-cap.firebaseapp.com',
//   projectId: 'djt-alpha---adrian---no-cap',
//   storageBucket: 'djt-alpha---adrian---no-cap.appspot.com',
//   messagingSenderId: '1065420768217',
//   appId: '1:1065420768217:android:bac4aa2a04654108188fc8',
// };

// console.log("firebase_apps_length: ", firebase.apps.length);

// Make sure to initialize only once
// if (!firebase.apps.length) {
//   // console.log("firebase initialize");
//   firebase.initializeApp(firebaseConfig);

//   // console.log("firebase_apps_length_later: ", firebase.apps.length);

// }

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
    //   const res = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    //   );
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

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
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