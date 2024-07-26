import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

import { Images } from "../config";

const windowHeight = Dimensions.get("window").height;

export const Logo = ({ uri }) => {
  return <Image source={uri} style={styles.image} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  image: {
    marginTop: windowHeight * 0.15,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
