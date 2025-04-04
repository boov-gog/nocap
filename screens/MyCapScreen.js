import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon, LoadingIndicator } from "../components";
import { Colors, Images } from "../config";
import { formatDate, GENDER_TYPE, showErrorToast } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { StackNav } from "../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../providers";
import { getRestCaps, getRestFollowings } from "../services/capService";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const MyCapScreen = ({ navigation }) => {
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [caps, setCaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listRefreshing, setListRefreshing] = useState(false);

  const { user } = useContext(AuthenticatedUserContext);
  const bottomInset = useSafeAreaInsets().bottom;

  const capListItem = ({ item }) => {
    let title =
      item.userGamer?.firstName +
      (item.userGamer?.firstName ? " " : "") +
      item.userGamer?.lastName;
    let gender = item.userGamer?.gender;

    if (item.isUnlocked == false) {
      title =
        gender == GENDER_TYPE.Boy
          ? "From a Boy"
          : gender == GENDER_TYPE.Girl
          ? "From a Girl"
          : "From Someone";
    }
    let myImage =
      gender == GENDER_TYPE.Boy
        ? Images.blueCapList
        : gender == GENDER_TYPE.Girl
        ? Images.pinkCap
        : Images.greenCap;

    if (item.gamer == user.id) {
      title =
        item.userAnswer?.firstName +
        (item.userAnswer?.firstName ? " " : "") +
        item.userAnswer?.lastName;

      gender = item.userAnswer?.gender;

      myImage =
        gender == GENDER_TYPE.Boy
          ? Images.blueBack
          : gender == GENDER_TYPE.Girl
          ? Images.pinkBack
          : Images.greenBack;
    }

    return (
      <TouchableOpacity
        style={styles.oneListItem}
        onPress={() => {
          _onPress(item);
        }}
      >
        <Image
          resizeMode="contain"
          style={styles.oneItemImage}
          source={myImage}
        />
        <Text
          style={styles.oneItemTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <Text style={styles.oneItemDate}>{formatDate(item.createdAt)}</Text>
      </TouchableOpacity>
    );
  };

  const _onPress = (item) => {
    if (item.gamer == user.id) {
      navigation.navigate(StackNav.ReplyDetail, { id: item.id });
      return;
    }
    navigation.navigate(StackNav.WhatTheySay, { id: item.id });
  };

  const handleProfile = () => {
    navigation.navigate(StackNav.Profile);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearchFriend = () => {
    navigation.navigate(StackNav.SearchFriend);
  };

  const avatarImage =
    user?.gender == GENDER_TYPE.Boy
      ? Images.boy
      : user?.gender == GENDER_TYPE.Girl
      ? Images.girl
      : Images.nonBinary;

  const getCaps = async () => {
    try {
      const caps = await getRestCaps(user.id);
      // console.log("caps: ", caps);
      setCaps(caps);

      //only count that userInAnswer is mine
      const myCaps = caps.filter((cap) => cap.userInAnswer == user.id);
      setFollowers(myCaps.length);
    } catch (error) {
      console.log("Error getting followers: ", error);
      showErrorToast("Error getting followers");
    }
  };

  const getFollowings = async () => {
    try {
      const followings = await getRestFollowings(user.id);
      console.log("followings: ", followings);
      setFollowings(followings);
    } catch (error) {
      console.log("Error getting followings: ", error);
      showErrorToast("Error getting followings");
    }
  };

  useEffect(() => {
    const initialLoading = async () => {
      setIsLoading(true);
      await getCaps();
      setIsLoading(false);

      getFollowings();
    };
    initialLoading();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.displayName}>
              {user?.firstName + (user?.firstName ? " " : "") + user?.lastName}
            </Text>
            <View style={styles.followersContainer}>
              <Text
                style={styles.followersText}
              >{`${followers} Followers`}</Text>
              <Text
                style={styles.followersText}
              >{`${followings} Following`}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Image style={styles.avatar} source={avatarImage} />
          </View>
        </View>
        {isLoading ? (
          <LoadingIndicator />
        ) : caps.length == 0 ? (
          <Text style={styles.title}>No Caps Yet</Text>
        ) : (
          <>
            <FlatList
              data={caps}
              renderItem={capListItem}
              keyExtractor={(item) => item.id}
              style={styles.listStyle}
              contentContainerStyle={{ paddingBottom: 150 }}
              refreshControl={
                <RefreshControl
                  refreshing={listRefreshing}
                  onRefresh={async () => {
                    setListRefreshing(true);
                    await getCaps();
                    setListRefreshing(false);

                    getFollowings();
                  }}
                  colors={[Colors.mainBlue]}
                  tintColor={Colors.mainBlue}
                  progressBackgroundColor={Colors.blackBlue}
                />
              }
            />
            <View
              style={[styles.whoButtonContainer, { bottom: 70 + bottomInset }]}
            >
              <TouchableOpacity style={styles.whoButton}>
                <Image style={styles.lockImage} source={Images.lockerWhite} />
                <Text style={styles.whoBtnText}>See who said this</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgb(255,255,255)"]}
        style={[styles.blurViewOverlay, { bottom: bottomInset }]}
      />
      <View style={[styles.bottomBar, { paddingBottom: bottomInset + 6 }]}>
        <TouchableOpacity onPress={handleProfile}>
          <Image style={styles.bottomRight} source={Images.userPerson}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearchFriend}>
          <Icon name={"magnify"} size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBack}>
          <Image
            style={styles.bottomMiddle}
            source={Images.custombackIcon}
          ></Image>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyCapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.blackBlue,
    position: "relative",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  header: {
    paddingVertical: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  displayName: {
    fontFamily: "Kanit-Regular",
    fontSize: 24,
    color: "white",
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  followersText: {
    fontFamily: "Kanit-Regular",
    fontSize: 16,
    color: "white",
  },
  headerRight: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 100,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  title: {
    marginTop: 68,
    marginBottom: 23,
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    color: "white",
  },
  listStyle: {
    width: "100%",
  },
  oneListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 5,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
  oneItemImage: {
    width: 60,
    height: 60,
  },
  oneItemTitle: {
    flex: 1,
    marginHorizontal: 20,
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
  oneItemDate: {
    fontFamily: "Kanit-Bold",
    fontSize: 16,
  },
  blurViewOverlay: {
    position: "absolute",
    width: "100%",
    height: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingTop: 6,
  },
  bottomMiddle: {
    width: 36,
    height: 26,
  },
  bottomRight: {
    width: 20,
    height: 26,
  },
  whoButtonContainer: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  whoButton: {
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 42,
    gap: 8,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  lockImage: {
    width: 40,
    height: 40,
  },
  whoBtnText: {
    fontFamily: "MPR-Bold",
    fontSize: 24,
    color: "white",
  },
});
