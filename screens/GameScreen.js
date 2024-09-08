import {
  Alert,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState, useContext, useRef } from "react";
import { LoadingIndicator, Logo } from "../components";
import { Images } from "../config";
import AnswerButton from "../components/AnswerButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GamePageColors } from "../config/theme";
import TopBar from "../components/TopBar";
import { showErrorToast, showSuccessToast } from "../utils";
import { StackNav } from "../navigation/NavigationKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnsweredPercentage } from "../services/gameService";
import { AuthenticatedUserContext } from "../providers";
import * as Contacts from "expo-contacts";
import { updateUser } from "../services/userService";
import { saveCap } from "../services/capService";
import { SafeAreaView } from "react-native-safe-area-context";

let timer = null;

const GameScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);

  const [selected, setSelected] = useState(-1);
  const [pageColor, setPageColor] = useState(GamePageColors[0]);
  const [question, setQuestion] = useState(null);
  const [friends, setFriends] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [shuffleEnable, setShuffleEnable] = useState(true);
  const [skipEnable, setSkipEnable] = useState(true);
  const [percentage, setPercentage] = useState([25, 25, 25, 25]);
  const [answerNums, setAnswerNums] = useState([0, 0, 0, 0]);

  const questionRef = useRef(question);
  const friendsRef = useRef(friends);
  const selectedRef = useRef(selected);

  useEffect(() => {
    questionRef.current = question;
    friendsRef.current = friends;
    selectedRef.current = selected;
  }, [question, friends, selected]);

  // Function to save the answer and move to the next question
  const saveAnswer_Move2Next = async () => {
    try {
      const question = questionRef.current;
      const friends = friendsRef.current;
      const selected = selectedRef.current;

      // Get the roundId from AsyncStorage
      const roundId = await AsyncStorage.getItem("roundId");

      // Filter out the selected friend from the friends array
      const unselectedFriends = friends.filter(
        (_, index) => index !== selected
      );

      // Create a cap object with the necessary data
      const cap = {
        questionId: question.id,
        gamer: user.id,
        userInAnswer: friends[selected].email ? friends[selected].id : null,
        nameInAnswer: friends[selected].name,
        noanswer1: unselectedFriends[0].name,
        noanswer2: unselectedFriends[1].name,
        noanswer3: unselectedFriends[2].name,
        roundId: Number(roundId),
        showToOthers: false,
        isUnlocked: false,
      };

      // Save the cap using the saveCap function
      await saveCap(cap);

      // Get the questions from AsyncStorage
      let questions = await AsyncStorage.getItem("questions");
      questions = JSON.parse(questions);

      // Update the selected property of the question in the questions array
      const updatedQuestions = questions.map((q) => {
        if (q.questionId === question.id) {
          q.selected = true;
        }
        return q;
      });

      // Save the updated questions back to AsyncStorage
      await AsyncStorage.setItem("questions", JSON.stringify(updatedQuestions));

      // Replace the current screen with the GamePage screen
      navigation.replace(StackNav.GamePage, {});
    } catch (error) {
      console.error("Error saving cap:", error);
      showErrorToast("Error saving cap");
    }
  };

  // Function to select friends
  const selectFriends = async () => {
    // Get friends from AsyncStorage
    let friends = await AsyncStorage.getItem("friends");
    friends = JSON.parse(friends);

    if (friends.length > 0) {
      if (friends[0].contactId) {
        // Request permission to access contacts
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          // If permission is granted, get the contacts for the friends
          friends = await Promise.all(
            friends.map(async (f) => {
              const contact = await Contacts.getContactByIdAsync(
                f.contactId.toString()
              );

              if (contact) {
                const name = contact.name;
                return { ...f, name };
              }
            })
          );
          // Remove the friends that are not in the contacts
          friends = friends.filter((f) => f);
        } else {
          throw new Error("Permission denied to access contacts");
        }
      } else {
        // If the friends are registered users, update the name property
        friends = friends.map((f) => {
          const displayName =
            f.firstName + (f.firstName ? " " : "") + f.lastName;
          return { ...f, name: displayName };
        });
      }

      // Select 4 friends randomly
      if (friends.length >= 4) {
        const selectedFriends = [];
        for (let i = 0; i < 4; i++) {
          const randomIndex = Math.floor(
            (Math.random() * 100) % friends.length
          );
          selectedFriends.push(friends[randomIndex]);
          friends = friends
            .slice(0, randomIndex)
            .concat(friends.slice(randomIndex + 1));
        }
        friends = selectedFriends;
      } else {
        // If there are less than 4 friends, show an error
        throw new Error("There are less than 4 friends");
      }

      // Set the selected friends in state
      setFriends(friends);
    }
  };

  // Function to set the answered numbers for the friends
  const setAnswerNumbers = async () => {
    try {
      // Get the roundId from AsyncStorage
      const roundId = await AsyncStorage.getItem("roundId");

      // Get the candidateIds from the friends array
      const candidateIds = friends.map((f) => f.id);

      // Get the answered numbers using the getAnsweredPercentage function
      const answeredNumbers = await getAnsweredPercentage(
        Number(roundId),
        question.id,
        candidateIds
      );

      console.log("Answered numbers:", answeredNumbers);

      // Update the percentage state with the answered numbers
      let updatedAnswerNums = friends.map((friend) => {
        const numbers = answeredNumbers.find((p) => p.id === friend.id);
        return (num = numbers ? numbers.answeredNumber : 0);
      });

      setAnswerNums(updatedAnswerNums);
    } catch (error) {
      console.error("Error getting answered percentage:", error);
      showErrorToast("Failed to get answered percentage. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Percentage:", percentage);
  }, [percentage]);

  useEffect(() => {
    if (question && friends.length > 0 && friends[0].email) {
      setAnswerNumbers();
    }
  }, [question, friends]);

  // Function to handle the shuffle button press
  const handleShuffle = async () => {
    // Get the shuffleLeft value from AsyncStorage
    const shuffleLeft = Number(await AsyncStorage.getItem("shuffle"));
    if (shuffleLeft > 0) {
      try {
        // Select new friends using the selectFriends function
        await selectFriends();
      } catch (error) {
        showErrorToast("Failed to select shuffle friends. Please try again.");
      }

      // Decrease the shuffleLeft value by 1 and save it back to AsyncStorage
      await AsyncStorage.setItem("shuffle", (shuffleLeft - 1).toString());

      // Disable the shuffle button if shuffleLeft is less than or equal to 1
      if (shuffleLeft <= 1) {
        setShuffleEnable(false);
      }
    }
  };

  // Function to handle the skip button press
  const handleSkip = async () => {
    // Get the skipLeft value from AsyncStorage
    const skipLeft = Number(await AsyncStorage.getItem("skip"));
    if (skipLeft > 0) {
      // Replace the current screen with the GamePage screen
      navigation.replace(StackNav.GamePage, {});

      // Decrease the skipLeft value by 1 and save it back to AsyncStorage
      await AsyncStorage.setItem("skip", (skipLeft - 1).toString());
    }
  };

  // Function to handle the next button press
  const handleNext = () => {
    if (timer) {
      clearTimeout(timer);
    }
    saveAnswer_Move2Next();
  };

  // Function to handle the selection of an answer
  const handleAnswerSelect = (index) => {
    if (selected != -1) return;

    setSelected(index);

    let totalAnswered = 1;
    answerNums.forEach((num) => {
      totalAnswered += num;
    });

    let updatedAnsNums = [
      answerNums[0],
      answerNums[1],
      answerNums[2],
      answerNums[3],
    ];

    updatedAnsNums[index] += 1;

    updatedAnsNums = updatedAnsNums.map((num) => {
      return Math.round((num / totalAnswered) * 100);
    });

    setPercentage(updatedAnsNums);
  };

  useEffect(() => {
    // Check if an answer is selected and start a timer to move to the next question
    if (selected != -1) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        saveAnswer_Move2Next();
      }, 3000);
    }
  }, [selected]);

  // Function to handle the back button press
  const handlePressBack = () => {
    let timerSetted = false;
    if (timer) {
      timerSetted = true;
      clearTimeout(timer);
    }
    // Show an alert to confirm if the user wants to exit the game
    Alert.alert("Hold on!", "Are you sure you want to exit the game?", [
      {
        text: "Cancel",
        onPress: () => {
          if (timerSetted) {
            timer = setTimeout(() => {
              saveAnswer_Move2Next();
            }, 3000);
          }
        },
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => navigation.replace(StackNav.WaitingRoom, {}),
      },
    ]);
  };

  useEffect(() => {
    // Initialize the game when the component mounts
    const initialize = async () => {
      setInitializing(true);
      try {
        //update user info
        // const updatedUser = await updateUser(user.id, { school_id: 26413 });
        // console.log("updated user", updatedUser);

        // Set the page color randomly
        setPageColor(
          GamePageColors[
            Math.floor(Math.random() * 100) % GamePageColors.length
          ]
        );

        // Get the questions from AsyncStorage
        let questions = await AsyncStorage.getItem("questions");
        questions = JSON.parse(questions);

        // Filter out the selected questions
        const unselectedQuestions = questions.filter((q) => !q.selected);

        if (unselectedQuestions.length != 0) {
          // Select a random question from the unselected questions
          const randomIndex = Math.floor(
            (Math.random() * 100) % unselectedQuestions.length
          );
          setQuestion(unselectedQuestions[randomIndex].question);
        } else {
          showSuccessToast("All questions are answered. Please wait.");
          navigation.replace(StackNav.WaitingRoom, {});
        }

        // Select friends using the selectFriends function
        await selectFriends();
      } catch (error) {
        console.error("Error initializing game:", error);
        showErrorToast("Failed to initialize the game. Please try again.");

        navigation.replace(StackNav.WaitingRoom, {});
      }

      try {
        // Get the shuffle and skip left values from AsyncStorage
        setShuffleEnable(Number(await AsyncStorage.getItem("shuffle")) > 0);
        setSkipEnable(Number(await AsyncStorage.getItem("skip")) > 0);
      } catch (error) {
        console.error("Error getting shuffle and skip left values:", error);
        showErrorToast(
          "Failed to get shuffle and skip left values. Please try again."
        );
      }
      setInitializing(false);
    };

    initialize();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  useEffect(() => {
    // Handle the back button press
    const backAction = () => {
      handlePressBack();
      return true; // Returning true prevents the default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup function to remove the event listener when the component unmounts
    return () => backHandler.remove();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: pageColor.back,
    },
    logoContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
    },
    mainPart: {
      alignItems: "center",
    },
    question: {
      width: "90%",
      height: 90,
      fontWeight: "700",
      marginBottom: 7,
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
    oneAnswerContainer: {
      flex: 1,
    },
    percentText: {
      width: "100%",
      textAlign: "center",
      fontSize: 25,
      fontWeight: "700",
    },
    shuffleBtn: {
      marginTop: 15,
      width: 135,
      height: 45,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "black",
    },
    shuffleText: {
      fontWeight: "600",
      fontSize: 24,
    },
    skipBtn: {
      marginTop: 13,
      marginBottom: 37,
      width: 110,
      height: 45,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "black",
    },
    skipText: {
      fontWeight: "600",
      fontSize: 24,
    },
    nextBtn: {
      marginTop: 73,
      marginBottom: 37,
      width: 110,
      height: 45,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "black",
    },
    nextText: {
      fontWeight: "600",
      fontSize: 24,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        handlePressBack={handlePressBack}
        textStyle={{ color: "black" }}
      />
      <View style={styles.logoContainer}>
        <Logo
          uri={Images.logoNoback}
          style={Dimensions.get("window").width <= 360 ? { height: 0 } : null}
        />
      </View>
      {initializing ? (
        <LoadingIndicator />
      ) : (
        <View style={styles.mainPart}>
          <Text style={styles.question} numberOfLines={3} ellipsizeMode="tail">
            {question?.value}
          </Text>
          <View style={styles.answersContainer}>
            <View style={styles.answerRow}>
              <View style={styles.oneAnswerContainer}>
                <Text style={styles.percentText}>
                  {selected == -1 ? "" : percentage[0] + "%"}
                </Text>
                <AnswerButton
                  clickable={true}
                  selected={selected === 0}
                  name={friends?.at(0)?.name}
                  normalState={{ backgroundColor: pageColor.button }}
                  onPress={() => handleAnswerSelect(0)}
                />
              </View>
              <View style={styles.oneAnswerContainer}>
                <Text style={styles.percentText}>
                  {selected == -1 ? "" : percentage[1] + "%"}
                </Text>
                <AnswerButton
                  clickable={true}
                  selected={selected === 1}
                  name={friends?.at(1)?.name}
                  normalState={{ backgroundColor: pageColor.button }}
                  onPress={() => handleAnswerSelect(1)}
                />
              </View>
            </View>
            <View style={styles.answerRow}>
              <View style={styles.oneAnswerContainer}>
                <AnswerButton
                  clickable={true}
                  selected={selected === 2}
                  name={friends?.at(2)?.name}
                  normalState={{ backgroundColor: pageColor.button }}
                  onPress={() => handleAnswerSelect(2)}
                />
                <Text style={styles.percentText}>
                  {selected == -1 ? "" : percentage[2] + "%"}
                </Text>
              </View>
              <View style={styles.oneAnswerContainer}>
                <AnswerButton
                  clickable={true}
                  selected={selected === 3}
                  name={friends?.at(3)?.name}
                  normalState={{ backgroundColor: pageColor.button }}
                  onPress={() => handleAnswerSelect(3)}
                />
                <Text style={styles.percentText}>
                  {selected == -1 ? "" : percentage[3] + "%"}
                </Text>
              </View>
            </View>
          </View>
          {selected !== -1 ? (
            <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <>
              {shuffleEnable ? (
                <TouchableOpacity
                  onPress={handleShuffle}
                  style={styles.shuffleBtn}
                >
                  <Text style={styles.shuffleText}>Shuffle</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ height: 60 }} />
              )}
              {skipEnable ? (
                <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ height: 60 }} />
              )}
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default GameScreen;
