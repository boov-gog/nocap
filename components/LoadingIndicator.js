import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import { Colors } from "../config";
import { View } from "./View";

export const LoadingIndicator = ({ extraStyle }) => {
  return (
    <View style={[styles.container, extraStyle]}>
      <ActivityIndicator size="large" color={Colors.orange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
