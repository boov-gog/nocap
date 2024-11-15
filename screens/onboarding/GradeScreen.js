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

export const GradeScreen = (props) => {
  const { setGrade } = useContext(AuthenticatedUserContext);

  const arr = [Grades._9, Grades._10, Grades._11, Grades._12];

  const handleNext = (value) => { 
    if (value == "notHighSchool") {
      props.navigation.navigate(StackNav.GroupJoin);
      return; 
    }

    if (value == "") {
      showErrorToast("Select your grade.");
      return;
    }
    setGrade(value);
    props.navigation.navigate(StackNav.LocationPermission);
  };

  const windowWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <Logo uri={Images.logo} />
      {/* <View style={styles.mainContainer}> */}
        <Text style={styles.titleStyle}>Choose Your Grade</Text>
        <KeyboardAwareScrollView>
          {arr.map((value) => (
            <View style={{ marginBottom: -0.09 * windowWidth }} key={value}>
              <NocapButton
                key={value}
                title={value}
                onPress={() => {
                  handleNext(value);
                }}
              />
            </View>
          ))}

          <View style={{ height: 20 }} />
          <NocapButton
            title={Grades._Not}
            onPress={() =>
              handleNext("notHighSchool")
              // showErrorToast("This feature is not available yet.")
            }
            titleStyle={{ fontSize: 24 }}
          />
        </KeyboardAwareScrollView>
      {/* </View> */}
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
    fontSize: 36,
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
