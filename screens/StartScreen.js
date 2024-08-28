import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator, Logo } from "../components";
import { auth, Colors, Images } from "../config";
import NocapButton from "../components/NocapButton";
import { StackNav } from "../navigation/NavigationKeys";
import { onAuthStateChanged } from "firebase/auth";
import { AuthenticatedUserContext } from "../providers";

export const StartScreen = (props) => {
  const [isLoading, setIsLoadig] = useState(true);
  const { setUser } = useContext(AuthenticatedUserContext);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const handleStart = () => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: StackNav.Login }],
    });
  };

  useEffect(() => {
    const firebaseAuthStateTracker = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setUser(user);
      }

      setIsLoadig(false);
    });

    return firebaseAuthStateTracker;
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      console.log("Firebase User:", firebaseUser);

      props.navigation.reset({
        index: 0,
        routes: [{ name: StackNav.Home }],
      });
    }
  }, [firebaseUser]);

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
