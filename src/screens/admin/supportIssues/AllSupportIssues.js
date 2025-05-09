// ViewAllUserPage.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { color } from "@rneui/base";
import imageURL from "../../../constants/baseURL";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSupportIssues } from "../services/selector";
import { useFocusEffect } from "@react-navigation/native";
import { getAllSupportIssues } from "../services/crudFunctions";
import { selectUser } from "../../auth/services/selector";
// Define colors at the top for easy customization
const COLORS = {
  primary: "#101942",
  accent: "#FF5722",
  background: "#F8F9FA",
  white: "#FFFFFF",
  gray: "#8A94A6",
  lightGray: "#E0E0E0",
  text: "#333333",
  userRole: "#4CAF50",
  vendorRole: "#FF9800",
  divider: "#e1e1ea",
};


const ViewAllIssuesPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector(selectUser);
  const allIssues = useSelector(selectAllSupportIssues);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  // Filter users based on search query
  // console.log('all Issue = ', allIssues);
  const filteredIssues = allIssues.filter(
    (issue) =>
      issue?.user?.owner_legal_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      issue?.user.mobile_number?.includes(searchQuery)
  );

useEffect(() => {
  const fetchIssues = async () => {
    setIsLoading(true);
    await dispatch(getAllSupportIssues());
    setIsLoading(false);
  };

  fetchIssues();
}, []);


  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {searchBar()}
      <FlatList
        data={filteredIssues}
        renderItem={({ item }) => <SupportInfo issue={item} />}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-search" size={60} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No Issues found</Text>
          </View>
        }
      />
       {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </SafeAreaView>
  );

  function SupportInfo({ issue }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("SupportIssuesDetail", { issue })}
        style={styles.userItem}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            },
          ]}
        >
          {issue?.user?.avatar ? (
            <Image source={{ uri: imageURL.baseURL + issue?.user?.avatar }} style={styles.avatar} />
          ) : (
            <Icon
              name="account-circle"
              size={50}
              color="#ccc"
              style={styles.avatarIcon}
            />
          )}

          <View style={styles.userNameAndNumber}>
            <Text style={styles.userName}>
              {issue?.user?.owner_legal_name || "N/A"}
            </Text>
            <Text style={styles.userMobile}>
              {issue?.user?.mobile_number || "N/A"}
            </Text>
          </View>

          <View style={[styles.roleBadge]}>
            <Text
              style={[
                styles.roleText,
                { color: issue?.user?.role === "user" ? COLORS.primary : "orange" },
              ]}
            >
              {issue?.user?.role || "N/A"}
            </Text>
          </View>
        </View>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Text style={[styles.userName, {}]}>Status: </Text>
          <Text style={[styles.userMobile, { color: "red" }]}>{issue?.status} </Text>
        </View>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Text style={[styles.userName, {}]}>Created at: </Text>
          <Text style={[styles.userMobile, {}]}>{issue?.created_at}</Text>
        </View>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Text style={[styles.userName, {}]}>Title: </Text>
          <Text style={[styles.userMobile, {}]}>
            {issue?.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function searchBar() {
    return (
      <View style={{ margin: 20.0 }}>
        <MyStatusBar />
        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={24}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search users here ..."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              padding: 12,
              fontSize: 12,
            }}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
    paddingHorizontal: Sizes.fixPadding * 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bodyBackColor,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
    loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(182, 206, 232, 0.3)",
    zIndex: 999,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: COLORS.text,
  },
  listContainer: {
    paddingBottom: 16,
  },
  userItem: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    minHeight: 100,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#e0e0eb",
  },
  userNameAndNumber: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 12,
    color: COLORS.gray,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 78, // Aligns with the end of the avatar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 12,
  },
});

export default ViewAllIssuesPage;
