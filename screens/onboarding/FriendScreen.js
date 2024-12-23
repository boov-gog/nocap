import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo, TextInput } from "../../components";
import { Colors, Images } from "../../config";
import NocapButton from "../../components/NocapButton";
import { StackNav } from "../../navigation/NavigationKeys";
import { AuthenticatedUserContext } from "../../providers";
import { showErrorToast, showSuccessToast } from "../../utils";
import { CheckBox } from "react-native-elements";
import * as Contacts from "expo-contacts";
import TopBar from "../../components/TopBar";

import { useTranslation } from "react-i18next";

export const FriendScreen = (props) => {
  const { t } = useTranslation(); 

  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const { setFriends } = useContext(AuthenticatedUserContext);

  const handleNext = () => {
    if (selectedContacts.length === 0) {
      // showSuccessToast("We'll use your full contacts as a friend list");

      const contactIds = contacts.map((value) => value.id);

      setFriends(contactIds);
    } else {
      setFriends(selectedContacts);
    }

    props.navigation.navigate(StackNav.Password);
  };

  const fetchContacts = async () => {
    const { status } = await Contacts.getPermissionsAsync();
    if (status == "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.Image],
      });

      // Extract only id and name
      const contactsList = data.map((contact) => ({
        id: contact.id,
        name: contact.name,
        avatar: contact.imageAvailable ? { uri: contact.image.uri } : null,
      }));

      setContacts(contactsList);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const toggleSelectContact = (contactId) => {
    setSelectedContacts((prevSelected) => {
      if (prevSelected.includes(contactId)) {
        return prevSelected.filter((id) => id !== contactId);
      } else {
        return [...prevSelected, contactId];
      }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.oneItem}
      onPress={() => toggleSelectContact(item.id)}
    >
      <View style={styles.itemContent}>
        <Image
          style={styles.itemAvatar}
          source={item.avatar ? item.avatar : Images.nonBinary}
        />
        <Text
          style={styles.oneItemTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </View>
      <View>
        <View style={{ marginRight: -20 }}>
          <CheckBox
            checked={selectedContacts.includes(item.id)}
            onPress={() => toggleSelectContact(item.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleSkip = () => {
    props.navigation.navigate(StackNav.Password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.mainContainer}>
        <Text style={styles.titleStyle}>{t("chooseFriendsToPlayWith")}</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            paddingTop: 6,
            paddingBottom: 12,
          }}
        >
          <TouchableOpacity onPress={handleSkip}>
            <View style={styles.skipBtnBack}>
              <Text style={styles.skipBtnTxt}>{t("skip")}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <View style={styles.skipBtnBack}>
              <Text style={styles.skipBtnTxt}>{t("Next")}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <TextInput
            leftIconName={"magnify"}
            placeholder={`${t("search")}...`}
            borderLess={true}
          />

          <FlatList
            showsVerticalScrollIndicator={false}
            data={contacts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
          />
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
  skipBtnBack: {
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "white",
  },
  skipBtnTxt: {
    fontFamily: "Kanit-Bold",
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
  },
  oneItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    marginBottom: 12,
    paddingHorizontal: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemAvatar: {
    width: 50,
    height: 50,
    marginRight: 25,
  },
  oneItemTitle: {
    fontFamily: "Kanit-Bold",
    fontSize: 26,
  },
});
