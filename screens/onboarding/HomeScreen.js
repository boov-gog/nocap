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
import { signinUser } from "../../services/userService";

export const HomeScreen = ({ navigation }) => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const { user, setUser } = useContext(AuthenticatedUserContext);

  const checkUser = async () => {
    console.log("HomeScreen User:", user);

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
          console.error("Error signing in to backend:", error);

          await signOut(auth);
          setUser(null);
        }
        setIsSigning(false);
      }
    } else {
      showErrorToast("Failed to sign in. Please try again.");
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
      console.error("Error sending verification email:", error);
      showErrorToast("Failed to send verification email. Please try again.");
    }
  };

  const handleGoToProfile = () => {
    navigation.replace(StackNav.Profile, {});
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
                title="Verify your email"
                onPress={handleSendVerificationEmail}
              />
              <NocapButton title="My Profile" onPress={handleGoToProfile} />
            </>
          )}
          {showSuccess && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>Verified!</Text>
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
