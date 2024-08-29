import React from "react";
import { StyleSheet } from "react-native";

import { View } from "./View";
import { BarIndicator } from "react-native-indicators";

export const LoadingIndicator = ({ extraStyle }) => {
  return (
    <View style={[styles.container, extraStyle]}>
      <BarIndicator color="#FF9922" size={50} count={6} />
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
