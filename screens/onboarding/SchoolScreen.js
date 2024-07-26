import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo, TextInput } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast } from "../../utils";

export const SchoolScreen = (props) => {
  const { setSchool } = useContext(AuthenticatedUserContext);

  const handleNext = (id) => {
    setSchool(id);
    props.navigation.navigate(StackNav.Phone);
  };

  const schoolList = [
    {
      id: 1,
      avatar: Images.school1,
      title: "Name",
    },
    {
      id: 2,
      avatar: Images.school2,
      title: "Name",
    },
    {
      id: 3,
      avatar: Images.school3,
      title: "Name",
    },
    {
      id: 4,
      avatar: Images.school4,
      title: "Name",
    },
    {
      id: 5,
      avatar: Images.school5,
      title: "Name",
    },
    {
      id: 6,
      avatar: Images.school6,
      title: "Name",
    },
    {
      id: 7,
      avatar: Images.school7,
      title: "Name",
    },
    {
      id: 8,
      avatar: Images.school8,
      title: "Name",
    },
    {
      id: 9,
      avatar: Images.school9,
      title: "Name",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.oneItem}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => handleNext(item.id)}
      >
        <Image
          style={styles.itemAvatar}
          source={item.avatar}
          resizeMode="contain"
        />
        <Text style={styles.oneItemTitle}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>Find Your School</Text>

        <View style={styles.listContainer}>
          <TextInput
            leftIconName={"magnify"}
            placeholder="Search..."
            borderLess={true}
          />

          <FlatList
            data={schoolList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.blackBlue,
    width: "100%",
    position: "relative",
  },
  mainContainer: {
    paddingTop: 60,
    alignItems: "center",
  },
  titleStyle: {
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    color: Colors.white,
  },
  inputStyle: {
    marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.white,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 23,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
  },
  oneItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    marginBottom: 12,
    paddingHorizontal: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemAvatar: {
    width: 50,
    height: 50,
    marginRight: 25,
  },
  oneItemTitle: {
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
});
