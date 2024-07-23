import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  LoginScreen,
  SignupScreen,
  ForgotPasswordScreen,
  StartScreen,
} from "../screens";
import { StackNav } from "./NavigationKeys";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={StackNav.Login}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={StackNav.Start} component={StartScreen} />
      <Stack.Screen name={StackNav.Login} component={LoginScreen} />
      <Stack.Screen name={StackNav.Signup} component={SignupScreen} />
      <Stack.Screen
        name={StackNav.ForgotPassword}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};
