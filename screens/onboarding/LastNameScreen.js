import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { checkBadName, showErrorToast } from "../../utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopBar from "../../components/TopBar";

import { useTranslation } from "react-i18next";

export const LastNameScreen = (props) => {
  const { t } = useTranslation(); 

  const [lName, setLName] = useState("");

  const { setLastName } = useContext(AuthenticatedUserContext);

  const handleNext = () => {
    if (lName == "") {
      showErrorToast("Input your Last Name.");
      return;
    } else if (checkBadName(lName)) {
      showErrorToast("Please don't use bad words.");
      return;
    }
    setLastName(lName);
    props.navigation.navigate(StackNav.Gender);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      {/* <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      > */}
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>{t("enterYourLastName")}</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder={`${t("lastName")}...`}
          placeholderTextColor={Colors.gray}
          value={lName}
          onChangeText={setLName}
        />
        <NocapButton title={t("Next")} onPress={handleNext} />
      </View>
      {/* </KeyboardAwareScrollView> */}
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
    paddingTop: 0,
    alignItems: "center",
  },
  titleStyle: {
    fontFamily: "Kanit-Bold",
    fontSize: 36,
    textAlign: "center",
    color: Colors.white,
  },
  inputStyle: {
    marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.white,
  },
});
