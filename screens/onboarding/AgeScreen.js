import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast } from "../../utils";

export const AgeScreen = (props) => {
  const [age, setLocalAge] = useState("");

  const handleAgeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setLocalAge(numericValue);
  };

  const { setAge } = useContext(AuthenticatedUserContext);

  const handleNext = () => {
    if (age == "") {
      showErrorToast("Input your age.");
      return;
    } else if (parseInt(age) < 13) {
      showErrorToast("Under 13 years old boy can't play this game.");
      return;
    }
    setAge(age);
    props.navigation.navigate(StackNav.FirstName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>Enter Your Age</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Age..."
          placeholderTextColor={Colors.gray}
          keyboardType="decimal-pad"
          value={age}
          onChangeText={handleAgeChange}
          maxLength={3}
        />
        <NocapButton title="Next" onPress={handleNext} />
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
});
