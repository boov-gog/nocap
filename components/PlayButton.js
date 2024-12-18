import { Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Images } from "../config";

import { Audio } from 'expo-av';
import { AuthenticatedUserContext } from "../providers";

const PlayButton = ({ onPress, playEnabled }) => {
  const [clicked, setClicked] = useState(false);
  const [imageSrc, setImageSrc] = useState(Images.playEnabledNormal);

  let { onAudio } = useContext(AuthenticatedUserContext); 

  const handlePressIn = async () => {
    setClicked(true); 

    if (onAudio) {
      const sound = new Audio.Sound();
      if (!playEnabled) {
        await sound?.loadAsync(require('../assets/sounds/DJT/Bounces.mp3'));
      } else {
        await sound?.loadAsync(require('../assets/sounds/DJT/Game_Button.mp3'));
      }
      await sound.setVolumeAsync(1.0);
      await sound?.playAsync();
      sound?.setOnPlaybackStatusUpdate(status => {
        if (status?.didJustFinish) {
          sound?.unloadAsync();
        }
      });
    }
  }

  const handlePress = async () => {
    // console.log("handlePress: ", onAudio);

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
      width: 250, // 300 
      height: 250, // 300
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={() => setClicked(false)}
    >
      <Image style={styles.image} source={imageSrc} />
    </TouchableWithoutFeedback>
  );
};

export default PlayButton;
