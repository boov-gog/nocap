import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator, Logo, TextInput } from "../../components";
import { Colors, Images } from "../../config";
import { StackNav } from "../../navigation/NavigationKeys";
import { distanceInMiles, showErrorToast } from "../../utils";
import { fetchSchools } from "../../services/schoolService";
import { debounce } from "lodash";
import TopBar from "../../components/TopBar";
import { useRoute } from "@react-navigation/native";
import { AuthenticatedUserContext } from "../../providers";
import lunr from "lunr";

lunr.tokenizer.minLength = 3;

let lunrIdx = null;
let schoolsMap = null;

export const SchoolScreen = (props) => {
  const { setSchool } = useContext(AuthenticatedUserContext);
  const [sortedSchools, setSortedSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const location = useRoute().params.location;

  let sortedAllSchools;

  // Initialize lunr index
  const initLunrIndex = async (_schools) => {
    schoolsMap = new Map(
      _schools.map((school) => [school.id.toString(), school])
    );

    if (!schoolsMap || schoolsMap.length === 0) {
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

    console.log("Lunr index initialized");
  };

  const handleSearch = async (query) => {
    console.log("Searching for: ", query);
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

    // setLoading(true);
    // try {
    //   const schools = await searchSchools(query);
    //   const schoolsWithDistance = schools.map((school) => ({
    //     ...school,
    //     distance: distanceInMiles(
    //       location.latitude,
    //       location.longitude,
    //       school.latitude,
    //       school.longitude
    //     ),
    //   }));

    //   schoolsWithDistance.sort((a, b) =>
    //     a.score != b.score ? b.score - a.score : a.distance - b.distance
    //   );
    //   setSortedSchools(schoolsWithDistance);
    // } catch (error) {
    //   showErrorToast(error.body.message);
    // }
    // setLoading(false);
  };

  // Create a debounced version of handleSearch
  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleQueryChange = (query) => {
    setQuery(query);
    debouncedSearch(query);
  };

  const handleNext = (school) => {
    if (school.distance > 30) {
      showErrorToast("You are too far away from this school.");
    } else {
      setSchool(school.id);
      props.navigation.navigate(StackNav.Phone);
    }
  };

  const loadSchools = async () => {
    if (location) {
      setLoading(true);

      try {
        const schoolList = await fetchSchools();

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
      } catch (error) {
        showErrorToast(error.body.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.oneItem} onPress={() => handleNext(item)}>
      <Image
        style={styles.itemAvatar}
        source={item.avatar == "" ? Images.highSchool : { uri: item.avatar }}
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
        <Text style={styles.titleStyle}>Find Your School</Text>

        <View style={styles.listContainer}>
          <TextInput
            leftIconName={"magnify"}
            placeholder="Search..."
            borderLess={true}
            onChangeText={handleQueryChange}
            value={query}
          />

          {loading ? (
            <LoadingIndicator />
          ) : (
            <FlatList
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
