import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Formik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";

import { passwordResetSchema, showSuccessToast } from "../../utils";
import { Colors, Images, auth } from "../../config";
import {
  View,
  TextInput,
  Button,
  FormErrorMessage,
  Logo,
} from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopBar from "../../components/TopBar";

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");

  const handleSendPasswordResetEmail = (values) => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showSuccessToast("Success: Password Reset Email sent.");
        navigation.navigate("Login");
      })
      .catch((error) => setErrorState(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Logo uri={Images.logo} />
        <View style={styles.innerContainer}>
          <Text style={styles.screenTitle}>Reset your password</Text>
        </View>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={passwordResetSchema}
          onSubmit={(values) => handleSendPasswordResetEmail(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <>
              <View style={styles.emailContainer}>
                {/* Email input field */}
                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                {/* Display Screen Error Mesages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                {/* Password Reset Send Email  button */}
                {/* <Button style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </Button> */}
              </View>
              <View style={{ height: 0 }} />
              <NocapButton title={"Send Reset Email"} onPress={handleSubmit} />
            </>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        {/* <Button
        style={styles.borderlessButtonContainer}
        borderless
        title={"Go back to Login"}
        onPress={() => navigation.navigate("Login")}
      /> */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 220 }}>
            <NocapButton
              title={"Log In"}
              onPress={() => navigation.navigate(StackNav.Login)}
              titleStyle={{ fontSize: 16 }}
              containerWidth={220}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  innerContainer: {
    paddingTop: 0,
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    color: Colors.white,
    fontFamily: "Kanit-Bold",
    textAlign: "center",
  },
  emailContainer: {
    paddingTop: 20,
    paddingHorizontal: 64,
  },
});
