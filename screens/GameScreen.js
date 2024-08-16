import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Logo } from "../components";
import { Images } from "../config";
import AnswerButton from "../components/AnswerButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GamePageColors } from "../config/theme";
import TopBar from "../components/TopBar";
import { showSuccessToast } from "../utils";
import { StackNav } from "../navigation/NavigationKeys";

const pageColor =
  GamePageColors[Math.floor(Math.random() * 100) % GamePageColors.length];

const GameScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(-1);
  const [timer, setTimer] = useState(null);

  const handleShuffle = () => {};
  const handleSkip = () => {};
  const handleNext = () => {
    if (timer) {
      clearTimeout(timer);
    }
    navigation.replace(StackNav.GamePage, {});
  };
  const handlePressBack = () => {
    if (timer) {
      clearTimeout(timer);
    }
    navigation.goBack();
  };

  const answers = ["Adrian Martin", "Jacob Smith", "Sarah Johnson", "John Doe"];

  const handleAnswerSelect = (index) => {
    setSelected(index);
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        // showSuccessToast("Correct Answer is Adrian Martin");
        navigation.replace(StackNav.GamePage, {});
      }, 3000)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar handlePressBack={handlePressBack} />
      <View style={styles.logoContainer}>
        <Logo uri={Images.logoNoback} />
      </View>
      <View style={styles.mainPart}>
        <Text style={styles.question} numberOfLines={3} ellipsizeMode="tail">
          Question Text(Can be up to 3 lines, centered)
        </Text>
        <View style={styles.answersContainer}>
          <View style={styles.answerRow}>
            <AnswerButton
              clickable={true}
              selected={selected === 0}
              name={answers[0]}
              normalState={{ backgroundColor: pageColor.button }}
              onPress={() => handleAnswerSelect(0)}
            />
            <AnswerButton
              clickable={true}
              selected={selected === 1}
              name={answers[1]}
              normalState={{ backgroundColor: pageColor.button }}
              onPress={() => handleAnswerSelect(1)}
            />
          </View>
          <View style={styles.answerRow}>
            <AnswerButton
              clickable={true}
              selected={selected === 2}
              name={answers[2]}
              normalState={{ backgroundColor: pageColor.button }}
              onPress={() => handleAnswerSelect(2)}
            />
            <AnswerButton
              clickable={true}
              selected={selected === 3}
              name={answers[3]}
              normalState={{ backgroundColor: pageColor.button }}
              onPress={() => handleAnswerSelect(3)}
            />
          </View>
        </View>
        {selected !== -1 ? (
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={handleShuffle} style={styles.shuffleBtn}>
              <Text style={styles.shuffleText}>Shuffle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

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
    height: 60,
    fontWeight: "700",
    marginBottom: 7,
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
