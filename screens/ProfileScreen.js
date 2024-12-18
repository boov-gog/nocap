import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView, Alert, Modal, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";

import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticatedUserContext } from "../providers";
import { Images, Colors, auth } from "../config";
import { StackNav } from "../navigation/NavigationKeys";
import TopBar from "../components/TopBar";
import { GENDER_TYPE } from "../utils";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { getSchoolById } from "../services/schoolService";
import ToggleSwitch from "toggle-switch-react-native";
import { Provider } from "react-native-paper";
import ChangeUserInfoModal from "../components/ChangeUserInfoModal";
import { Icon } from "../components";

import { getAuth } from "firebase/auth";
import { showErrorToast, showSuccessToast } from "../utils";
import { updateUser } from "../services/userService";

import { useTranslation } from "react-i18next";

export const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation(); 

  const { user, setUser, onAudio, setOnAudio } = useContext(AuthenticatedUserContext);
  const [schoolTitle, setSchoolTitle] = useState("");
  const [toggleState, setToggleState] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); 

  const [modalDowngradeVisible, setModalDowngradeVisible] = useState(false);

  const handleToggle = () => {
    setToggleState(!toggleState);
    setOnAudio(!onAudio);
  };

  const handleLogout = () => {
    const signOutUser = async () => {
      try {
        await signOut(auth); 
        await updateUser(user.id, {isOnline: false}); 
        setUser(null); 

        navigation.reset({
          index: 0,
          routes: [{ name: StackNav.Start }],
        });
      } catch (error) {
        // console.log("Error logging out: ", error);
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

  const handleSubscription = () => {
    if (user.isSubscribed) {
      showErrorToast("You are already subscribed!");
    } else {
      navigation.navigate(StackNav.Subscription);
    }
  }

  const handleDowngrade = async () => {
    if (!user.isSubscribed) {
      showErrorToast("You have no subscription!");
    } else {
      setModalDowngradeVisible(true); 
    }
  }

  const handleDowngradeAction = async () => {
    const updatedUser = await updateUser(user.id, { isSubscribed: false });
    setUser({ ...user, ...updatedUser });
    showSuccessToast("You downgraded subscription successfully!"); 
    setModalDowngradeVisible(false); 
  }

  const avatarImage =
    user?.gender == GENDER_TYPE.Boy
      ? Images.boy
      : user?.gender == GENDER_TYPE.Girl
        ? Images.girl
        : Images.nonBinary;

  useEffect(() => {
    const auth = getAuth();

    const getSchool = async (schoolId) => {
      try {
        const school = await getSchoolById(schoolId);
        setSchoolTitle(school.title);
      } catch (error) {
        // console.log("Error getting school: ", error);
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDowngradeVisible}
          onRequestClose={() => {
            setModalDowngradeVisible(!modalDowngradeVisible);
          }}>
          <View style={styles.modalDowngradeBackground}>
            <View style={styles.modalDowngradeContainer}>
              <Text style={styles.modalDowngradeTitle}>You will loose every unlocked caps. Are you sure?</Text>
              <TouchableOpacity style={styles.modalDowngradeButton} onPress={() => handleDowngradeAction()}>
                <Text style={styles.modalDowngradeButtonText}>Yes, sure</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDowngradeCloseButton} onPress={() => setModalDowngradeVisible(false)}>
                <Text style={styles.modalDowngradeButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
          <ScrollView contentContainerStyle={styles.scrollContentStyle} showsVerticalScrollIndicator={false}>
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
                {t("changePassword")}
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
                {t("changeSchool")}
              </Text>
            </TouchableOpacity>
            <View style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                {t("sounds")}
              </Text>
              <ToggleSwitch
                isOn={onAudio}
                onColor="green"
                size="large"
                onToggle={handleToggle}
              />
            </View>
            <TouchableOpacity
              style={user?.isSubscribed ? styles.proModeBtn : styles.settingBtn}
              onPress={handleSubscription}
            >
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                Pro Mode
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={() => handleDowngrade()}
            >
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {t("downgradeSubscription")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                {t("purchaseNameReveals")}
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
                {t("privacyPolicy")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingBtn}>
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                {t("appInfo")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity  
              style={styles.settingBtn}
              onPress={() => {
                navigation.navigate(StackNav.Group);
              }}
            >
              <Text
                style={styles.settingText}
                numberOfLines={1}
                ellipsizeMode="head"
              >
                {t("yourGroups")}
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
    fontSize: 24,
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
  proModeBtn: {
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "cyan",
    flexDirection: "row",
    gap: 8,
    height: 50,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  }, 

  modalDowngradeBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalDowngradeContainer: {
    width: 360,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalDowngradeTitle: {
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10,
    textAlign: "center",
  },
  modalDowngradeInput: {
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "Kanit-Regular",
    fontSize: 14,
    paddingHorizontal: 4,
  },
  modalDowngradeButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#007C00",
    color: "white",
  },
  modalDowngradeCloseButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#000087",
    color: "white",
  },
  modalDowngradeButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
