import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import { Images } from "../config";

const {width, height} = Dimensions.get('window');
const paddingBtnHorz = (12 / 100) * width;
const paddingBtnVert = (8 / 100) * width;

const NocapButton = ({ onPress, title }) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
  }

  const handlePressOut = () => {
    setPressed(false);
  }

  return (
    <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={pressed && {opacity:1}}>
      {pressed ? (
        <View style={styles.pressedContainer}>
          <Image source={Images.buttonBack} style={styles.buttonBack} resizeMode="contain"/>
          <Text style={styles.pressedTitle}>{title}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NocapButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 3.359,
    paddingHorizontal: paddingBtnHorz,
    paddingVertical: paddingBtnVert,
  },
  innerContainer:{
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  pressedContainer: {
    width: "100%",
    aspectRatio: 3.359,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBack: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  title: {
    fontFamily: "Kanit-Regular",
    fontSize: 32,
    fontWeight: "700",
  },
  pressedTitle: {
    fontFamily: "Kanit-Regular",
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
});
