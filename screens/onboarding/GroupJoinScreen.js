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
import { Grades, showErrorToast } from "../../utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopBar from "../../components/TopBar";

export const GroupJoinScreen = (props) => {
  const handleNext = (value) => {
    if (value == "create") {
      props.navigation.navigate(StackNav.GroupQuestions, { groupId: -1 });
    } else {
      props.navigation.navigate(StackNav.Group);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <Logo uri={Images.logo} />
      <View style={{ marginBottom: -30 }}>
        <NocapButton
          key="createAGroup"
          title="Create A Group"
          onPress={() => {
            handleNext("create");
          }}
        />
      </View>
      <View>
        <NocapButton
          key="joinGroup"
          title="Join Group"
          onPress={() => {
            handleNext("join");
          }}
        />
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
});
