import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Images } from "../config";

const NocapButton = ({ onPress, title, titleStyle, containerWidth }) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  if (containerWidth == null || containerWidth == 0) {
    containerWidth = Dimensions.get("window").width;
  }

  const paddingBtnHorz = (11 / 100) * containerWidth;
  const paddingBtnVert = (6 / 100) * containerWidth;

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      aspectRatio: 3.75, // 3.359
      paddingHorizontal: paddingBtnHorz,
      paddingVertical: paddingBtnVert,
    },
    innerContainer: {
      width: "100%",
      height: "100%",
      borderRadius: 100,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
    },
    pressedContainer: {
      width: "100%",
      aspectRatio: 3.359,
      position: "relative",
    },
    buttonBack: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    title: {
      fontFamily: "Kanit-Bold",
      fontSize: 28, // 32
      // fontWeight: "700",
    },
    pressedTitle: {
      fontFamily: "Kanit-Bold",
      fontSize: 28, //32
      // fontWeight: "700",
      color: "white",
    },
    pressedTitleContainer: {
      width: "100%",
      height: "100%",
      paddingHorizontal: paddingBtnHorz + 5,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={pressed && { opacity: 1 }}
    >
      {pressed ? (
        <View style={styles.pressedContainer}>
          <Image
            source={Images.buttonBack}
            style={styles.buttonBack}
            resizeMode="contain"
          />
          <View style={styles.pressedTitleContainer}>
            <Text
              style={[styles.pressedTitle, titleStyle]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text
              style={[styles.title, titleStyle]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NocapButton;
