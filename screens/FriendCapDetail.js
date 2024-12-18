import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { LoadingIndicator, Logo } from "../components";
import { Colors, Images } from "../config";
import AnswerButton from "../components/AnswerButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRestCap } from "../services/capService";
import { GENDER_TYPE, showErrorToast } from "../utils";

const FriendCapDetail = ({ navigation }) => {
  const { id } = useRoute().params;
  const [isLoading, setIsLoading] = useState(false);
  const [cap, setCap] = useState(null);

  const init = async () => {
    setIsLoading(true);
    try {
      const cap = await getRestCap(id);
      setCap(cap);
    } catch (error) {
      // console.log(`Error getting cap by id: ${id}`, error);
      showErrorToast("Error getting cap. Please try again.");
      navigation.goBack();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const handleBack = () => {
    navigation.goBack();
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
          showsVerticalScrollIndicator={false} 
          style={styles.scrollViewer}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <Logo
            uri={Images.logoNoback}
            style={Dimensions.get("window").width <= 360 ? { height: 0 } : null}
          />
          <Image style={styles.avatar} source={gamerAvatar} />
          <Text style={styles.description}>
            {title} in the {gamer?.grade} grade.
          </Text>
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

export default FriendCapDetail;

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
  avatar: {
    width: 100,
    height: 100,
  },
  description: {
    fontWeight: "700",
    fontSize: 20,
    padding: 10,
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
  bottomBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 34,
    paddingVertical: 6,
  },
  bottomRight: {
    width: 36,
    height: 26,
  },
});
