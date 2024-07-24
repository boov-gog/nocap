import React from "react";
import { Image, StyleSheet } from "react-native";

import { Images } from "../config";

export const Logo = ({ uri }) => {
  return <Image source={uri} style={styles.image} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    position: 'absolute',
    top: 0,
  },
});
