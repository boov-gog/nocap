import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components";
import { Images } from "../config";

const StartScreen = () => {
  return (
    <SafeAreaView>
      <Logo uri={Images.logo} />
    </SafeAreaView>
  );
};

export default StartScreen;

const styles = StyleSheet.create({});
