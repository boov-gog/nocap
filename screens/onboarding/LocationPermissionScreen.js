import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator, Logo } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast, showSuccessToast } from "../../utils";
import * as Location from "expo-location";

export const LocationPermissionScreen = (props) => {
  const [isGettingPermission, setIsGettingPermission] = useState(false);

  const { setLocation } = useContext(AuthenticatedUserContext);

  const handleNext = async () => {
    setIsGettingPermission(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showErrorToast("Permission to access location was denied");
      setIsGettingPermission(false);
      return;
    } else {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      showSuccessToast(
        `Your location is ${location.coords.latitude}, ${location.coords.longitude}`
      );

      props.navigation.navigate(StackNav.School);
      setIsGettingPermission(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>To find your school</Text>

        {isGettingPermission ? (
          <LoadingIndicator />
        ) : (
          <NocapButton
            title="Allow Access to Location"
            onPress={handleNext}
            titleStyle={{ fontSize: 26 }}
          />
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
    paddingTop: 0,
    alignItems: "center",
  },
  titleStyle: {
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    color: Colors.white,
  },
  inputStyle: {
    marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.white,
  },
});
