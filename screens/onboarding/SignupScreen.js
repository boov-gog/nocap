import React, { useContext, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  View,
  TextInput,
  Logo,
  Button,
  FormErrorMessage,
} from "../../components";
import { Images, Colors } from "../../config";
import { emailValidationSchema, showErrorToast } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNav } from "../../navigation/NavigationKeys";
import NocapButton from "../../components/NocapButton";
import { CheckBox } from "react-native-elements";
import { AuthenticatedUserContext } from "../../providers";
import TopBar from "../../components/TopBar";

import { useTranslation } from "react-i18next";

export const SignupScreen = ({ navigation }) => {
  const { t } = useTranslation(); 

  const [errorState, setErrorState] = useState("");
  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    setChecked((prevState) => !prevState);
  };

  const { setEmail, setInviter } = useContext(AuthenticatedUserContext); 

  const handleSignup = async (values) => {
    if (!checked) {
      showErrorToast("Please agree to our policy");
      return;
    }
    const { email, inviter } = values; 

    // console.log("signupEmail: ", email); 
    // console.log("signupInviter: ", inviter); 

    setEmail(email); 
    setInviter(inviter); 

    navigation.navigate(StackNav.Age);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      {/* <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
      > */}
      {/* LogoContainer: consist app logo and screen title */}
      <Logo uri={Images.logo} />

      {/* Formik Wrapper */}
      <Formik
        initialValues={{
          email: "", 
          inviter: "", 
        }}
        validationSchema={emailValidationSchema}
        onSubmit={(values) => handleSignup(values)}
      >
        {({
          values,
          touched,
          errors,
          handleChange, 
          handleSubmit,
          handleBlur,
        }) => (
          <View style={styles.formContainer}>
            {/* Input fields */}
            <View style={styles.inputContainer}>
              <TextInput
                name="email"
                leftIconName="email"
                placeholder={t("email")}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={false}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              /> 
              <TextInput
                name="inviter"
                leftIconName="inbox"
                placeholder={t("whoInvitedYou")}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={false}
                value={values.inviter}
                onChangeText={handleChange("inviter")}
                onBlur={handleBlur("inviter")}
              />
              <View style={styles.checkContainer}>
                <CheckBox
                  checked={checked}
                  onPress={handleChecked}
                  style={styles.checkBox}
                />
                <Text style={styles.checkText}>
                  {t("youAgreeToOurPrivacyPolicy")}
                </Text>
              </View>
              <FormErrorMessage error={errors.email} visible={touched.email} />
              {/* Display Screen Error Messages */}
              {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
            </View>

            {/* Signup button */}
            <NocapButton title={t("createAccount")} onPress={handleSubmit} />
          </View>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <View style={{ alignItems: "center" }}>
        <View style={{ width: 220 }}>
          <NocapButton
            title={t("login")}
            titleStyle={{ fontSize: 16 }}
            onPress={() => navigation.navigate(StackNav.Login)}
            containerWidth={220}
          />
        </View>
      </View>
      {/* </KeyboardAwareScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackBlue,
    paddingHorizontal: 12,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  formContainer: {
    paddingTop: 24,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 64,
  },
  checkBox: { backgroundColor: "red" },
  checkText: {
    color: "white",
    fontSize: 16,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
