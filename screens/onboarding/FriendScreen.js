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
import { CheckBox } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const FriendScreen = (props) => {
  const [selected, setSelected] = useState({});

  const toggleSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { setFriends } = useContext(AuthenticatedUserContext);

  const handleNext = () => {
    setFriends(selected);
    props.navigation.navigate(StackNav.Password);
  };

  const friendList = [
    {
      id: 1,
      avatar: Images.boy,
      title: "Name",
    },
    {
      id: 2,
      avatar: Images.girl,
      title: "Name",
    },
    {
      id: 3,
      avatar: Images.girl,
      title: "Name",
    },
    {
      id: 4,
      avatar: Images.boy,
      title: "Name",
    },
    {
      id: 5,
      avatar: Images.nonBinary,
      title: "Name",
    },
    {
      id: 6,
      avatar: Images.girl,
      title: "Name",
    },
    {
      id: 7,
      avatar: Images.nonBinary,
      title: "Name",
    },
    {
      id: 8,
      avatar: Images.boy,
      title: "Name",
    },
    {
      id: 9,
      avatar: Images.nonBinary,
      title: "Name",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.oneItem}
      onPress={() => toggleSelect(item.id)}
    >
      <View style={styles.itemContent}>
        <Image style={styles.itemAvatar} source={item.avatar} />
        <Text style={styles.oneItemTitle}>{item.title}</Text>
      </View>
      <CheckBox
        checked={selected[item.id] || false}
        onPress={() => toggleSelect(item.id)}
      />
    </TouchableOpacity>
  );

  const handleSkip = () => {
    props.navigation.navigate(StackNav.Password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mainContainer}>
          <Text style={styles.titleStyle}>Choose Friends to Play With!</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingTop: 6,
              paddingBottom: 12,
            }}
          >
            <TouchableOpacity onPress={handleSkip}>
              <View style={styles.skipBtnBack}>
                <Text style={styles.skipBtnTxt}>Skip</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
              <View style={styles.skipBtnBack}>
                <Text style={styles.skipBtnTxt}>Next</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            <TextInput
              leftIconName={"magnify"}
              placeholder="Search..."
              borderLess={true}
            />

            <FlatList
              data={friendList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.flatList}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
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
    paddingTop: 50,
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
  skipBtnBack: {
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "white",
  },
  skipBtnTxt: {
    fontFamily: "Kanit-Bold",
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
