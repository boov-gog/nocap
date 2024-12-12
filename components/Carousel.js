// Carousel.js
import React, { useRef, useEffect, useState } from "react";
import { View, Image, StyleSheet, Animated, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

const Carousel = ({ images }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fadeOut();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
      fadeIn();
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={images[currentIndex]}
        style={[styles.image, { opacity: fadeAnim }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 80, // 100
  },
  image: {
    width: deviceWidth * 0.9,
    height: deviceWidth * 0.9 * 0.787,
  },
});

export default Carousel;
