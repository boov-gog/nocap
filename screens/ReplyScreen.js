import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors, Images } from "../config";
import { LoadingIndicator, TextInput } from "../components";
import { FlatList } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { GENDER_TYPE, showErrorToast } from "../utils";
import { getReplies } from "../services/replyService";
import { debounce } from "lodash";
import lunr from "lunr";
import { updateCapWithReply } from "../services/capService";

lunr.tokenizer.minLength = 2;

let lunrIdx = null;
let replies = [];

const ReplyScreen = ({ navigation }) => {
  const { cap } = useRoute().params;
  const [filteredReplies, setFilteredReplies] = useState([]);
  const [select, setSelect] = useState(-1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const bottomInset = useSafeAreaInsets().bottom;

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

  const oneReplyItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelect(item.id)}
      style={[
        styles.oneReplyItem,
        select == item.id && { backgroundColor: mainBackColor },
      ]}
    >
      <Text
        style={styles.oneReplyItemText}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSend = async () => {
    if (select == -1) return;

    setSaving(true);
    // Send the selected reply to the server
    try {
      const reply = replies.find((r) => r.id == select);
      const replyId = reply?.id;

      const response = await updateCapWithReply(cap.id, replyId);
      console.log("send Reply response", response);
      navigation.goBack();
    } catch (error) {
      if (error.response.status == 409) {
        showErrorToast("You have already replied to this CAP");
      } else {
        console.log("send Reply error", error);
        showErrorToast("Failed to send reply");
      }
    }
    setSaving(false);
  };

  // Initialize lunr index
  const initLunrIndex = async (replySentences) => {
    // Initialize lunr index synchronously
    lunrIdx = lunr(function () {
      this.ref("id");
      this.field("content");

      // Ensure to use a pipeline suitable for stemming
      this.pipeline.remove(lunr.stemmer);
      this.pipeline.remove(lunr.stopWordFilter);

      replySentences.forEach((one) => {
        this.add(one);
      });
    });

    console.log("Lunr index initialized");
  };

  const handleSearch = async (query) => {
    console.log("Searching reply sentences for: ", query);
    if (query == "") {
      setFilteredReplies(replies);
      return;
    }
    const searchQuery = `${query.toLowerCase()}*`;

    const searchResults = lunrIdx.search(searchQuery);
    const topResults = searchResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const results = topResults.map((result) =>
      replies.find((r) => r.id == result.ref)
    );
    setFilteredReplies(results);
  };

  // Create a debounced version of handleSearch
  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleQueryChange = (query) => {
    setQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        replies = await getReplies();
        initLunrIndex(replies);
        setFilteredReplies(replies);
      } catch (error) {
        console.log("getReplies error", error);
      }
      setLoading(false);
    };

    init();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: mainBackColor }]}>
      <SafeAreaView style={styles.mainContainer}>
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
              onChangeText={handleQueryChange}
              value={query}
            />
          </View>

          {loading ? (
            <LoadingIndicator />
          ) : (
            <FlatList
              numColumns={2}
              data={filteredReplies}
              renderItem={oneReplyItem}
              keyExtractor={(item) => item.id}
              style={styles.answerList}
              contentContainerStyle={styles.answerListContent}
            />
          )}
        </View>
        <View style={[styles.bottomBar, { paddingBottom: bottomInset + 6 }]}>
          <TouchableOpacity onPress={handleBack}>
            <Image
              style={styles.bottomLeft}
              source={Images.custombackIcon}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.bottomRight}
              source={Images.userPerson}
            ></Image>
          </TouchableOpacity>
        </View>

        {saving ? (
          <LoadingIndicator />
        ) : (
          <TouchableOpacity
            disabled={select == -1}
            onPress={handleSend}
            style={[
              styles.sendBtn,
              select == -1 && { backgroundColor: "rgba(0,0,0,0.5)" },
              ,
              { bottom: 60 + bottomInset },
            ]}
          >
            <Text style={styles.sendBtnTxt}>SEND</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};

export default ReplyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
    paddingBottom: 56,
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
    width: 36,
    height: 26,
  },
  bottomRight: {
    width: 20,
    height: 26,
  },
  sendBtn: {
    position: "absolute",
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
