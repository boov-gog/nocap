import { StyleSheet, View, Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator, Logo } from "../components";
import { auth, Colors, Images } from "../config";
import NocapButton from "../components/NocapButton";
import { StackNav } from "../navigation/NavigationKeys";
import { onAuthStateChanged } from "firebase/auth";
import { AuthenticatedUserContext } from "../providers";

import { TouchableOpacity } from "react-native-gesture-handler"; 
import { useTranslation } from 'react-i18next';

import i18n from '../i18n'; 

export const StartScreen = (props) => { 
  const { t } = useTranslation(); 

  const [isLoading, setIsLoadig] = useState(true);
  const { setUser } = useContext(AuthenticatedUserContext);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const handleStart = () => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: StackNav.Login }],
    });
  }; 

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
        routes: [{ name: StackNav.Verify }],
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
            <NocapButton title={t('start')} onPress={handleStart} />
            <View style={styles.lngBtnContainer}>
              <View style={styles.lngBtnWrapper}>
                <TouchableOpacity
                  style={styles.lngBtn}
                  onPress={() => { changeLanguage('en') }}
                >
                  <Text
                    style={styles.lngText}
                    numberOfLines={1}
                    ellipsizeMode="head"
                  >
                    Eng
                  </Text>
                </TouchableOpacity>
                <Image
                  source={require('../assets/flag_us.png')} // Replace with your image path
                  style={styles.lngImage}
                />
              </View>
              <View style={styles.lngBtnWrapper}>
                <TouchableOpacity
                  style={styles.lngBtn}
                  onPress={() => { changeLanguage('es') }}
                >
                  <Text
                    style={styles.lngText}
                    numberOfLines={1}
                    ellipsizeMode="head"
                  >
                    Esp
                  </Text>
                </TouchableOpacity>
                <Image
                  source={require('../assets/flag_spain.png')} // Replace with your image path
                  style={styles.lngImage}
                />
              </View>
            </View>
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
  lngBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  lngBtnWrapper: {
    marginHorizontal: '2.5%', 
    alignItems: 'center',  
  },
  lngBtn: {
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "white",
    gap: 8, 
    width: '100%', 
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  lngText: {
    fontFamily: "Kanit-Bold",
    fontSize: 24,
  }, 
  lngImage: {
    width: 50, 
    height: 50, 
    marginTop: 5, 
  },
});
