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
import TopBar from "../../components/TopBar";

import { useTranslation } from "react-i18next";

export const LocationPermissionScreen = (props) => {
  const { t } = useTranslation(); 

  const [isGettingPermission, setIsGettingPermission] = useState(false);

  const getCurrentLocationWithTimeout = async () => {
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Location request timed out")), 10000)
    );

    return Promise.race([locationPromise, timeoutPromise]);
  };

  const handleNext = async () => {
    setIsGettingPermission(true);
    try {
      let isLocationServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationServicesEnabled) {
        showErrorToast("Location services are disabled");
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showErrorToast("Permission to access location was denied");
      } else {
        let location = await getCurrentLocationWithTimeout();

        // showSuccessToast(
        //   `Your location is ${location.coords.latitude}, ${location.coords.longitude}`
        // );

        props.navigation.navigate(StackNav.School, {
          location: location.coords,
        });
      }
    } catch (error) {
      console.log(error.message);
      showErrorToast("Unable to fetch location: " + error.message);
    }
    setIsGettingPermission(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <Logo uri={Images.logo} />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>{t("toFindYourSchool")}</Text>

        {isGettingPermission ? (
          <LoadingIndicator />
        ) : (
          <NocapButton
            title={t("allowAccessToLocation")}
            onPress={handleNext}
            titleStyle={{ fontSize: 22 }}
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
    flex: 1,
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
