import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Colors, Images } from "../config";
import { GENDER_TYPE, showErrorToast, showSuccessToast } from "../utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import PlayButton from "../components/PlayButton";
import { StackNav } from "../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../providers";
import { fetchGameData } from "../services/gameService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingIndicator } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { Audio } from 'expo-av'; 
import { Icon } from "../components"; 

const WaitingRoom = ({ navigation }) => {
  const [pollTime, setPollTime] = useState("59:59");
  const [playEnable, setPlayEnable] = useState(true);
  const [checking, setChecking] = useState(true);

  const { user, onAudio } = useContext(AuthenticatedUserContext);

  const leaderList = [
    { name: "Xavier Tarkiniene", avatar: Images.boy, gender: GENDER_TYPE.Boy },
    { name: "Sarah Shneider", avatar: Images.girl, gender: GENDER_TYPE.Girl },
    {
      name: "Alabaster Greensmile",
      avatar: Images.nonBinary,
      gender: GENDER_TYPE.NonBinary,
    },
  ];

  let timer = null;

  const calculatePollTime = () => {
    // Calculate left time to the next right hour in UTC + 0.00 timezone
    const now = new Date();
    const nextHour = new Date(now);

    let isPaid = false;

    if (user.isSubscribed && (now.getUTCMinutes() < 30 || (now.getUTCMinutes() == 30 && now.getUTCSeconds() == 0))) {
      nextHour.setUTCHours(nextHour.getUTCHours());
      nextHour.setUTCMinutes(30);
      nextHour.setUTCSeconds(0);
      nextHour.setUTCMilliseconds(0);
      isPaid = true;
    } else {
      nextHour.setUTCHours(nextHour.getUTCHours() + 1);
      nextHour.setUTCMinutes(0);
      nextHour.setUTCSeconds(0);
      nextHour.setUTCMilliseconds(0);
      isPaid = false;
    }

    const leftTime = nextHour.getTime() - now.getTime();
    const leftTimeInSeconds = Math.floor(leftTime / 1000);
    const leftMinutes = Math.floor(leftTimeInSeconds / 60);
    const leftSeconds = leftTimeInSeconds % 60;
    setPollTime(
      `${leftMinutes.toString().padStart(2, "0")}:${leftSeconds
        .toString()
        .padStart(2, "0")}`
    );

    if (leftMinutes == 0 && leftSeconds == 0) {
      if (isPaid) {
        checkGamePaid();
      } else {
        checkGame();
      }
    }
  };

  const checkGame = async () => {
    console.log("checkGame_NonPaid"); 

    // showSuccessToast("Timer has run out!"); 

    setChecking(true);
    try {
      // check the game has already completed
      const roundId = await AsyncStorage.getItem("roundId");
      const gameData = await fetchGameData(user.id);

      // console.log("gameData: ", gameData); 

      //remove me in friends list
      gameData.friends = gameData.friends.filter((f) => f.id !== user.id);

      await AsyncStorage.setItem("friends", JSON.stringify(gameData.friends));

      if (roundId != gameData.roundId) {
        setPlayEnable(true);
      } else {
        let questions = await AsyncStorage.getItem("questions");
        questions = JSON.parse(questions);

        // console.log("questions: ", questions); 

        const unselectedQuestions = questions.filter(
          (q) => q.selected == false
        );

        if (unselectedQuestions.length == 0) {
          setPlayEnable(false);
        } else {
          setPlayEnable(true);
        }
      }
    } catch (error) {
      console.error("Error checking the game:", error);
      showErrorToast("Failed to initialize the game. Please try again.");
      setPlayEnable(false);
    }
    setChecking(false);
  };

  const checkGamePaid = async () => {
    console.log("checkGame_Paid"); 

    // showSuccessToast("Timer has run out!"); 

    setChecking(true);
    try {
      // check the game has already completed
      const roundId = await AsyncStorage.getItem("roundId");
      const gameData = await fetchGameData(user.id);

      //remove me in friends list
      gameData.friends = gameData.friends.filter((f) => f.id !== user.id);

      await AsyncStorage.setItem("friends", JSON.stringify(gameData.friends));

      if (roundId != gameData.roundId) {
        setPlayEnable(true);
      } else {
        let questions = await AsyncStorage.getItem("questions");
        questions = JSON.parse(questions);

        const unselectedQuestions = questions.filter(
          (q) => q.selected == false
        );

        if (unselectedQuestions.length == 0) {
          setPlayEnable(false);
        } else {
          setPlayEnable(true);
        }
      }
    } catch (error) {
      console.error("Error checking the game:", error);
      showErrorToast("Failed to initialize the game. Please try again.");
      setPlayEnable(false);
    }
    setChecking(false);
  };

  useFocusEffect(
    useCallback(() => {
      checkGame();
    }, [])
  );

  useEffect(() => {
    // Countdown timer for the poll time
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
      calculatePollTime();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBlueCapClick = () => {
    navigation.navigate(StackNav.MyCaps);
  };

  const handlePlay = async () => {
    try {
      if (onAudio) { 
        const sound = new Audio.Sound(); 
        if (playEnable) {
          await sound?.loadAsync(require('../assets/sounds/audio/enable.wav')); 
        } else {
          await sound?.loadAsync(require('../assets/sounds/audio/grey.wav'));
        }
        await sound.setVolumeAsync(1.0);
        await sound?.playAsync(); 
        sound?.setOnPlaybackStatusUpdate(status => {
          if (status?.didJustFinish) {
            sound?.unloadAsync(); 
          }
        });
      }

      const gameData = await fetchGameData(user.id);
      const roundId = await AsyncStorage.getItem("roundId");

      if (roundId != gameData.roundId) {
        await AsyncStorage.setItem("roundId", gameData.roundId.toString());
        await AsyncStorage.setItem(
          "questions",
          JSON.stringify(
            gameData.questions.map((q) => ({ ...q, selected: false }))
          )
        );
        await AsyncStorage.setItem("shuffle", "3");
        await AsyncStorage.setItem("skip", "3");
      }

      navigation.replace(StackNav.GamePage, {});
    } catch (error) {
      console.error("Error starting the game:", error);
      showErrorToast("Failed to start the game. Please try again.");
    }
  };

  const handleProfile = () => {
    navigation.navigate(StackNav.Profile);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.soundIcon}>
        <Icon
          name={onAudio? "volume-high": "volume-off"}
          size={32}
          color="black"
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewer}>
        <Text style={styles.title}>School Leaders</Text>
        <View style={styles.leaderListContainer}>
          {leaderList.map((value, index) => (
            <View style={styles.leaderListOne} key={index}>
              <Text style={styles.leaderListText} ellipsizeMode="tail">{`${index + 1
                }. ${value.name}`}</Text>
              <Image
                style={[
                  styles.leaderListImage,
                  {
                    backgroundColor:
                      value.gender == GENDER_TYPE.Boy
                        ? Colors.mainBlue
                        : value.gender == GENDER_TYPE.Girl
                          ? Colors.mainPink
                          : Colors.mainGreen,
                  },
                ]}
                source={value.avatar}
              ></Image>
            </View>
          ))}
        </View>
        <View style={styles.timerContainer}>
          <Image style={styles.lockImage} source={Images.locker} />
          <Text style={styles.timerBefore}>New polls in </Text>
          <Text style={styles.timerText}>{pollTime}</Text>
        </View>
        <Text style={styles.skipText}>Skip the wait</Text>
        <TouchableOpacity style={styles.inviteBtn}>
          <Image
            style={styles.inviteBtnImage}
            source={Images.inviteFrinedsBtn}
          />
          <Text style={styles.inviteBtnText}>Invite a friend</Text>
        </TouchableOpacity>
        {checking ? (
          <LoadingIndicator />
        ) : (
          <PlayButton onPress={handlePlay} playEnabled={playEnable} />
        )}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleBlueCapClick}>
          <Image style={{ width: 50, height: 35 }} source={Images.blueCap} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfile}>
          <Image
            style={{ width: 20, height: 26, marginTop: 2 }}
            source={Images.userPerson}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WaitingRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  scrollViewer: {
    alignItems: "center",
  },
  title: {
    marginTop: 50,
    fontFamily: "Kanit-Bold",
    fontSize: 32,
  },
  leaderListContainer: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: Colors.leaderListBack,
    padding: 6,
    gap: 6,
  },
  leaderListOne: {
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  leaderListText: {
    fontFamily: "Kanit-Bold",
    fontSize: 26,
    flex: 1,
  },
  leaderListImage: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  timerContainer: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  lockImage: {
    width: 44,
    height: 65,
  },
  timerBefore: {
    paddingLeft: 13,
    fontFamily: "MPR-Bold",
    fontSize: 32,
  },
  timerText: {
    fontFamily: "MPR-Bold",
    fontSize: 32,
    color: "red",
  },
  skipText: {
    marginTop: 27,
    fontFamily: "MPR-Bold",
    fontSize: 32,
    color: "#D3D3D3",
  },
  inviteBtn: {
    marginTop: 17,
    marginBottom: 39,
    paddingHorizontal: 60,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 100,

    backgroundColor: "white",
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacityp: 0.25,
    shadowRadius: 3.84,
    // Android shadow property
    elevation: 10,
  },
  inviteBtnImage: {
    width: 39,
    height: 40,
  },
  inviteBtnText: {
    fontFamily: "MPR-Bold",
    fontSize: 24,
  },
  bottomContainer: {
    width: "100%",
    marginTop: 5,
    paddingVertical: 8,
    paddingLeft: 22,
    paddingRight: 34,
    borderTopColor: "#DDDDDD",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  }, 
  soundIcon: { 
    position: "absolute", 
    top: 40, 
    right: 15, 
  }
});
