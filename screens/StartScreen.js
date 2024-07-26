import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components";
import { Colors, Images } from "../config";
import NocapButton from "../components/NocapButton";
import { StackNav } from "../navigation/NavigationKeys";

export const StartScreen = (props) => {
  const handleStart = () => {
    props.navigation.navigate(StackNav.Login);
  };

  const { width } = Dimensions.get("window");

  return (
    <SafeAreaView style={styles.container}>
      <Logo uri={Images.logo} />
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
    backgroundColor: Colors.blackBlue,
    width: "100%",
    position: "relative",
  },
  btnContainer: {
    position: "absolute",
    bottom: 92,
  },
});
