import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { LoadingIndicator } from "../components";

import * as Font from "expo-font";
import { StackNav } from "./NavigationKeys";

import {
  LoginScreen,
  SignupScreen,
  ForgotPasswordScreen,
  StartScreen,
  AgeScreen,
  FirstNameScreen,
  LastNameScreen,
  GenderScreen,
  PasswordScreen,
  FriendScreen,
  ContactsPermissionScreen,
  PhoneScreen,
  SchoolScreen,
  LocationPermissionScreen,
  GradeScreen,
  VerifyScreen,
  MyCapScreen,
  ReplyScreen,
  SubscriptionScreen,
  WaitingRoom,
  WhatTheySayScreen,
  GameScreen,
  ProfileScreen,
  SearchFriendScreen,
  CapOfFriend,
  FriendCapDetail,
  ReplyDetail,
  ChangePasswordScreen,
  ChangeSchoolScreen,
  GroupScreen,
  GroupQuestionsScreen
} from "../screens";

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Kanit-Regular": require("../assets/font/Kanit-Regular.ttf"),
        "Kanit-Bold": require("../assets/font/Kanit-Bold.ttf"),
        "MPR-Regular": require("../assets/font/MPLUSRounded1c-Regular.ttf"),
        "MPR-Bold": require("../assets/font/MPLUSRounded1c-Bold.ttf"),
        // Add other Kanit styles as needed
      });
      console.log("font is loaded.");
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={StackNav.Start}
      >
        <Stack.Screen name={StackNav.Start} component={StartScreen} />
        <Stack.Screen name={StackNav.Login} component={LoginScreen} />
        <Stack.Screen name={StackNav.Signup} component={SignupScreen} />
        <Stack.Screen name={StackNav.Age} component={AgeScreen} />
        <Stack.Screen name={StackNav.FirstName} component={FirstNameScreen} />
        <Stack.Screen name={StackNav.LastName} component={LastNameScreen} />
        <Stack.Screen name={StackNav.Gender} component={GenderScreen} />
        <Stack.Screen name={StackNav.Grade} component={GradeScreen} />
        <Stack.Screen
          name={StackNav.LocationPermission}
          component={LocationPermissionScreen}
        />
        <Stack.Screen name={StackNav.School} component={SchoolScreen} />
        <Stack.Screen name={StackNav.Phone} component={PhoneScreen} />
        <Stack.Screen
          name={StackNav.ContactsPermission}
          component={ContactsPermissionScreen}
        />
        <Stack.Screen name={StackNav.Friends} component={FriendScreen} />
        <Stack.Screen name={StackNav.Password} component={PasswordScreen} />
        <Stack.Screen
          name={StackNav.ForgotPassword}
          component={ForgotPasswordScreen}
        />

        <Stack.Screen name={StackNav.Verify} component={VerifyScreen} />
        <Stack.Screen name={StackNav.WaitingRoom} component={WaitingRoom} />
        <Stack.Screen name={StackNav.MyCaps} component={MyCapScreen} />
        <Stack.Screen
          name={StackNav.WhatTheySay}
          component={WhatTheySayScreen}
        />
        <Stack.Screen
          name={StackNav.Subscription}
          component={SubscriptionScreen}
        />
        <Stack.Screen name={StackNav.ReplyTo} component={ReplyScreen} />
        <Stack.Screen name={StackNav.GamePage} component={GameScreen} />
        <Stack.Screen name={StackNav.Profile} component={ProfileScreen} />
        <Stack.Screen
          name={StackNav.SearchFriend}
          component={SearchFriendScreen}
        />
        <Stack.Screen name={StackNav.CapOfFriend} component={CapOfFriend} />
        <Stack.Screen
          name={StackNav.FriendCapDetail}
          component={FriendCapDetail}
        />
        <Stack.Screen name={StackNav.ReplyDetail} component={ReplyDetail} />
        <Stack.Screen
          name={StackNav.ChangePassword}
          component={ChangePasswordScreen}
        />
        <Stack.Screen
          name={StackNav.ChangeSchool}
          component={ChangeSchoolScreen}
        />
        <Stack.Screen
          name={StackNav.Group}
          component={GroupScreen}
        />
        <Stack.Screen
          name={StackNav.GroupQuestions}
          component={GroupQuestionsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
