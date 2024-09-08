import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors, Images } from "../config";
import { useNavigation } from "@react-navigation/native";
import { StackNav } from "../navigation/NavigationKeys";

const TopBar = ({ style, textStyle, profileShow = false, handlePressBack }) => {
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

      <TouchableOpacity onPress={() => navigation.navigate(StackNav.Profile)}>
        {profileShow && (
          <Image style={{ width: 32, height: 32 }} source={Images.userIcon} />
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
