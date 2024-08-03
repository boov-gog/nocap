import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, WaitingRoom } from "../screens";
import { StackNav } from "./NavigationKeys";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={StackNav.Home} component={HomeScreen} />
      <Stack.Screen name={StackNav.WaitingRoom} component={WaitingRoom} />
    </Stack.Navigator>
  );
};
