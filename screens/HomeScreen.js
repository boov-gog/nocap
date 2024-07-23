import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { signOut } from "firebase/auth";

import { auth } from "../config";
import { SafeAreaView } from "react-native-safe-area-context";

export const HomeScreen = () => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  return (
    <SafeAreaView style={styles.container}>
      <Button title="Sign Out" onPress={handleLogout} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
