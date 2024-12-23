import { Alert, StyleSheet, Text, View, Button, TouchableOpacity, TextInput as RNTextInput, ScrollView, Modal } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";
import { LoadingIndicator, TextInput } from "../components";
import { Colors } from "../config";
import NocapButton from "../components/NocapButton";

import { showErrorToast, showSuccessToast } from "../utils";

import { Icon } from "../components/Icon";
import { getSchoolById, addGroup, updateGroup, updateQuestion, delQuestion } from "../services/schoolService";
import { useRoute } from "@react-navigation/native";
import { AuthenticatedUserContext } from "../providers";
import { StackNav } from "../navigation/NavigationKeys";

import { useTranslation } from "react-i18next";

const GroupQuestionsScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const authContext = useContext(AuthenticatedUserContext);
  const { user, setSchool } = useContext(AuthenticatedUserContext);
  const setGroupNameContext = authContext.setGroupName;
  const setGroupCodeContext = authContext.setGroupCode;
  const setGroupQuestionsContext = authContext.setGroupQuestions;

  const [group, setGroup] = useState({});
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [groupQuestions, setGroupQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [insertEngQuestion, setInsertEngQuestion] = useState("");
  const [insertEspQuestion, setInsertEspQuestion] = useState("Question in Spanish");

  const [editEngQuestion, setEditEngQuestion] = useState("");
  const [editEspQuestion, setEditEspQuestion] = useState("");
  const [editType, setEditType] = useState("origin");
  const [editId, setEditId] = useState(-1);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const groupId = useRoute().params.groupId;

  const init = async () => {
    if (groupId != -1) {
      const groupData = await getSchoolById(groupId);
      setGroup(groupData);
      setGroupName(groupData.title);
      setGroupCode(groupData.code);
      setGroupQuestions(groupData.questions);
    }
  }

  useEffect(() => {
    init();
  }, [])

  const handleAddQuestion = () => {
    if (insertEngQuestion == "" || insertEspQuestion == "") {
      showErrorToast("Please input the question content!");
    } else {
      const timeId = Date.now();
      let tempNewQuestions = newQuestions;
      tempNewQuestions.push({ tempId: timeId, value: insertEngQuestion, value_esp: insertEspQuestion, enabled: true });
      setNewQuestions(tempNewQuestions);
      setInsertEngQuestion("");
      setInsertEspQuestion("");
    }
  }

  const handleDone = async () => {
    // console.log("handleDone: ", groupName);

    if (groupName == "") {
      showErrorToast("Group name should not be empty.");
    } else {
      // console.log("tempNewQuestions: ", newQuestions);

      if (groupQuestions.length + newQuestions.length < 10) {
        showErrorToast("A group should have at least 10 questions.");
        return;
      }

      let tempNewQuestions = [];
      newQuestions.map(item => {
        tempNewQuestions.push({ value: item.value, value_esp: item.value_esp, enabled: item.enabled });
      })

      // console.log("middle");

      const data = { groupName, groupCode, newQuestions: tempNewQuestions, groupId, ownerId: user?.id };

      // console.log("groupData: ", data);

      if (groupId == -1) {
        if (!user) {
          // console.log("here signup");
          setSchool(-1);
          // console.log("hereGroupName: ", groupName);
          // console.log("hereGroupCode: ", groupCode);
          // console.log("hereGroupQuestions: ", tempNewQuestions);
          setGroupNameContext(groupName);
          setGroupCodeContext(groupCode);
          setGroupQuestionsContext(tempNewQuestions);
          navigation.navigate(StackNav.Phone);
          // console.log("navigate");
          return;
        } else {
          const res = await addGroup(data);

          // console.log("addGroupRes: ", res);
          if (res.status == 204) {
            showErrorToast("This group code already exists.");
          } else {
            setGroupName("");
            setGroupCode("");
            setNewQuestions([]);
            showSuccessToast("New group is added successfully.");
          }
        }
      } else {
        const res = await updateGroup(data);
        init();
        setNewQuestions([]);
        showSuccessToast("Group data is updated successfully.");
      }
    }
  }

  const handleEdit = (type, id, engStr, espStr) => {
    // console.log("timeId: ", id);
    // console.log("engStr: ", engStr);
    // console.log("espStr: ", espStr);

    setEditEngQuestion(engStr);
    setEditEspQuestion(espStr);
    setEditType(type);
    setEditId(id);
    setEditModalVisible(true);
  }

  const handleEditAction = async () => {
    if (editType == "origin") {
      const index = groupQuestions.findIndex(item => item.id == editId);

      // console.log("originIndex: ", index);

      if (index != -1) {
        let tmp = groupQuestions;
        tmp[index].value = editEngQuestion;
        tmp[index].value_esp = editEspQuestion;
        setGroupQuestions(tmp);
      }

      const res = updateQuestion(editId, { value: editEngQuestion, value_esp: editEspQuestion });
      // console.log("updateRes: ", res);
    } else {
      const index = newQuestions.findIndex(item => item.tempId == editId);

      // console.log("newIndex: ", index);

      if (index != -1) {
        let tmp = newQuestions;
        tmp[index].value = editEngQuestion;
        tmp[index].value_esp = editEspQuestion;
        setNewQuestions(tmp);
      }
    }

    setEditModalVisible(false);
  }

  const handleDelAction = (type, id) => {
    if (type == "origin") {
      try {
        const res = delQuestion(id);
        // console.log("delRes: ", res);
        const tmp = groupQuestions.filter(item => item.id != id);
        setGroupQuestions(tmp);
        showSuccessToast("Deleted a question successfully.");
      } catch (error) {
        // console.log("delError: ", error);
        showErrorToast("Error to delete a question.");
      }
    } else {
      const tmp = newQuestions.filter(item => item.tempId != id);
      setNewQuestions(tmp);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(!editModalVisible);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.questionContainer}>
              <View style={styles.questionBox}>
                <TextInput
                  style={styles.newInput}
                  value={editEngQuestion}
                  onChangeText={setEditEngQuestion}
                  placeholder="Insert in English..."
                />
              </View>
              {/* <View style={styles.questionBox}>
                <TextInput
                  style={styles.newInput}
                  value={editEspQuestion}
                  onChangeText={setEditEspQuestion}
                  placeholder="Insert in Spanish..."
                />
              </View> */}
            </View>
            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>{t("back")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOkButton} onPress={() => handleEditAction()}>
                <Text style={styles.modalButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TopBar />
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <RNTextInput
              style={styles.inputStyle}
              placeholder={t("addGroupName")}
              placeholderTextColor={Colors.gray}
              keyboardType="decimal-pad"
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
          <View style={styles.textInputContainer}>
            <RNTextInput
              style={styles.inputStyle}
              placeholder={t("addGroupCode")}
              placeholderTextColor={Colors.gray}
              keyboardType="decimal-pad"
              value={groupCode}
              onChangeText={setGroupCode}
            />
          </View>
        </View>

        <View style={styles.questionContainer}>
          <View style={styles.questionBox}>
            <View style={styles.newInputContainer}>
              <TextInput
                style={styles.newInput}
                value={insertEngQuestion}
                onChangeText={setInsertEngQuestion}
                placeholder={t("insertAQuestion")}
              />
            </View>
            <View style={styles.topEmptySpace}></View>
            <View style={styles.newBtnContainer}>
              <TouchableOpacity style={styles.newBtn} onPress={() => {
                handleAddQuestion();
              }}>
                <Text style={styles.newBtnText}>{t("add")}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={styles.questionBox}>
            <View style={styles.newInputContainer}>
              <TextInput
                style={styles.newInput}
                value={insertEspQuestion}
                onChangeText={setInsertEspQuestion}
                placeholder="Insert in Spanish..."
              />
            </View>
            <View style={styles.topEmptySpace}></View>
            <View style={styles.newBtnContainer}>
              <TouchableOpacity style={styles.newBtn} onPress={() => {
                handleAddQuestion();
              }}>
                <Text style={styles.newBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>

        <ScrollView style={styles.groupScroll} showsVerticalScrollIndicator={false} >
          {groupQuestions.map(item => (
            <View style={styles.groupContainer}>
              <Text style={styles.groupText}>
                {item.value}
              </Text>
              <TouchableOpacity onPress={() => {
                handleEdit("origin", item.id, item.value, item.value_esp);
              }}>
                <Icon
                  name="pencil-outline"
                  size={32}
                  color="#1D1B20"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                handleDelAction("origin", item.id, item.value, item.value_esp);
              }}>
                <Icon
                  name="delete-outline"
                  size={32}
                  color="#1D1B20"
                />
              </TouchableOpacity>
            </View>
          ))}
          {newQuestions.map(item => (
            <View style={styles.groupContainer}>
              <Text style={styles.groupText}>
                {item.value}
              </Text>
              <TouchableOpacity onPress={() => {
                handleEdit("new", item.tempId, item.value, item.value_esp);
              }}>
                <Icon
                  name="pencil-outline"
                  size={32}
                  color="#1D1B20"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                handleDelAction("new", item.tempId);
              }}>
                <Icon
                  name="delete-outline"
                  size={32}
                  color="#1D1B20"
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.doneBtnContainer}>
          <TouchableOpacity style={styles.doneBtn} onPress={() => {
            handleDone();
          }}>
            <Text style={styles.doneBtnText}>{groupId == -1 ? t("done") : t("update")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GroupQuestionsScreen;

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
    position: "relative"
  },

  inputContainer: {
    // marginTop: 10,
    width: "100%",
  },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  inputStyle: {
    width: "100%",
    textAlign: "center",
    // marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    padding: 2,
    fontWeight: "500",
    color: Colors.white,
  },

  questionContainer: {
    width: "100%"
  },
  questionBox: {
    // marginTop: 30,
    width: "100%",
    flexDirection: "row",
  },
  newInputContainer: {
    width: "75%",
  },
  newInput: {
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "Kanit-Regular",
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
    paddingVertical: 8,
    borderRadius: 32,
    backgroundColor: "#EAEAEA"
  },
  groupJoinBtnText: {
    fontSize: 26,
    fontFamily: "Kanit-Bold",
  },
  doneBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "fixed",
    bottom: 80,
    width: "80%"
  },
  doneBtn: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "black"
  },
  doneBtnText: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Kanit-Bold",
    color: "white",
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
    marginTop: 10,
    marginBottom: 10,
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
  modalOkButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#0066FF",
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
});
