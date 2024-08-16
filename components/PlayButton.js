import { Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { Images } from "../config";

const PlayButton = ({ onPress }) => {
  const [clicked, setClicked] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const playEnalbed = true;

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
    image: {
      width: 300,
      height: 300,
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => setClicked(true)}
      onPressOut={() => setClicked(false)}
    >
      <Image style={styles.image} source={imageSrc} />
    </TouchableWithoutFeedback>
  );
};

export default PlayButton;
