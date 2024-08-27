import React, { useContext, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signOut,
} from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  View,
  TextInput,
  Logo,
  Button,
  FormErrorMessage,
  LoadingIndicator,
} from "../../components";
import { Images, Colors, auth } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks";
import {
  showErrorToast,
  showSuccessToast,
  signupValidationSchema,
} from "../../utils";
import { SafeAreaView } from "react-native-safe-area-context";
// import { StackNav } from "../../navigation/NavigationKeys";
import NocapButton from "../../components/NocapButton";
import { AuthenticatedUserContext } from "../../providers";
import TopBar from "../../components/TopBar";
import {
  deleteUserByEmail,
  insertFriends,
  registerUser,
} from "../../services/userService";
import { StackNav } from "../../navigation/NavigationKeys";

export const PasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [processing, setProcessing] = useState(false);

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const {
    user,
    setUser,
    email,
    age,
    firstName,
    lastName,
    gender,
    grade,
    school,
    phone,
    friends,
  } = useContext(AuthenticatedUserContext);

  const signUp = async () => {
    const userData = {
      email,
      age,
      firstName,
      lastName,
      gender,
      grade,
      school,
      phone,
    };

    try {
      const createdUser = await registerUser(userData);

      setUser({ ...user, ...createdUser });

      if (friends.length > 0) {
        try {
          await insertFriends(createdUser.id, friends);
        } catch (error) {
          console.error("Error inserting friends:", error);
          showErrorToast("Error inserting friends. Please try again later.");
        }
      }

      showSuccessToast("You are registered successfully!");

      navigation.reset({
        index: 0,
        routes: [{ name: StackNav.Home }],
      });
    } catch (error) {
      console.error("Error signing up user:", error);
      showErrorToast(error);

      deleteUser(auth.currentUser).catch((error) => {
        console.error("Error deleting firebase user:", error);
      });

      try {
        console.log("Deleting backend user:", email);
        const res = await deleteUserByEmail(email);
        console.log("Delete user response:", res);
      } catch (error) {
        console.error("Error deleting backend user:", error);
      }
    }
  };

  const handleSignup = async (values) => {
    const { password } = values;
    console.log("Email", email, "Password", password);

    try {
      setProcessing(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const user = await getAuth().currentUser;
      if (user) {
        setUser(getAuth().currentUser);
        signUp();
      }
    } catch (error) {
      setErrorState(error.message);
    }
    setProcessing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* LogoContainer: consist app logo and screen title */}
        <Logo uri={Images.logo} />

        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupValidationSchema}
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
                {/* <TextInput
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
                /> */}
                <TextInput
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
                />
                {/* Display Screen Error Messages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
              </View>

              {/* Signup button */}
              {/* <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Signup</Text>
              </Button> */}
              {processing ? (
                <View style={{ width: "100%", marginTop: 30 }}>
                  <LoadingIndicator />
                </View>
              ) : (
                <NocapButton title={"Done!"} onPress={handleSubmit} />
              )}
            </View>
          )}
        </Formik>
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
    paddingBottom: 50,
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
