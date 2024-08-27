import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator, Logo } from "../components";
import { auth, Colors, Images } from "../config";
import NocapButton from "../components/NocapButton";
import { StackNav } from "../navigation/NavigationKeys";
import { onAuthStateChanged } from "firebase/auth";
import { signinUser } from "../services/userService";
import { AuthenticatedUserContext } from "../providers";

export const StartScreen = (props) => {
  const [isLoading, setIsLoadig] = useState(true);
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [localUser, setLocalUser] = useState(null);

  const handleStart = () => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: StackNav.Login }],
    });
  };

  const { width } = Dimensions.get("window");

  const signIn = async (email) => {
    setIsLoadig(true);
    try {
      const registeredUser = await signinUser(email);

      console.log("Registered User:", registeredUser);
      console.log("StartScreen User:", user);

      setUser({ ...localUser, ...registeredUser });

      props.navigation.reset({
        index: 0,
        routes: [{ name: StackNav.Home }],
      });
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
    setIsLoadig(false);
  };

  useEffect(() => {
    const firebaseAuthStateTracker = onAuthStateChanged(auth, async (user) => {
      if (user) setLocalUser(user);

      setIsLoadig(false);
    });

    return firebaseAuthStateTracker;
  }, []);

  useEffect(() => {
    if (localUser) {
      console.log("Local User:", localUser);
      signIn(localUser.email);
    }
  }, [localUser]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Logo uri={Images.logo} />
          <View style={styles.btnContainer}>
            <NocapButton title="Start" onPress={handleStart} />
          </View>
        </>
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
  btnContainer: {
    position: "absolute",
    bottom: 92,
  },
});
