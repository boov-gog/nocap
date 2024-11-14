import { Alert, StyleSheet, Text, View, Button, TouchableOpacity, TextInput as RNTextInput, ScrollView } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";
import { LoadingIndicator, TextInput } from "../components";
import { Colors } from "../config";
import NocapButton from "../components/NocapButton";

import { auth } from "../config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { showErrorToast, showSuccessToast } from "../utils";

import { Icon } from "../components/Icon";
import { getSchoolById, addGroup, updateGroup } from "../services/schoolService";

import { useRoute } from "@react-navigation/native"; 

import { AuthenticatedUserContext } from "../providers";

const GroupQuestionsScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);

  const [group, setGroup] = useState({});
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [groupQuestions, setGroupQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [insertQuestion, setInsertQuestion] = useState("");

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
    if (insertQuestion == "") {
      showErrorToast("Please input the question content!");
    } else {
      console.log("insertQuestion: ", insertQuestion);
      let tempNewQuestions = newQuestions;
      tempNewQuestions.push({ value: insertQuestion, enabled: true });
      setNewQuestions(tempNewQuestions);
      setInsertQuestion("");
    }
  }

  const handleDone = async () => {
    if (groupName == "") {
      showErrorToast("Group name should not be empty.");
    } else {
      const data = { groupName, groupCode, newQuestions, groupId, ownerId: user.id }; 
      if(groupId == -1) {
        const res = await addGroup(data); 
        setNewQuestions([]); 
        showSuccessToast("New group is added successfully."); 
      } else {
        const res = await updateGroup(data); 
        init(); 
        setNewQuestions([]); 
        showSuccessToast("Group data is updated successfully."); 
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <RNTextInput
              style={styles.inputStyle}
              placeholder="Add group name..."
              placeholderTextColor={Colors.gray}
              keyboardType="decimal-pad"
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
          <View style={styles.textInputContainer}>
            <RNTextInput
              style={styles.inputStyle}
              placeholder="Add group code..."
              placeholderTextColor={Colors.gray}
              keyboardType="decimal-pad"
              value={groupCode}
              onChangeText={setGroupCode}
            />
          </View>
        </View>

        <View style={styles.topContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.search}
              value={insertQuestion}
              onChangeText={setInsertQuestion}
              placeholder="Insert questions..."
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
        </View>

        <ScrollView style={styles.groupScroll}>
          {groupQuestions.map(item => (
            <View style={styles.groupContainer}>
              <Text style={styles.groupText}>
                { item.value }
              </Text>
              <TouchableOpacity>
                <Icon
                  name="pencil-outline"
                  size={32}
                  color="#1D1B20"
                />
              </TouchableOpacity>
              <TouchableOpacity>
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
              <TouchableOpacity>
                <Icon
                  name="pencil-outline"
                  size={32}
                  color="#1D1B20"
                />
              </TouchableOpacity>
              <TouchableOpacity>
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
            <Text style={styles.doneBtnText}>{groupId == -1? "Create": "Update"}</Text>
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

  topContainer: {
    // marginTop: 30,
    width: "100%",
    flexDirection: "row",
  },
  searchContainer: {
    width: "75%",
  },
  search: {
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
});
