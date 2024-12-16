import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator, Logo } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast } from "../../utils";
import * as Contacts from "expo-contacts";
import TopBar from "../../components/TopBar";

import { useTranslation } from "react-i18next";

export const ContactsPermissionScreen = (props) => {
  const { t } = useTranslation(); 

  const [isGettingPermission, setIsGettingPermission] = useState(false);

  const handleNext = async () => {
    setIsGettingPermission(true);

    const { status } = await Contacts.requestPermissionsAsync();
    // console.log(status);
    if (status !== "granted") {
      showErrorToast("Permission to access contacts was denied");
    } else {
      props.navigation.navigate(StackNav.Friends);
    }
    setIsGettingPermission(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>
          {t("toFindYourFriends")}
        </Text>

        {isGettingPermission ? (
          <LoadingIndicator />
        ) : (
          <NocapButton
            title={t("allowAccessToContacts")}
            onPress={handleNext}
            titleStyle={{ fontSize: 26 }}
          />
        )}
      </View>
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
    flex: 1,
    paddingTop: 0,
    alignItems: "center",
  },
  titleStyle: {
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    color: Colors.white,
    textAlign: "center"
  },
  inputStyle: {
    marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.white,
  },
});
