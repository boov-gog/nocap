import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors, Images } from "../config";
import { TextInput } from "../components";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { GENDER_TYPE } from "../utils";

const ReplyScreen = ({ navigation }) => {
  const { cap } = useRoute().params;

  const gamer = cap?.userGamer;
  const gender = gamer?.gender;

  let title =
    gamer?.firstName + (gamer?.firstName ? " " : "") + gamer?.lastName;

  if (cap?.isUnlocked == false) {
    title =
      gender == GENDER_TYPE.Boy
        ? "From a Boy"
        : gender == GENDER_TYPE.Girl
        ? "From a Girl"
        : "From Someone";
  }

  title = `${title} in the ${gamer?.grade} grade.`;

  const gamerAvatar =
    gender == GENDER_TYPE.Boy
      ? Images.boy
      : gender == GENDER_TYPE.Girl
      ? Images.girl
      : Images.nonBinary;

  const mainBackColor =
    gender == GENDER_TYPE.Boy
      ? Colors.mainBlue
      : gender == GENDER_TYPE.Girl
      ? Colors.mainPink
      : gender == GENDER_TYPE.NonBinary
      ? Colors.mainGreen
      : Colors.blackBlue;

  const predefinedReplies = [
    "Back at ya <3",
    "On that rizz",
    "Say less",
    "Bet",
    "Tell me more;)",
    "This fits you more than me;)",
    "You made my day",
    "You’re too kind",
  ];

  const oneReplyItem = ({ item }) => (
    <View style={styles.oneReplyItem}>
      <Text
        style={styles.oneReplyItemText}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item}
      </Text>
    </View>
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSend = () => {};

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: mainBackColor }]}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Reply To</Text>
        <Text style={styles.question} numberOfLines={3} ellipsizeMode="tail">
          {cap?.question?.value}
        </Text>
        <Image style={styles.avatar} source={gamerAvatar} />
        <Text style={styles.nameGrade}>{title}</Text>

        <View style={styles.answerListContainer}>
          <View style={{ paddingHorizontal: 10 }}>
            <TextInput
              leftIconName={"magnify"}
              placeholder="Search..."
              borderLess={true}
            />
          </View>

          <FlatList
            numColumns={2}
            data={predefinedReplies}
            renderItem={oneReplyItem}
            keyExtractor={(item, index) => index}
            style={styles.answerList}
            contentContainerStyle={styles.answerListContent}
          />
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.bottomLeft}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.bottomRight}
              source={Images.userPerson}
            ></Image>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendBtn}>
          <Text style={styles.sendBtnTxt}>SEND</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReplyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    paddingHorizontal: 71,
    paddingVertical: 10,
    marginTop: 30,
  },
  question: {
    marginTop: 5,
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    marginTop: 30,
  },
  nameGrade: {
    fontWeight: "700",
    fontSize: 16,
    paddingHorizontal: 50,
    paddingVertical: 10,
    textAlign: "center",
  },
  answerListContainer: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    paddingHorizontal: 5,
    paddingTop: 12,
    flex: 1,
  },
  answerList: {
    marginTop: 4,
  },
  answerListContent: {
    paddingBottom: 16,
  },
  oneReplyItem: {
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 5,
  },
  oneReplyItemText: {
    padding: 10,
    textAlign: "center",
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
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
  sendBtn: {
    position: "absolute",
    bottom: 60,
    backgroundColor: "black",
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
    paddingVertical: 16,
  },
  sendBtnTxt: {
    fontFamily: "MPR-Bold",
    fontSize: 24,
    color: "white",
  },
});
