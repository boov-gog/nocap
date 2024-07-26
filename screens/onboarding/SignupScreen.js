import React, { useContext, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  View,
  TextInput,
  Logo,
  Button,
  FormErrorMessage,
} from "../../components";
import { Images, Colors, auth } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks";
import {
  emailValidationSchema,
  showErrorToast,
  signupValidationSchema,
} from "../../utils";
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

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const { setEmail } = useContext(AuthenticatedUserContext);

  const handleSignup = async (values) => {
    if (!checked) {
      showErrorToast("Please agree to our policy");
      return;
    }
    const { email } = values;
    setEmail(email);
    // createUserWithEmailAndPassword(auth, email, password).catch((error) =>
    //   setErrorState(error.message)
    // );
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
            // password: "123456",
            // confirmPassword: "123456",
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
                {/* <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="newPassword"
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                <TextInput
                  name="confirmPassword"
                  leftIconName="key-variant"
                  placeholder="Confirm password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={confirmPasswordVisibility}
                  textContentType="password"
                  rightIcon={confirmPasswordIcon}
                  handlePasswordVisibility={handleConfirmPasswordVisibility}
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                />
                <FormErrorMessage
                  error={errors.confirmPassword}
                  visible={touched.confirmPassword}
                /> */}
                {/* Display Screen Error Messages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
              </View>

              {/* Signup button */}
              {/* <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Signup</Text>
              </Button> */}
              <NocapButton title={"Create Account"} onPress={handleSubmit} />
            </View>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        {/* <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Already have an account?"}
          onPress={() => navigation.navigate("Login")}
        /> */}
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
