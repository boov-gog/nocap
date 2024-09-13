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
import { getCapsOfFriend, getRestFollowings } from "../services/capService";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { getUserById } from "../services/userService";
import { useRoute } from "@react-navigation/native";

const CapOfFriend = ({ navigation }) => {
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [caps, setCaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [listRefreshing, setListRefreshing] = useState(false);

  const friendId = useRoute().params.id;

  const bottomInset = useSafeAreaInsets().bottom;

  const capListItem = ({ item }) => {
    let title =
      item.userGamer?.firstName +
      (item.userGamer?.firstName ? " " : "") +
      item.userGamer?.lastName;
    const gender = item.userGamer?.gender;

    if (item.isUnlocked == false) {
      title =
        gender == GENDER_TYPE.Boy
          ? "From a Boy"
          : gender == GENDER_TYPE.Girl
          ? "From a Girl"
          : "From Someone";
    }
    const myImage =
      gender == GENDER_TYPE.Boy
        ? Images.blueCapList
        : gender == GENDER_TYPE.Girl
        ? Images.pinkCap
        : Images.greenCap;

    return (
      <TouchableOpacity
        style={styles.oneListItem}
        onPress={() => {
          _onPress(item);
        }}
      >
        <Image style={styles.oneItemImage} source={myImage} />
        <Text style={styles.oneItemTitle}>{title}</Text>
        <Text style={styles.oneItemDate}>{formatDate(item.createdAt)}</Text>
      </TouchableOpacity>
    );
  };

  const _onPress = (item) => {
    navigation.navigate(StackNav.FriendCapDetail, { id: item.id });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const avatarImage =
    user?.gender == GENDER_TYPE.Boy
      ? Images.boy
      : user?.gender == GENDER_TYPE.Girl
      ? Images.girl
      : Images.nonBinary;

  const getUser = async () => {
    try {
      const user = await getUserById(friendId);
      setUser(user);
      return user;
    } catch (error) {
      console.log("Error getting user: ", error);
      showErrorToast("Error getting friend");
    }
  };

  const getCaps = async (userId) => {
    try {
      const caps = await getCapsOfFriend(userId);

      setCaps(caps);
      setFollowers(caps.length);
    } catch (error) {
      console.log("Error getting followers: ", error);
      showErrorToast("Error getting followers");
    }
  };

  const getFollowings = async (userId) => {
    try {
      const followings = await getRestFollowings(userId);

      setFollowings(followings);
    } catch (error) {
      console.log("Error getting followings: ", error);
      showErrorToast("Error getting followings");
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const user = await getUser();
      if (user) {
        await getCaps(user.id);
        await getFollowings(user.id);
      } else {
        handleBack();
      }

      setIsLoading(false);
    };

    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.displayName}>
                {user?.firstName +
                  (user?.firstName ? " " : "") +
                  user?.lastName}
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
          {caps.length == 0 ? (
            <Text style={styles.title}>No Public Caps Yet</Text>
          ) : (
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
                    await getCaps(user.id);
                    await getFollowings(user.id);
                    setListRefreshing(false);
                  }}
                  colors={[Colors.mainBlue]}
                  tintColor={Colors.mainBlue}
                  progressBackgroundColor={Colors.blackBlue}
                />
              }
            />
          )}
        </View>
      )}

      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgb(255,255,255)"]}
        style={[styles.blurViewOverlay, { bottom: bottomInset }]}
      />
      <View style={[styles.bottomBar, { paddingBottom: bottomInset + 6 }]}>
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

export default CapOfFriend;

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
    padding: 5,
    borderRadius: 100,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
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
    marginLeft: 20,
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
    height: 60,
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
    width: 36,
    height: 26,
  },
  whoButtonContainer: {
    position: "absolute",
    bottom: 70,
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
