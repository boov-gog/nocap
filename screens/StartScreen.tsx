import { Button, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components";
import { Images } from "../config";
import NocapButton from "../components/NocapButton";

export const StartScreen = () => {
  const handleStart = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Logo uri={Images.logo}/>
      <View style={styles.btnContainer}>
        <NocapButton title="Start" onPress={handleStart} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000621",
    width: "100%",
    position: 'relative'
  },
  btnContainer: {
    position: "absolute",
    bottom: 20,
  },
});
