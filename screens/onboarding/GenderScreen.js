import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { GENDER_TYPE, showErrorToast } from "../../utils";
import GenderButton from "../../components/GenderButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopBar from "../../components/TopBar";

import { useTranslation } from "react-i18next";

export const GenderScreen = (props) => {
  const { t } = useTranslation(); 

  const { setGender } = useContext(AuthenticatedUserContext);

  const handleNext = (id) => {
    const gender = id == 0 ? "B" : id == 1 ? "G" : "N";
    setGender(gender);

    props.navigation.navigate(StackNav.Grade);
  };

  const dimWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      {/* <KeyboardAwareScrollView> */}
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>{t("chooseYourGender")}</Text>

        <View style={{ flexDirection: "row", gap: 32, marginTop: 48 }}>
          <View style={{ alignItems: "center" }}>
            <GenderButton
              uri={Images.boy}
              onPress={() => handleNext(0)}
              width={dimWidth * 0.4}
            />
            <Text style={styles.genderLabel}>Boy</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <GenderButton
              uri={Images.girl}
              onPress={() => handleNext(1)}
              width={dimWidth * 0.4}
            />
            <Text style={styles.genderLabel}>Girl</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <GenderButton
              uri={Images.nonBinary}
              onPress={() => handleNext(2)}
              width={dimWidth * 0.4}
            />
            <Text style={styles.genderLabel}>Non-Binary</Text>
          </View>
        </View>
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
    paddingBottom: 20,
    alignItems: "center",
  },
  titleStyle: {
    fontFamily: "Kanit-Bold",
    fontSize: 32,
    color: Colors.white,
  },
  inputStyle: {
    marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.white,
  },
  genderLabel: {
    fontFamily: "Kanit-Bold",
    fontSize: 32,
    color: "white",
  },
});
