import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

const NocapButton = ({ onPress, title, buttonStyle = {}, textStyle = {}}) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    onPress();
  };

  const handleBlur = () => {
    setPressed(false);
  };

  return (
    <Pressable onPress={handlePress} onBlur={handleBlur}>
      {pressed ? (
        <View style={[styles.container, buttonStyle]}>
          <View style={styles.innerContainer}>
            <Text style={[styles.title, textStyle]}>{title}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={[styles.title, textStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default NocapButton;

const styles = StyleSheet.create({
  container: {
    width: 430,
    height: 128,
    paddingHorizontal: 46.5,
    paddingVertical: 30,
  },
  innerContainer: {
    borderRadius: 100,
    backgroundColor: "white",
  },
  pressedContainer: {},
  title: {
    fontFamily: "Kanit",
    fontSize: 32,
    fontWeight: 700,
  },
});
