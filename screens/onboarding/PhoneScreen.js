import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast } from "../../utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopBar from "../../components/TopBar";

export const PhoneScreen = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return `${match[1]}${match[2] ? "-" : ""}${match[2]}${
        match[3] ? "-" : ""
      }${match[3]}`;
    }
    return text;
  };

  const validatePhoneNumber = (number) => {
    // Basic US phone number validation
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (text) => {
    const formattedNumber = formatPhoneNumber(text);
    setPhoneNumber(formattedNumber);
    setIsValid(validatePhoneNumber(formattedNumber));
  };

  const { setPhone } = useContext(AuthenticatedUserContext);

  const handleNext = () => {
    if (phoneNumber == "") {
      showErrorToast("Input your phone number.");
      return;
    } else if (!isValid) {
      showErrorToast("Input valid phone number.");
      return;
    }

    setPhone(phoneNumber);
    props.navigation.navigate(StackNav.ContactsPermission);
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
        <Text style={styles.titleStyle}>Enter Your Phone Number</Text>
        <TextInput
          style={[styles.inputStyle, !isValid && styles.invalidInput]}
          placeholder="Phone Number..."
          placeholderTextColor={Colors.gray}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          maxLength={12}
        />
        {!isValid && phoneNumber.length > 0 && (
          <Text style={styles.errorText}>
            Please enter a valid phone number
          </Text>
        )}
        <NocapButton title="Next" onPress={handleNext} />
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
    color: Colors.white,
    textAlign: "center",
  },
  inputStyle: {
    marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.white,
  },
  invalidInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
