import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "../components";
import { Colors, Images } from "../config";
import { GENDER_TYPE } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { StackNav } from "../navigation/NavigationKeys";

const MyCapScreen = ({ navigation }) => {
  const listData = [
    { id: 1, name: "", gender: GENDER_TYPE.Girl, date: "08/01/24" },
    { id: 2, name: "", gender: GENDER_TYPE.Boy, date: "08/01/24" },
    { id: 3, name: "", gender: GENDER_TYPE.NonBinary, date: "08/01/24" },
    { id: 4, name: "", gender: GENDER_TYPE.Girl, date: "08/01/24" },
    { id: 5, name: "", gender: GENDER_TYPE.Boy, date: "08/01/24" },
    { id: 6, name: "", gender: GENDER_TYPE.Girl, date: "08/02/24" },
    { id: 7, name: "", gender: GENDER_TYPE.Boy, date: "08/02/24" },
    { id: 8, name: "", gender: GENDER_TYPE.Girl, date: "08/02/24" },
    { id: 9, name: "", gender: GENDER_TYPE.Boy, date: "08/02/24" },
    { id: 10, name: "", gender: GENDER_TYPE.NonBinary, date: "08/02/24" },
  ];

  const capListItem = ({ item }) => {
    let title = item.name;
    if (title == "") {
      title =
        item.gender == GENDER_TYPE.Boy
          ? "From a Boy"
          : item.gender == GENDER_TYPE.Girl
          ? "From a Girl"
          : "From Someone";
    }
    const myImage =
      item.gender == GENDER_TYPE.Boy
        ? Images.blueCapList
        : item.gender == GENDER_TYPE.Girl
        ? Images.pinkCap
        : Images.greenCap;

    return (
      <TouchableOpacity
        style={styles.oneListItem}
        onPress={() => {
          _onPress(item);
        }}
      >
        <Image style={styles.oneItemImage} source={myImage} />
        <Text style={styles.oneItemTitle}>{title}</Text>
        <Text style={styles.oneItemDate}>{item.date}</Text>
      </TouchableOpacity>
    );
  };

  const _onPress = (item) => {
    navigation.navigate(StackNav.WhatTheySay, { id: item.id });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Your Caps</Text>
        <TextInput
          leftIconName={"magnify"}
          placeholder="Search..."
          borderLess={true}
        />
        <FlatList
          data={listData}
          renderItem={capListItem}
          keyExtractor={(item) => item.id}
          style={styles.listStyle}
          contentContainerStyle={{ paddingBottom: 150 }}
        />
        <TouchableOpacity></TouchableOpacity>
      </View>

      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgb(255,255,255)"]}
        style={styles.blurViewOverlay}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.bottomLeft}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={styles.bottomRight} source={Images.userPerson}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.whoButtonContainer}>
        <TouchableOpacity style={styles.whoButton}>
          <Image style={styles.lockImage} source={Images.lockerWhite} />
          <Text style={styles.whoBtnText}>See who said this</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyCapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: Colors.blackBlue,
  },
  title: {
    marginTop: 68,
    marginBottom: 23,
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    color: "white",
  },
  listStyle: {
    width: "100%",
  },
  oneListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 5,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
  oneItemImage: {
    width: 60,
    height: 60,
  },
  oneItemTitle: {
    flex: 1,
    marginLeft: 20,
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
  oneItemDate: {
    fontFamily: "Kanit-Bold",
    fontSize: 16,
  },
  blurViewOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingLeft: 15,
    paddingRight: 34,
    paddingVertical: 6,
  },
  bottomLeft: {
    fontSize: 24,
  },
  bottomRight: {
    width: 20,
    height: 26,
  },
  whoButtonContainer: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    alignItems: "center",
  },
  whoButton: {
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 42,
    gap: 8,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  lockImage: {
    width: 40,
    height: 40,
  },
  whoBtnText: {
    fontFamily: "MPR-Bold",
    fontSize: 24,
    color: "white",
  },
});
