import React, { useContext, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { loginValidationSchema } from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import TopBar from "../../components/TopBar";
import { AuthenticatedUserContext } from "../../providers";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const { setUser } = useContext(AuthenticatedUserContext);

  const handleLogin = async (values) => {
    const { email, password } = values;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        setUser(auth.currentUser);
        navigation.reset({
          index: 0,
          routes: [{ name: StackNav.Home }],
        });
      }
    } catch (error) {
      setErrorState(error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
      >
        {/* LogoContainer: consist app logo and screen title */}
        <Logo uri={Images.logo} />
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => handleLogin(values)}
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
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="password"
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
                {/* Display Screen Error Messages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
              </View>

              {/* Login button */}
              <View style={{ paddingTop: 20 }} />
              <NocapButton title="Log In" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
        {/* Button to navigate to SignupScreen to create a new account */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={{ width: 220 }}>
            <NocapButton
              title={"Create Account"}
              onPress={() => navigation.navigate(StackNav.Signup)}
              titleStyle={{ fontSize: 16 }}
              containerWidth={220}
            />
          </View>
          <View style={{ width: 220 }}>
            <NocapButton
              title={"Forgot Password?"}
              onPress={() => navigation.navigate(StackNav.ForgotPassword)}
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
    backgroundColor: Colors.blackBlue,
    paddingHorizontal: 12,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  formContainer: {
    paddingTop: 0,
  },
  inputContainer: {
    paddingHorizontal: 60,
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
