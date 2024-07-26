import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

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
} from "../screens";
import { StackNav } from "./NavigationKeys";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={StackNav.Start}
      screenOptions={{ headerShown: false }}
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
    </Stack.Navigator>
  );
};
