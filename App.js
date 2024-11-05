import 'intl-pluralrules';
import React from "react"; 
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./providers";
import Toast from "react-native-toast-message"; 

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Adjust the path as necessary

LogBox.ignoreLogs([
  "Warning: ...",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreAllLogs(true); 

const App = () => {
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
