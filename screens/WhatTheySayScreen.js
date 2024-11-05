import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { LoadingIndicator, Logo } from "../components";
import { Colors, Images } from "../config";
import AnswerButton from "../components/AnswerButton";
import { StackNav } from "../navigation/NavigationKeys";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRestCap, updateCapPublicity } from "../services/capService";
import { GENDER_TYPE, showErrorToast } from "../utils";
import ToggleSwitch from "toggle-switch-react-native"; 

import { AuthenticatedUserContext } from "../providers"; 
import { updateUser } from "../services/userService"; 

const { width: deviceWidth } = Dimensions.get("window");

const WhatTheySayScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  const { id } = useRoute().params;
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [cap, setCap] = useState(null);
  const [toggleState, setToggleState] = useState(false); 

  const [gamerDescription, setGamerDescription] = useState(''); 

  const init = async () => {
    setIsLoading(true);
    try {
      const cap = await getRestCap(id);
      setCap(cap);
      setToggleState(cap?.showToOthers);
    } catch (error) {
      console.error(`Error getting cap by id: ${id}`, error);
      showErrorToast("Error getting cap. Please try again.");
      navigation.goBack();
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      init(); 
    }, [])
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleReply = () => {
    navigation.navigate(StackNav.ReplyTo, { cap });
  };

  const handleSeeWhoSaid = async () => { 
    if(user.isSubscribed) { 
      if(user.viewTokens > 0) { 
        setGamerDescription(gamer?.firstName + (gamer?.firstName ? " " : "") + gamer?.lastName); 

        const updatedUser = await updateUser(user.id, { viewTokens: user.viewTokens - 1 }); 
        setUser({ ...user, ...updatedUser }); 
      } else {
        showErrorToast("You have no available tokens to view the user name."); 
      }
    } else {
      navigation.navigate(StackNav.Subscription);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await updateCapPublicity(id, !toggleState);
      setToggleState(!toggleState);
    } catch (error) {
      console.error(`Error update cap by id: ${id}`, error);
      showErrorToast("Error update cap. Please try again.");
    }
    setIsToggling(false);
  };

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

  useEffect(() => { 
    title =
    gender == GENDER_TYPE.Boy
      ? "From a Boy"
      : gender == GENDER_TYPE.Girl
      ? "From a Girl"
      : "From Someone"; 

    setGamerDescription(`${title} in the ${gamer?.grade} grade.`); 
  }, []); 

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: mainBackColor }]}
    >
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView
          style={styles.scrollViewer}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.showToOthers}>
            {isToggling ? (
              <LoadingIndicator indicatorSize={40} />
            ) : (
              <ToggleSwitch
                isOn={toggleState}
                onColor="green"
                label="Show to others"
                labelStyle={{ fontFamily: "MPR-Bold", fontSize: 20 }}
                size="large"
                onToggle={handleToggle}
              />
            )}
          </View>
          <Logo
            uri={Images.logoNoback}
            style={Dimensions.get("window").width <= 360 ? { height: 0 } : null}
          />
          <Image style={styles.avatar} source={gamerAvatar} />
          <Text style={styles.description}> 
            {gamerDescription}
          </Text>
          <TouchableOpacity
            style={styles.whoSayButton}
            onPress={handleSeeWhoSaid}
          >
            <Image style={styles.lockAvatar} source={Images.lockerBlack} />
            <Text style={styles.btnText}>See who said this</Text>
          </TouchableOpacity> 
          {user?.isSubscribed && <Text style={styles.viewTokens}>Amount of tokens: { user.viewTokens }</Text>}
          <Text style={styles.question} numberOfLines={3} ellipsizeMode="tail">
            {cap?.question?.value}
          </Text>
          <View style={styles.answersContainer}>
            <View style={styles.answerRow}>
              <View style={{ flex: 1 }}>
                <AnswerButton
                  clickable={false}
                  selected={true}
                  name={cap?.nameInAnswer}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AnswerButton clickable={false} name={cap?.noanswer1} />
              </View>
            </View>
            <View style={styles.answerRow}>
              <View style={{ flex: 1 }}>
                <AnswerButton clickable={false} name={cap?.noanswer2} />
              </View>
              <View style={{ flex: 1 }}>
                <AnswerButton clickable={false} name={cap?.noanswer3} />
              </View>
            </View>
          </View>

          {cap?.reply == null ? (
            <TouchableOpacity style={styles.replyBtn} onPress={handleReply}>
              <Image style={styles.lockAvatar} source={Images.lockerBlack} />
              <Text style={styles.replyBtnText}>Reply</Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={styles.replyText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {"You replied : " + cap?.replySentence?.content}
            </Text>
          )}

          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnTxt}>Share</Text>
            <Image style={styles.shareBtnImage} source={Images.instagram} />
            <Image style={styles.shareBtnImage} source={Images.facebook} />
            <Image style={styles.shareBtnImage} source={Images.snapchat} />
          </TouchableOpacity>
        </ScrollView>
      )}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleBack}>
          <Image
            style={styles.bottomRight}
            source={Images.custombackIcon}
          ></Image>
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
    paddingBottom: 20,
  },
  showToOthers: {
    width: "100%",
    alignItems: "flex-end",
    padding: 10,
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
    fontSize: 20,
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
    fontSize: 20,
  },
  question: {
    width: "90%",
    height: 90,
    fontWeight: "700",
    marginVertical: 14,
    textAlign: "center",
    fontSize: 24,
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
  replyText: {
    fontFamily: "Kanit-Bold",
    fontSize: 20,
    textAlign: "center",
    width: "90%",
    paddingVertical: 10,
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 34,
    paddingVertical: 6,
  },
  bottomLeft: {
    fontSize: 24,
  },
  bottomRight: {
    width: 36,
    height: 26,
  }, 
  viewTokens: { 
    fontSize: 16, 
    fontWeight: "bold", 
  }
});
