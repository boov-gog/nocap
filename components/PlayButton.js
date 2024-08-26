import { Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { Images } from "../config";

const PlayButton = ({ onPress, playEnabled }) => {
  const [clicked, setClicked] = useState(false);
  const [imageSrc, setImageSrc] = useState(Images.playEnabledNormal);

  const handlePress = () => {
    if (playEnabled) {
      onPress();
    }
  };

  useEffect(() => {
    if (playEnabled) {
      setImageSrc(
        clicked ? Images.playEnabledClcked : Images.playEnabledNormal
      );
    } else {
      setImageSrc(
        clicked ? Images.playDisabledClcked : Images.playDisabledNormal
      );
    }
  }, [clicked, playEnabled]);

  const styles = StyleSheet.create({
    image: {
      width: 300,
      height: 300,
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      onPressIn={() => setClicked(true)}
      onPressOut={() => setClicked(false)}
    >
      <Image style={styles.image} source={imageSrc} />
    </TouchableWithoutFeedback>
  );
};

export default PlayButton;
