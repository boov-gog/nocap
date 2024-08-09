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
import { useRoute } from "@react-navigation/native";
import { Logo } from "../components";
import { Colors, Images } from "../config";
import AnswerButton from "../components/AnswerButton";
import { StackNav } from "../navigation/NavigationKeys";

const { width: deviceWidth } = Dimensions.get("window");

const WhatTheySayScreen = ({ navigation }) => {
  const { item } = useRoute().params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleReply = () => {
    navigation.navigate(StackNav.ReplyTo);
  };

  const handleSeeWhoSaid = () => {
    navigation.navigate(StackNav.Subscription);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.mainPink }]}
    >
      <ScrollView
        style={styles.scrollViewer}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <Image
          style={styles.logo}
          source={Images.logoLetter}
          resizeMode="contain"
        />
        <Image style={styles.avatar} source={Images.girl} />
        <Text style={styles.description}>From a girl in the XXXth grade.</Text>
        <TouchableOpacity
          style={styles.whoSayButton}
          onPress={handleSeeWhoSaid}
        >
          <Image style={styles.lockAvatar} source={Images.lockerBlack} />
          <Text style={styles.btnText}>See who said this</Text>
        </TouchableOpacity>
        <Text style={styles.question} numberOfLines={3} ellipsizeMode="tail">
          Question Text(Can be up to 3 lines, centered)
        </Text>
        <View style={styles.answersContainer}>
          <View style={styles.answerRow}>
            <AnswerButton clickable={false} name={"Name"} />
            <AnswerButton clickable={false} name={"Name"} />
          </View>
          <View style={styles.answerRow}>
            <AnswerButton
              clickable={false}
              selected={true}
              name={"Adrian Martin"}
            />
            <AnswerButton clickable={false} name={"Name"} />
          </View>
        </View>
        <TouchableOpacity style={styles.replyBtn} onPress={handleReply}>
          <Image style={styles.lockAvatar} source={Images.lockerBlack} />
          <Text style={styles.replyBtnText}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareBtnTxt}>Share</Text>
          <Image style={styles.shareBtnImage} source={Images.instagram} />
          <Image style={styles.shareBtnImage} source={Images.facebook} />
          <Image style={styles.shareBtnImage} source={Images.snapchat} />
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.bottomLeft}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={styles.bottomRight} source={Images.userPerson}></Image>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WhatTheySayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollViewer: {
    flex: 1,
    width: "100%",
  },
  scrollViewContainer: {
    alignItems: "center",
  },
  logo: {
    marginTop: 200,
    width: deviceWidth * 0.8,
    height: deviceWidth * 0.24,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  description: {
    fontWeight: "700",
    fontSize: 14,
    padding: 10,
  },
  whoSayButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 18.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lockAvatar: {
    width: 22,
    height: 30,
  },
  btnText: {
    fontFamily: "MPR-Bold",
    fontSize: 16,
  },
  question: {
    width: "90%",
    fontWeight: "700",
    paddingVertical: 14,
    textAlign: "center",
  },
  answersContainer: {
    width: "100%",
    paddingHorizontal: 24,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    borderRadius: 50,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 22,
    gap: 12.5,
    backgroundColor: "white",
  },
  replyBtnText: {
    fontWeight: "600",
    fontSize: 20,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    borderRadius: 50,
    borderWidth: 1,
    paddingVertical: 4.5,
    paddingHorizontal: 34,
    gap: 8,
    backgroundColor: "white",
  },
  shareBtnTxt: {
    fontWeight: "600",
    fontSize: 24,
  },
  shareBtnImage: {
    width: 30,
    height: 30,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 34,
    paddingVertical: 6,
  },
  bottomLeft: {
    fontSize: 24,
  },
  bottomRight: {
    width: 20,
    height: 26,
  },
});
