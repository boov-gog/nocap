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
import { LoadingIndicator, TextInput } from "../components";
import { Colors, Images } from "../config";
import { StackNav } from "../navigation/NavigationKeys";
import { distanceInMiles, showErrorToast, showSuccessToast } from "../utils";
import { fetchSchools, getLimitDistance } from "../services/schoolService";
import { debounce } from "lodash";
import TopBar from "../components/TopBar";
import { AuthenticatedUserContext } from "../providers";
import * as Location from "expo-location";
import lunr from "lunr";
import { updateUser } from "../services/userService";
import { setCache, getCache } from "../utils"; 

import { useTranslation } from "react-i18next";

lunr.tokenizer.minLength = 3;

let lunrIdx = null;
let schoolsMap = null;

export const ChangeSchoolScreen = (props) => {
  const { t } = useTranslation(); 

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [sortedSchools, setSortedSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [limitDistance, setLimitDistance] = useState(30); 

  let sortedAllSchools;

  // Initialize lunr index
  const initLunrIndex = async (_schools) => {
    schoolsMap = new Map(
      _schools.map((school) => [school.id.toString(), school])
    );

    if (!schoolsMap || schoolsMap.size === 0) {
      return;
    }

    // Initialize lunr index synchronously
    lunrIdx = lunr(function () {
      this.ref("id");
      this.field("title");

      // Ensure to use a pipeline suitable for stemming
      this.pipeline.remove(lunr.stemmer);
      // this.pipeline.remove(lunr.stopWordFilter);

      // Add each school to the index
      schoolsMap.forEach((school) => {
        this.add(school);
      });
    });

    // console.log("Lunr index initialized");
  };

  const handleSearch = async (query) => {
    // console.log("Searching for: ", query);
    //Implement search logic here
    if (query == "") {
      setSortedSchools(sortedAllSchools);
      return;
    }
    const searchQuery = `*${query.toLowerCase()}*`;

    const searchResults = lunrIdx.search(searchQuery).slice(0, 1000);
    const results = searchResults.map((result) => schoolsMap.get(result.ref));

    results.sort((a, b) => a.distance - b.distance);
    setSortedSchools(results);
  };

  // Create a debounced version of handleSearch
  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleQueryChange = (query) => {
    setQuery(query);
    debouncedSearch(query);
  };

  const handleNext = async (school) => {
    if (school.distance > limitDistance) {
      showErrorToast("You are too far away from this school.");
    } else {
      try {
        const updatedUser = await updateUser(user.id, { school_id: school.id });
        setUser({ ...user, ...updatedUser });

        // console.log("Updated user school: ", updatedUser);
        showSuccessToast("School updated successfully.");

        props.navigation.goBack();
      } catch (error) {
        // console.log("Error updating user school: ", error);
        showErrorToast("Error updating user school: " + error.message);
      }
    }
  };

  const getCurrentLocationWithTimeout = async () => {
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Location request timed out")), 10000)
    );

    return Promise.race([locationPromise, timeoutPromise]);
  };

  const loadSchools = async () => {
    setLoading(true);

    try {
      let isLocationServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationServicesEnabled) {
        showErrorToast("Location services are disabled");
        props.navigation.goBack();
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showErrorToast("Permission to access location was denied");
        props.navigation.goBack();
      } else {
        let location = (await getCurrentLocationWithTimeout()).coords;
        // console.log("Location: ", location);

        let schoolList = getCache("schools");
        if (!schoolList) {
          schoolList = await fetchSchools();
          setCache("schools", schoolList);
        } else {
          // console.log("Schools loaded from cache");
        }

        const schoolsWithDistance = schoolList.map((school) => ({
          ...school,
          distance: distanceInMiles(
            location.latitude,
            location.longitude,
            school.latitude,
            school.longitude
          ),
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        setSortedSchools(schoolsWithDistance);
        sortedAllSchools = schoolsWithDistance;

        await initLunrIndex(schoolsWithDistance);
      }
    } catch (error) {
      // console.log("Error fetching location: ", error);
      showErrorToast("Unable to fetch location: " + error.message);
      props.navigation.goBack();
    }
    setLoading(false);
  }; 

  const getLimit = async () => {
    const res = await getLimitDistance(); 
    setLimitDistance(Number(res)); 
    // console.log("limitRes: ", Number(res)); 
  }

  useEffect(() => { 
    // console.log("ChangeSchoolScreen");
    getLimit(); 
    loadSchools();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.oneItem} onPress={() => handleNext(item)}>
      <Image
        style={styles.itemAvatar}
        source={item.avatar == null ? Images.highSchool : { uri: item.avatar }}
        resizeMode="contain"
      />
      <Text style={styles.oneItemTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.distanceText}>{item.distance.toFixed(1)} miles</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>{t("findYourSchool")} (inside {limitDistance}miles)</Text>

        <View style={styles.listContainer}>
          <TextInput
            leftIconName={"magnify"}
            placeholder={`${t("search")}...`}
            borderLess={true}
            onChangeText={handleQueryChange}
            value={query}
            editable={!loading}
          />

          {loading ? (
            <LoadingIndicator />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={sortedSchools}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.flatList}
            />
          )}
        </View>
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
    backgroundColor: "#f0f0f0",
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
    paddingVertical: 4,
    gap: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    borderRadius: 8,
  },
  itemAvatar: {
    width: 50,
    height: 50,
    marginRight: 25,
  },
  oneItemTitle: {
    flex: 1,
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
  distanceText: {
    fontFamily: "Kanit-Bold",
    fontSize: 20,
    color: Colors.gray,
  },
});
