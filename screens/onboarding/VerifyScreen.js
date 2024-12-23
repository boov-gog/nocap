import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, Image } from "react-native";
import { sendEmailVerification, signOut } from "firebase/auth";

import { auth, Colors, Images } from "../../config";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator, Logo } from "../../components";
import NocapButton from "../../components/NocapButton";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast, showSuccessToast } from "../../utils";
import { StackNav } from "../../navigation/NavigationKeys";
import { signinUser, updateUser } from "../../services/userService";
import { isObject } from "formik";

import { useTranslation } from "react-i18next";

export const VerifyScreen = ({ navigation }) => {
  const { t } = useTranslation(); 

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const { user, setUser } = useContext(AuthenticatedUserContext);

  const checkUser = async () => {
    // console.log("VerifyScreen User:", user);

    if (user) {
      setIsEmailVerified(user.emailVerified);
      if (user.id) {
        if (user.emailVerified) {
          setShowSuccess(true);
        }
      } else {
        setIsSigning(true);
        try {
          const registeredUser = await signinUser(user.email);

          setUser({ ...user, ...registeredUser });
        } catch (error) {
          // console.log("Error signing in to backend:", error);

          try {
            await signOut(auth);
            setUser(null);
          } catch (error) {
            // console.log("Error signing out:", error);
          }
        }
        setIsSigning(false);
      }
    } else {
      showErrorToast("You are signed out.");
      navigation.reset({
        index: 0,
        routes: [{ name: StackNav.Start }],
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user]);

  const handleSendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      showSuccessToast("Verification email sent. Please check your inbox.");
    } catch (error) {
      // console.log("Error sending verification email:", error);
      showErrorToast("Failed to send verification email. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); 
      await updateUser(user.id, {isOnline: false}); 
      setUser(null); 
    } catch (error) {
      // console.log("Error signing out:", error);
    }
  };

  const checkEmailVerification = async () => {
    if (isEmailVerified) return;

    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      setIsEmailVerified(true);
      if (user.id) {
        setShowSuccess(true);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkEmailVerification, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: StackNav.WaitingRoom }],
        });
      }, 2000);
    }
  }, [showSuccess]);

  return (
    <SafeAreaView style={styles.container}>
      <Logo uri={Images.logo} />
      {isSigning ? (
        <LoadingIndicator />
      ) : (
        <View style={styles.mainContainer}>
          {!isEmailVerified && (
            <>
              <NocapButton
                title={t("verifyYourEmail")}
                onPress={handleSendVerificationEmail}
              />
              <NocapButton title={t("signout")} onPress={handleSignOut} />
            </>
          )}
          {showSuccess && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{t("verified")}</Text>
              <Image source={Images.success} style={styles.successGif} />
            </View>
          )}
        </View>
      )}
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
    flex: 1,
    alignItems: "center",
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    color: "green",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  successGif: {
    width: 150,
    height: 150,
  },
});
