import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors, Images } from "../config";
import Carousel from "../components/Carousel";

const deviceWidth = Dimensions.get("window").width;

const SubscriptionScreen = () => {
  const carouselImages = [Images.subscription1, Images.subscription2];

  return (
    <SafeAreaView style={styles.container}>
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
          <Image style={styles.starBack} source={Images.star1} />
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
    top: 200,
    width: 152,
    height: 112,
  },
  proLetter: {
    position: "absolute",
    top: 230,
  },
  logo: {
    marginTop: 150,
    width: deviceWidth * 0.7,
    height: deviceWidth * 0.7 * 0.3,
  },
  price: {
    marginTop: 5,
    color: "white",
    fontSize: 14,
  },
  buttonContainer: {
    position: "relative",
    marginTop: 72,
    width: 350,
    height: 175,
    justifyContent: "center",
    alignItems: "center",
  },
  unlockBtn: {
    borderWidth: 3,
    borderColor: "#FF8A00",
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
