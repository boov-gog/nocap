import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors, Images } from "../config";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "./Icon";

const TopBar = ({
  style,
  textStyle,
  rightIconShow = false,
  rightIconName,
  handlePressBack,
  handlePressRight,
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.topBar, style]}>
      <TouchableOpacity
        onPress={() => {
          handlePressBack ? handlePressBack() : navigation.goBack();
        }}
        style={{ flexDirection: "row", alignItems: "center", left: 30 }}
      >
        {/* <Image style={{ width: 36, height: 36 }} source={Images.backIcon} /> */}
        <Text style={[styles.text, textStyle]}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePressRight}>
        {rightIconShow && (
          <Icon
            name={rightIconName}
            size={32}
            color={Colors.white}
            style={{ marginRight: 20 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  text: {
    fontFamily: "Kanit-Regular",
    fontWeight: "600",
    fontSize: 24,
    color: Colors.white,
  },
});
