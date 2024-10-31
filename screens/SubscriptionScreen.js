import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors, Images } from "../config";
import Carousel from "../components/Carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";

const deviceWidth = Dimensions.get("window").width;

const SubscriptionScreen = () => {
  const carouselImages = [Images.subscription1, Images.subscription2];

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Image style={styles.starLogo} source={Images.star2} />
        <Image style={styles.proLetter} source={Images.proLetter} />
        <Image style={styles.logo} source={Images.logoNoback} />

        <Carousel images={carouselImages} />
        <Text style={styles.price}>$4/WK</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.unlockBtn}>
            <Image style={styles.lockAvatar} source={Images.lockerBlack} />
            <Text style={styles.unlockBtnTxt}>UNLOCK</Text>
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
    top: 130,
    width: 152,
    height: 112,
  },
  proLetter: {
    position: "absolute",
    top: 160,
  },
  logo: {
    marginTop: 80,
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
    marginTop: 60,
    width: 350,
    height: 175,
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
