import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView, Alert } from "react-native";
import { signOut } from "firebase/auth";

import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticatedUserContext } from "../providers";
import { Images, Colors, auth } from "../config";
import { StackNav } from "../navigation/NavigationKeys";
import TopBar from "../components/TopBar";
import { GENDER_TYPE } from "../utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getSchoolById } from "../services/schoolService";
import ToggleSwitch from "toggle-switch-react-native";
import { Provider } from "react-native-paper";
import ChangeUserInfoModal from "../components/ChangeUserInfoModal";
import { Icon } from "../components";

export const ProfileScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [schoolTitle, setSchoolTitle] = useState("");
  const [toggleState, setToggleState] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const handleToggle = () => {
    setToggleState(!toggleState);
  };

  const handleLogout = () => {
    const signOutUser = async () => {
      try {
        await signOut(auth);
        setUser(null);

        navigation.reset({
          index: 0,
          routes: [{ name: StackNav.Start }],
        });
      } catch (error) {
        console.log("Error logging out: ", error);
      }
    };

    // Show an alert to confirm if the user wants to exit the game
    Alert.alert("Hold on!", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => signOutUser(),
      },
    ]);
  };

  const onDismissModal = () => {
    setModalVisible(false);
  };

  const avatarImage =
    user?.gender == GENDER_TYPE.Boy
      ? Images.boy
      : user?.gender == GENDER_TYPE.Girl
      ? Images.girl
      : Images.nonBinary;

  useEffect(() => {
    const getSchool = async (schoolId) => {
      try {
        const school = await getSchoolById(schoolId);
        setSchoolTitle(school.title);
      } catch (error) {
        console.log("Error getting school: ", error);
      }
    };
    if (user?.school_id) {
      getSchool(user?.school_id);
    } else {
      setSchoolTitle("Non-group");
    }
  }, [user?.school_id]);

  return (
    <SafeAreaView style={styles.container}>
      <Provider>
        {modalVisible && (
          <ChangeUserInfoModal onDismiss={onDismissModal} userValue={user} />
        )}
        <TopBar
          rightIconShow={true}
          rightIconName="account-arrow-right"
          handlePressRight={handleLogout}
        />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.displayName}>
              {user?.firstName + (user?.firstName ? " " : "") + user?.lastName}
            </Text>
            <Text style={styles.followersText}>{user?.email}</Text>
            <View style={styles.followersContainer}>
              <Text style={styles.followersText}>{"age: " + user?.age}</Text>
              <Text style={styles.followersText}>{user?.grade}</Text>
            </View>
            <View style={styles.followersContainer}>
              <Text style={styles.followersText}>{schoolTitle}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Image style={styles.avatar} source={avatarImage} />
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon
              name="account-edit"
              size={32}
              color="white"
              style={{ marginTop: 70 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContentStyle}>
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={() => {
                navigation.navigate(StackNav.ChangePassword);
              }}
            >
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                Change Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={() => {
                navigation.navigate(StackNav.ChangeSchool);
              }}
            >
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                Change School
              </Text>
            </TouchableOpacity>
            <View style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                Sounds
              </Text>
              <ToggleSwitch
                isOn={toggleState}
                onColor="green"
                size="large"
                onToggle={handleToggle}
              />
            </View>
            <TouchableOpacity style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                Downgrade Subscription
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                Purchase Name Reveals
              </Text>
              <View style={styles.nameReveals}>
                <Text style={styles.settingText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                App Info
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Provider>
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
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    gap: 8,
  },
  displayName: {
    fontFamily: "Kanit-Regular",
    fontSize: 24,
    color: "white",
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  followersText: {
    fontFamily: "Kanit-Regular",
    fontSize: 16,
    color: "white",
  },
  headerRight: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 100,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
  scrollContentStyle: {
    gap: 30,
    paddingBottom: 30,
  },
  settingBtn: {
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "white",
    flexDirection: "row",
    gap: 8,
    height: 50,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  settingText: {
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
  nameReveals: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
});
