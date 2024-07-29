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

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    setChecked((prevState) => !prevState);
  };

  const { setEmail } = useContext(AuthenticatedUserContext);

  const handleSignup = async (values) => {
    if (!checked) {
      showErrorToast("Please agree to our policy");
      return;
    }
    const { email } = values;
    setEmail(email);

    navigation.navigate(StackNav.Age);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* LogoContainer: consist app logo and screen title */}
        <Logo uri={Images.logo} />

        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            email: "",
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
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoFocus={true}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <View style={styles.checkContainer}>
                  <CheckBox
                    checked={checked}
                    onPress={handleChecked}
                    style={styles.checkBox}
                  />
                  <Text style={styles.checkText}>
                    You agree to our privacy policy
                  </Text>
                </View>
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                {/* Display Screen Error Messages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
              </View>

              {/* Signup button */}
              <NocapButton title={"Create Account"} onPress={handleSubmit} />
            </View>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 220 }}>
            <NocapButton
              title={"Log In"}
              titleStyle={{ fontSize: 16 }}
              onPress={() => navigation.navigate(StackNav.Login)}
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
    backgroundColor: Colors.blackBlue,
    paddingHorizontal: 12,
  },
  formContainer: {
    paddingTop: 350,
  },
  inputContainer: {
    paddingHorizontal: 60,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
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
