import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, Image } from "react-native";
import { sendEmailVerification, signOut } from "firebase/auth";

import { auth, Colors, Images } from "../../config";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../components";
import NocapButton from "../../components/NocapButton";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast, showSuccessToast } from "../../utils";
import { StackNav } from "../../navigation/NavigationKeys";

export const HomeScreen = ({ navigation }) => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    console.log("HomeScreen User:", user);
    if (user) {
      setIsEmailVerified(user.emailVerified);
      if (user.emailVerified) setShowSuccess(true);
    }
  }, []);

  const handleSendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      showSuccessToast("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      showErrorToast("Failed to send verification email. Please try again.");
    }
  };

  const checkEmailVerification = async () => {
    if (isEmailVerified) return;

    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      setIsEmailVerified(true);
      setShowSuccess(true);
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
      <View style={styles.mainContainer}>
        {!isEmailVerified && (
          <NocapButton
            title="Verify your email"
            onPress={handleSendVerificationEmail}
          />
        )}
        {showSuccess && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Verified!</Text>
            <Image source={Images.success} style={styles.successGif} />
          </View>
        )}
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
