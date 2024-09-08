import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "../components";
import { Colors, Images } from "../config";
import { StackNav } from "../navigation/NavigationKeys";
import { GENDER_TYPE } from "../utils";
import { debounce } from "lodash";
import TopBar from "../components/TopBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import lunr from "lunr";

lunr.tokenizer.minLength = 1;

let lunrIdx = null;
let friendsMap = null;

export const SearchFriendScreen = (props) => {
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = async (query) => {
    console.log("Searching friends for: ", query);
    const searchQuery = `*${query.toLowerCase()}*`;

    if (lunrIdx === null) {
      await initLunrIndex();
    }

    const searchResults = lunrIdx.search(searchQuery).slice(0, 1000);
    const topResults = searchResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const results = topResults.map((result) => friendsMap.get(result.ref));
    setFriends(results);
  };

  // Create a debounced version of handleSearch
  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleQueryChange = (query) => {
    setQuery(query);
    debouncedSearch(query);
  };

  const handleNext = (friend) => {
    props.navigation.navigate(StackNav.CapOfFriend, {
      id: friend.id,
    });
  };

  const loadFriends = async () => {
    // Get friends from AsyncStorage
    let friends = await AsyncStorage.getItem("friends");
    friends = JSON.parse(friends);

    if (friends.length > 0) {
      if (friends[0].contactId == null) {
        // If the friends are registered users, update the name property
        friends = friends.map((f) => {
          const displayName =
            f.firstName + (f.firstName ? " " : "") + f.lastName;
          return { ...f, name: displayName };
        });
      }
    }

    // Set the selected friends in state
    setFriends(friends);
    return friends;
  };

  // Initialize lunr index
  const initLunrIndex = async (_friend) => {
    friendsMap = new Map(
      _friend.map((friend) => [friend.id.toString(), friend])
    );

    if (!friendsMap || friendsMap.length === 0) {
      return;
    }

    // Initialize lunr index synchronously
    lunrIdx = lunr(function () {
      this.ref("id");
      this.field("name");

      // Add each school to the index
      friendsMap.forEach((friend) => {
        this.add(friend);
      });
    });

    console.log("Lunr index initialized");
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        try {
          const _friend = await loadFriends();
          await initLunrIndex(_friend);
        } catch (error) {
          console.error("Error loading friends:", error);
        }
      };

      init();
    }, [])
  );

  const handleBack = () => {
    props.navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.oneItem} onPress={() => handleNext(item)}>
      <Image
        style={styles.itemAvatar}
        source={
          item.gender == GENDER_TYPE.Boy
            ? Images.boy
            : item.gender == GENDER_TYPE.Girl
            ? Images.girl
            : Images.nonBinary
        }
        resizeMode="contain"
      />
      <Text style={styles.oneItemTitle} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>Search for friends</Text>

        <View style={styles.listContainer}>
          <TextInput
            leftIconName={"magnify"}
            placeholder="Search..."
            borderLess={true}
            onChangeText={handleQueryChange}
            value={query}
          />

          <FlatList
            data={friends}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 150 }}
          />
        </View>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.bottomMiddle}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.blackBlue,
    width: "100%",
    position: "relative",
  },
  mainContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
  titleStyle: {
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    color: Colors.white,
  },
  inputStyle: {
    marginTop: 33,
    marginBottom: 3,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.white,
  },
  listContainer: {
    flex: 1,
    marginTop: 23,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
  },
  oneItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    borderRadius: 8,
  },
  itemAvatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  oneItemTitle: {
    flex: 1,
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 6,
  },
  bottomMiddle: {
    fontFamily: "MPR-Bold",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 100,
    fontSize: 24,
    backgroundColor: "#EDEDED",
  },
});
