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
import { showErrorToast } from "../../utils";
import GenderButton from "../../components/GenderButton";

export const GenderScreen = (props) => {
  const handleNext = (id) => {
    props.navigation.navigate(StackNav.Grade);
  };

  const dimWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>Choose Your Gender</Text>

        <View style={{ flexDirection: "row", gap: 32, marginTop: 64 }}>
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
    paddingTop: 350,
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
  genderLabel: {
    fontFamily: "Kanit-Bold",
    fontSize: 36,
    color: "white",
  },
});
