import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";

import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticatedUserContext } from "../providers";
import { Logo } from "../components";
import { Images, Colors, auth } from "../config";
import NocapButton from "../components/NocapButton";
import { StackNav } from "../navigation/NavigationKeys";

export const ProfileScreen = ({ navigation }) => {
  const { setUser } = useContext(AuthenticatedUserContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);

      navigation.reset({
        index: 0,
        routes: [{ name: StackNav.Start }],
      });
    } catch (error) {
      console.log("Error logging out: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <NocapButton title={"Sign Out"} onPress={handleLogout} />
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
});
