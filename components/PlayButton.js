import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Images } from "../config";

const PlayButton = ({ onPress }) => {
  const [clicked, setClicked] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const playEnalbed = false;

  useEffect(() => {
    if (playEnalbed) {
      setImageSrc(
        clicked ? Images.playEnabledClcked : Images.playEnabledNormal
      );
    } else {
      setImageSrc(
        clicked ? Images.playDisabledClcked : Images.playDisabledNormal
      );
    }
  }, [clicked, playEnalbed]);

  const styles = StyleSheet.create({
    container: {
      position: "relative",
    },
    image: {
      width: 300,
      height: 300,
    },
    text: {
      fontFamily: "MPR-Bold",
      fontSize: clicked ? 32 : 40,
      color: playEnalbed ? "#A52727" : "#BCBCBC",
    },
    textContainer: {
      position: "absolute",
      width: 300,
      height: 286,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <TouchableOpacity
      onPress={() => {}}
      onPressIn={() => setClicked(true)}
      onPressOut={() => setClicked(false)}
      style={[clicked && { opacity: 1 }, styles.container]}
    >
      <Image style={styles.image} source={imageSrc} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Play!</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlayButton;
