import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { View } from "./View";
import {
  GENDER_TYPE,
  Grades,
  showErrorToast,
  showSuccessToast,
} from "../utils";
import { Picker } from "@react-native-picker/picker";
import { LoadingIndicator } from "./LoadingIndicator";
import { updateUser } from "../services/userService";
import { AuthenticatedUserContext } from "../providers";

const ChangeUserInfoModal = ({ onDismiss, userValue }) => {
  const [localAge, setLocalAge] = useState(userValue.age.toString());
  const [localFName, setLocalFName] = useState(userValue.firstName);
  const [localLName, setLocalLName] = useState(userValue.lastName);
  const [genderSelectedValue, setGenderSelectedValue] = useState(
    userValue.gender
  );
  const [gradeValue, setGradeValue] = useState(userValue.grade);
  const [updating, setUpdating] = useState(false);

  const { user, setUser } = useContext(AuthenticatedUserContext);

  const handleAgeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setLocalAge(numericValue);
  };

  const hideDialog = () => {
    onDismiss();
  };

  const handleGradeChange = (value) => {
    if (
      (userValue.grade != Grades._Not && value == Grades._Not) ||
      (userValue.grade == Grades._Not && value != Grades._Not)
    )
      Alert.alert("Warning", "This change will reset your school settings.");
    setGradeValue(value);
  };

  const handleSave = async () => {
    if (updating) return;

    if (localAge == "") {
      showErrorToast("Input your age.");
      return;
    } else if (parseInt(localAge) < 13) {
      showErrorToast("Under 13 years old boy can't play this game.");
      return;
    }
    if (localFName == "") {
      showErrorToast("Input your first name.");
      return;
    }
    if (localLName == "") {
      showErrorToast("Input your last name.");
      return;
    }
    if (
      localAge == userValue.age &&
      localFName == userValue.firstName &&
      localLName == userValue.lastName &&
      genderSelectedValue == userValue.gender &&
      gradeValue == userValue.grade
    ) {
      showErrorToast("No changes to save.");
      return;
    }

    let school = userValue.school_id;
    if (
      (userValue.grade != Grades._Not && gradeValue == Grades._Not) ||
      (userValue.grade == Grades._Not && gradeValue != Grades._Not)
    )
      school = null;

    setUpdating(true);
    try {
      const updatedUser = await updateUser(userValue.id, {
        age: parseInt(localAge),
        firstName: localFName,
        lastName: localLName,
        gender: genderSelectedValue,
        grade: gradeValue,
        school_id: school,
      });
      setUser({ ...user, ...updatedUser });

      console.log("Updated user info: ", updatedUser);
      showSuccessToast("User info updated successfully.");

      hideDialog();
    } catch (error) {
      console.log("Error updating user info: ", error);
      showErrorToast("Error updating user info. Try again later.");
    }
    setUpdating(false);
  };

  return (
    <Portal>
      <Dialog
        visible={true}
        onDismiss={hideDialog}
        style={{ backgroundColor: "white" }}
      >
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Content>
          {updating ? (
            <View style={{ height: 200 }}>
              <LoadingIndicator />
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <View style={styles.row}>
                <Text style={styles.text}>First Name:</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setLocalFName}
                  value={localFName}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Last Name:</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setLocalLName}
                  value={localLName}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Age:</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="decimal-pad"
                  onChangeText={handleAgeChange}
                  value={localAge}
                  maxLength={2}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Gender:</Text>
                <Picker
                  selectedValue={genderSelectedValue}
                  onValueChange={(itemValue) =>
                    setGenderSelectedValue(itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Boy" value={GENDER_TYPE.Boy} />
                  <Picker.Item label="Girl" value={GENDER_TYPE.Girl} />
                  <Picker.Item
                    label="Non-binary"
                    value={GENDER_TYPE.NonBinary}
                  />
                </Picker>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Grade:</Text>
                <Picker
                  selectedValue={gradeValue}
                  onValueChange={handleGradeChange}
                  style={styles.picker}
                >
                  <Picker.Item label={Grades._9} value={Grades._9} />
                  <Picker.Item label={Grades._10} value={Grades._10} />
                  <Picker.Item label={Grades._11} value={Grades._11} />
                  <Picker.Item label={Grades._12} value={Grades._12} />
                  <Picker.Item label={Grades._Not} value={Grades._Not} />
                </Picker>
              </View>
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleSave}>Save</Button>
          <Button onPress={hideDialog}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontFamily: "Kanit-Regular",
    fontSize: 18,
    flex: 1,
  },
  textInput: {
    fontFamily: "Kanit-Regular",
    fontSize: 18,
    flex: 2,
    borderBottomWidth: 1,
    textAlign: "right",
  },
  picker: {
    flex: 2,
    height: 50,
  },
});

export default ChangeUserInfoModal;
