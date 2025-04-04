import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const AnswerButton = ({
  clickable = true,
  selected = false,
  name,
  onPress,
  normalState,
}) => {
  const handlePress = () => {
    if (clickable && onPress) onPress();
  };

  return (
    <View>
      <TouchableOpacity
        style={
          selected
            ? styles.selectedContainer
            : [styles.normalContainer, normalState]
        }
        onPress={handlePress}
        disabled={!clickable}
      >
        <Text numberOfLines={3} ellipsizeMode="tail">
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AnswerButton;

const styles = StyleSheet.create({
  normalContainer: {
    height: 90,
    marginHorizontal: 6,
    marginVertical: 7,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedContainer: {
    height: 100,
    marginHorizontal: 1,
    marginVertical: 2,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 15,
  },
});
