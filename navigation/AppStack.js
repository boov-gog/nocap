import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  HomeScreen,
  MyCapScreen,
  SubscriptionScreen,
  WaitingRoom,
  WhatTheySayScreen,
} from "../screens";
import { StackNav } from "./NavigationKeys";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={StackNav.Home} component={HomeScreen} />
      <Stack.Screen name={StackNav.WaitingRoom} component={WaitingRoom} />
      <Stack.Screen name={StackNav.MyCaps} component={MyCapScreen} />
      <Stack.Screen name={StackNav.WhatTheySay} component={WhatTheySayScreen} />
      <Stack.Screen
        name={StackNav.Subscription}
        component={SubscriptionScreen}
      />
    </Stack.Navigator>
  );
};
