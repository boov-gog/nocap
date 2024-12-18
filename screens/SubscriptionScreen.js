import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Colors, Images } from "../config";
import Carousel from "../components/Carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar"; 

import * as InAppPurchases from "expo-in-app-purchases";
import { getAuth, updateProfile } from "firebase/auth"; 

import { AuthenticatedUserContext } from "../providers"; 
import { updateUser } from "../services/userService"; 
import { showErrorToast, showSuccessToast } from "../utils"; 
import { StackNav } from "../navigation/NavigationKeys";

const deviceWidth = Dimensions.get("window").width;

import { useTranslation } from "react-i18next";

const SubscriptionScreen = ( { navigation } ) => {
  const { t } = useTranslation(); 

  const carouselImages = [Images.subscription1, Images.subscription2];

  const { user, setUser } = useContext(AuthenticatedUserContext); 

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const initIAP = async () => {
      await InAppPurchases.connectAsync();
      await fetchProducts();
    };

    initIAP();

    return () => {
      InAppPurchases.disconnectAsync();
    };
  }, []);

  const fetchProducts = async () => {
    const { responseCode, results } = await InAppPurchases.getProductsAsync(['subscription_id']);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      setProducts(results);
    }
  };

  const purchaseSubscription = async () => { 
    try {
      const updatedUser = await updateUser(user.id, { isSubscribed: true }); 
      setUser({ ...user, ...updatedUser }); 

      showSuccessToast("Subscribed successfully!"); 

      navigation.navigate(StackNav.Profile);

      // console.log("Subscribed successfully: ", updatedUser); 
    } catch(error) {
      // console.log("Err: ", error); 
    }

    // const { responseCode } = await InAppPurchases.purchaseItemAsync(productId);
    // if (responseCode !== InAppPurchases.IAPResponseCode.OK) {
    //   // console.log('Error purchasing item:', responseCode);
    // }
  };

  useEffect(() => {
    const subscription = InAppPurchases.setPurchaseListener(purchase => {
      if (purchase && purchase.responseCode === InAppPurchases.IAPResponseCode.OK && !purchase.acknowledged) {
        // console.log('Successfully purchased:', purchase);
        InAppPurchases.finishTransactionAsync(purchase, false);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false} 
      >
        <Image style={styles.starLogo} source={Images.star2} />
        <Image style={styles.proLetter} source={Images.proLetter} />
        <Image style={styles.logo} source={Images.logoNoback} />

        <Carousel images={carouselImages} />
        <Text style={styles.price}>$4/WK</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.unlockBtn}
            onPress={() => {
              purchaseSubscription()
            }}
          >
            <Image style={styles.lockAvatar} source={Images.lockerBlack} />
            <Text style={styles.unlockBtnTxt}>{t("unlock")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.subscriptionBack,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContentContainer: {
    alignItems: "center",
  },
  starLogo: {
    position: "absolute",
    top: 80,// 150
    width: 150, //152
    height: 100, //112
  },
  proLetter: {
    position: "absolute",
    top: 105,
  },
  logo: {
    marginTop: 30, // 80
    width: deviceWidth * 0.7,
    height: deviceWidth * 0.7 * 0.3,
  },
  price: {
    marginTop: 15,
    color: "white",
    fontSize: 24,
  },
  buttonContainer: {
    position: "relative",
    marginTop: 0, // 60
    width: 300, // 300
    height: 150, //175
    justifyContent: "center",
    alignItems: "center",
  },
  unlockBtn: {
    borderWidth: 3,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    gap: 17,
    backgroundColor: "white",
  },
  starBack: {
    position: "absolute",
    width: 350,
    height: 175,
  },
  lockAvatar: {
    width: 30,
    height: 40,
  },
  unlockBtnTxt: {
    fontSize: 36,
  },
});
