import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";
import { StackNav } from "./NavigationKeys";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={StackNav.Home} component={HomeScreen} />
    </Stack.Navigator>
  );
};
