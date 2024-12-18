import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Logo = ({ uri, style }) => {
  return (
    <Image source={uri} style={[styles.image, style]} resizeMode="contain" />
  );
};

const styles = StyleSheet.create({
  image: {
    marginVertical: windowHeight * 0.010, // 0.05
    marginHorizontal: windowWidth * 0.05,
    width: "90%", // 90%
    height: windowWidth * 0.7 * 0.30, // 0.9 * 0.31
  },
});
