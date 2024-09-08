import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  VerifyScreen,
  MyCapScreen,
  ReplyScreen,
  SubscriptionScreen,
  WaitingRoom,
  WhatTheySayScreen,
  GameScreen,
} from "../screens";
import { StackNav } from "./NavigationKeys";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={StackNav.WaitingRoom}
    >
      <Stack.Screen name={StackNav.Verify} component={VerifyScreen} />
      <Stack.Screen name={StackNav.WaitingRoom} component={WaitingRoom} />
      <Stack.Screen name={StackNav.MyCaps} component={MyCapScreen} />
      <Stack.Screen name={StackNav.WhatTheySay} component={WhatTheySayScreen} />
      <Stack.Screen
        name={StackNav.Subscription}
        component={SubscriptionScreen}
      />
      <Stack.Screen name={StackNav.ReplyTo} component={ReplyScreen} />
      <Stack.Screen name={StackNav.GamePage} component={GameScreen} />
    </Stack.Navigator>
  );
};
