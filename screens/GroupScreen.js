import { Alert, StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Modal } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";
import { LoadingIndicator, TextInput } from "../components";
import { Colors } from "../config";

import { showErrorToast, showSuccessToast } from "../utils";

import { useRoute } from "@react-navigation/native";

import { Icon } from "../components/Icon";
import { StackNav } from "../navigation/NavigationKeys";
import { fetchSchools, deleteSchoolById } from "../services/schoolService";
import { AuthenticatedUserContext } from "../providers";
import { updateUser } from "../services/userService";

import { useTranslation } from "react-i18next";

const GroupScreen = ({ navigation }) => {
  const { t } = useTranslation(); 

  const { user, setUser, setSchool } = useContext(AuthenticatedUserContext);

  const [searchText, setSearchText] = useState("");
  const [groups, setGroups] = useState([]);
  const [delId, setDelId] = useState(-1);

  const [modalVisible, setModalVisible] = useState(false);
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false); 

  const [joinId, setJoinId] = useState(-1); 

  const init = async () => {
    const schoolList = await fetchSchools();
    const groupList = schoolList.filter((item) => {
      return item.isCustom == true;
    });
    setGroups(groupList);
    // console.log("groupList: ", groupList);
  }

  useEffect(() => {
    init();
  }, []);

  const handleDel = (id) => {
    setDelId(id);
    setModalVisible(true);
  }

  const handleDelACtion = async () => {
    const res = await deleteSchoolById(delId);
    init();
    setModalVisible(false);
    showSuccessToast("Group is deleted successfully.");
    setDelId(-1);
  }

  const handleModalOk = () => {
    setLimitModalVisible(false); 

    // const currentAmount = groups.filter(item => item.owner === user.id).length;

    // if (currentAmount < 10) {
    //   setLimitModalVisible(false);
    //   navigation.navigate(StackNav.GroupQuestions, { groupId: -1 });
    // } else {
    //   showErrorToast("You already created 10 groups.");
    //   setLimitModalVisible(false);
    // }
  }

  const handleNew = () => {
    const currentAmount = groups.filter(item => item.owner === user.id).length;

    if (currentAmount < 10) {
      // setLimitModalVisible(false);
      navigation.navigate(StackNav.GroupQuestions, { groupId: -1 });
    } else {
      setLimitModalVisible(true); 
      // showErrorToast("You already created 10 groups.");
      // setLimitModalVisible(false);
    }
  }

  const handleJoinGroup = (id) => {
    setJoinModalVisible(true); 
    setJoinId(id); 
  }

  const handleJoinModalOk = () => {
    setJoinModalVisible(false); 
    handleJoin(joinId); 
  }

  const handleJoin = async (id) => {
    // console.log("joinUser: ", user);

    try {
      if (!user) {
        setSchool(id);
        navigation.navigate(StackNav.Phone);
      } else {
        const updatedUser = await updateUser(user.id, { school_id: id });
        setUser({ ...user, ...updatedUser });

        // console.log("Joined user group: ", updatedUser);
        showSuccessToast("Joined the group successfully.");
      }
    } catch (error) {
      console.error("Error joing the group: ", error);
      showErrorToast("Error joining the group: " + error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are you sure you want to delete this group?</Text>
            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>{t("back")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDelButton} onPress={() => handleDelACtion()}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={limitModalVisible}
        onRequestClose={() => {
          setLimitModalVisible(!limitModalVisible);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>You can only make up to 10 groups.</Text>
            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => {
                handleModalOk();
              }}>
                <Text style={styles.modalButtonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={joinModalVisible}
        onRequestClose={() => {
          setLimitModalVisible(!joinModalVisible);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Warning: questions in a group are written by other players. 
              They are not reviewed, and may be inappropriate for users under 18 years of age. 
            </Text>
            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={styles.joinModalButton} onPress={() => {
                handleJoinModalOk();
              }}>
                <Text style={styles.modalButtonText}>I Consent</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>All Groups</Text>

        <View style={styles.topContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.search}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
            />
          </View>
          <View style={styles.topEmptySpace}></View>
          <View style={styles.newBtnContainer}>
            <TouchableOpacity style={styles.newBtn} onPress={() => {
              // setLimitModalVisible(true);
              handleNew(); 
            }}>
              <Text style={styles.newBtnText}>New</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.groupScroll} showsVerticalScrollIndicator={false} >
          {groups.map(item => (
            <View style={styles.groupContainer}>
              <Text style={styles.groupText}>
                {item.title}
              </Text>
              <TouchableOpacity style={styles.groupJoinBtn} onPress={() => {
                handleJoinGroup(item.id);
              }}>
                <Text style={styles.groupJoinBtnText}>Join</Text>
              </TouchableOpacity>
              {user && (
                <TouchableOpacity onPress={() => {
                  navigation.navigate(StackNav.GroupQuestions, { groupId: item.id });
                }}>
                  <Icon
                    name="pencil-outline"
                    size={32}
                    color="#1D1B20"
                  />
                </TouchableOpacity>
              )}
              {user && (
                <TouchableOpacity onPress={() => handleDel(item.id)}>
                  <Icon
                    name="delete-outline"
                    size={32}
                    color="#1D1B20"
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackBlue,
  },
  mainContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    width: "100%",
    fontFamily: "Kanit-Bold",
  },
  titleStyle: {
    color: "white",
    fontFamily: "Kanit-Bold",
    fontSize: 26,
    paddingTop: 50,
  },
  inputContainer: {
    marginTop: 30,
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "Kanit-Regular",
    fontSize: 26,
    paddingHorizontal: 10,
  },

  topContainer: {
    marginTop: 30,
    width: "100%",
    flexDirection: "row",
  },
  searchContainer: {
    width: "75%",
  },
  search: {
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "Inter",
    fontSize: 26,
    paddingHorizontal: 6,
  },
  topEmptySpace: {
    flexGrow: 1
  },
  newBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  newBtn: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: "white"
  },
  newBtnText: {
    fontSize: 26,
    fontFamily: "Kanit-Bold",
  },
  groupScroll: {
    width: "100%",
  },
  groupContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingLeft: 16,
    marginVertical: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.mediumGray,
  },
  groupText: {
    flex: 1,
    width: "100%",
    fontSize: 26,
    color: Colors.black,
    fontFamily: "Kanit-Bold",
  },
  groupJoinBtn: {
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 32,
    backgroundColor: "#EAEAEA"
  },
  groupJoinBtnText: {
    fontSize: 26,
    fontFamily: "Kanit-Bold",
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 360,
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "Kanit",
    fontWeight: "bold",
    fontSize: 26,
    lineHeight: 39,
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "Kanit-Regular",
    fontSize: 14,
    paddingHorizontal: 4,
  },

  modalBtnContainer: {
    marginTop: 30,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 24
  },
  modalCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#000000",
    color: "white",
    width: "40%",
  },
  modalDelButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FF0000",
    color: "white",
    width: "40%"
  },
  modalButtonText: {
    fontFamily: "Rounded Mplus 1c Bold",
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  joinModalButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "red",
    color: "white",
    width: "80%",
  },
});
