import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { LoadingIndicator, TextInput } from "../../components";
import { Colors } from "../../config";
import NocapButton from "../../components/NocapButton";

import { auth } from "../../config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { showErrorToast, showSuccessToast } from "../../utils";

import { useTranslation } from "react-i18next";

const ChangePasswordScreen = () => {
  const { t } = useTranslation(); 

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const validatePassword = () => {
    // Check if the email format is correct
    if (newPassword.length < 6) {
      showErrorToast("Password must be at least 6 characters long.");
      return false;
    }

    // Check if both emails match
    if (newPassword !== confirmPassword) {
      showErrorToast("Passwords do not match. Please try again.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (validatePassword() == false) return;

    setUpdating(true);
    try {
      const fireUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(fireUser.email, password);

      // Re-authenticate user with current email and password
      await reauthenticateWithCredential(fireUser, credential);

      try {
        await updatePassword(fireUser, newPassword);
        showSuccessToast("Password updated successfully.");
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } catch (error) {
      // console.log("Error re-authenticating user: ", error);
      Alert.alert(
        "Error",
        "The current password is incorrect. Please try again."
      );
    }
    setUpdating(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>{t("changePassword")}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={`${t("currentPassword")}...`}
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={`${t("newPassword")}...`}
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={`${t("confirmNewPassword")}...`}
            secureTextEntry={true}
          />
        </View>
        {updating ? (
          <LoadingIndicator />
        ) : (
          <NocapButton title={t("save")} onPress={handleSave} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

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
});
