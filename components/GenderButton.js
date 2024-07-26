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

const GenderButton = ({ onPress, uri, width }) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const styles = StyleSheet.create({
    container: {
      width: width,
      aspectRatio: 1.25,
      paddingHorizontal: width * 0.05,
      paddingTop: width * 0.05,
      paddingBottom: width * 0.07,
    },
    innerContainer: {
      width: "100%",
      height: "100%",
      borderRadius: width * 0.2,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
    },
    pressedContainer: {
      width: width,
      aspectRatio: 1.25,
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonBack: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    innerImage: {
      width: width * 0.6,
      height: width * 0.6,
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
            source={Images.genderBtnBack}
            style={styles.buttonBack}
            resizeMode="stretch"
          />
          <Image source={uri} style={styles.innerImage} resizeMode="contain" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Image
              source={uri}
              style={styles.innerImage}
              resizeMode="contain"
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default GenderButton;
