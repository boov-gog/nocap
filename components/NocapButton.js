import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Images } from "../config";

const NocapButton = ({ onPress, title }) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    onPress();
  };

  const handleBlur = () => {
    setPressed(false);
  };

  return (
    <TouchableOpacity onPress={handlePress} onBlur={handleBlur}>
      {pressed ? (
        <View style={styles.pressedContainer}>
          <Image source={Images.buttonBack} style={styles.buttonBack} />
          <Text style={styles.pressedTitle}>{title}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NocapButton;

const styles = StyleSheet.create({
  container: {
    width: 430,
    height: 128,
    paddingHorizontal: 46.5,
    paddingVertical: 30,
    borderRadius: 100,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  pressedContainer: {
    width: 430,
    height: 128,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBack: {
    width: 430,
    height: 128,
    position: "absolute",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
  },
  pressedTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "white",
  },
});
