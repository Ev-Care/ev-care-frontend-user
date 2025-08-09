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
import RNModal from "react-native-modal";
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
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const allIssues = useSelector(selectAllSupportIssues);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const dispatch = useDispatch();
  const statusColors = {
    Open: "red",
    "In Progress": "orange",
    Resolved: "green",
    Closed: "gray",
    Escalated: "#d9534f",
    Rejected: "purple",
  };

  const getStatusColor = (status) => {
    return statusColors[status] || "black"; // fallback if unknown status
  };

  // Filter users based on search query
  // console.log('all Issue = ', allIssues);
const filteredIssues = allIssues.filter((issue) => {
  const matchesText =
    issue?.user?.owner_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue?.user?.mobile_number?.includes(searchQuery) || issue?.user?.role?.includes(searchQuery) ||
    issue?.status?.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesStatus =
    selectedStatuses.length === 0 || selectedStatuses.includes("All")
      ? true
      : selectedStatuses.includes(issue?.status);

  return matchesText && matchesStatus;
});


  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // setIsLoading(true);
      await dispatch(getAllSupportIssues());
    } catch (error) {
      console.error("Error refreshing issues:", error);
      await dispatch(
        showSnackbar({
          message: "Something went wrong during refresh.",
          type: "error",
        })
      );
    } finally {
      setRefreshing(false);
      // setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {searchBar()}
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={filteredIssues}
        renderItem={({ item }) => <SupportInfo issue={item} />}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="confirmation-number"
              size={60}
              color={COLORS.lightGray}
            />
            <Text style={styles.emptyText}>No Issues found</Text>
          </View>
        }
      />
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
       {bottonSheet()}
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
            <Image
              source={{ uri: imageURL.baseURL + issue?.user?.avatar }}
              style={styles.avatar}
            />
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
                {
                  color:
                    issue?.user?.role === "user" ? COLORS.primary : "orange",
                },
              ]}
            >
              {issue?.user?.role || "N/A"}
            </Text>
          </View>
        </View>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Text style={[styles.userName, {}]}>Status: </Text>
          <Text
            style={[
              styles.userMobile,
              { color: getStatusColor(issue?.status) },
            ]}
          >
            {issue?.status}
          </Text>
        </View>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Text style={[styles.userName, {}]}>Created at: </Text>
          <Text style={[styles.userMobile, {}]}>{issue?.created_at}</Text>
        </View>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Text style={[styles.userName, {}]}>Title: </Text>
          <Text style={[styles.userMobile, {}]}>{issue?.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function searchBar() {
    return (
      <View
        style={{
          margin: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MyStatusBar />

        {/* Wrap SearchBar and give it flex: 1 */}
        <View style={[styles.searchBar, { flex: 1 }]}>
          <MaterialIcons
            name="search"
            size={24}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search here .."
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

        {/* Filter Icon */}
        <View style={{ position: "relative", marginLeft: 12 }}>
          <MaterialIcons
            name="filter-list"
            color={Colors.blackColor}
            size={26}
            onPress={() => setBottomSheetVisible(true)}
          />
          <View
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "red",
              borderRadius: 10,
              width: 18,
              height: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
             {filteredIssues?.length}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  function bottonSheet() {
    return (
      <RNModal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => setBottomSheetVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View style={styles.bottomSheet}>
          {/* {roleSelector()} */}
          {statusSection()}
        </View>
      </RNModal>
    );
  }
    function statusSection() {
      const statuses = [ "Resolved", "In Progress", "Closed", "Escalated","Open","Rejected"];
  
      const toggleStatus = (status) => {
        if (selectedStatuses.includes(status)) {
          setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
        } else {
          setSelectedStatuses([...selectedStatuses, status]);
        }
      };
  
      return (
        <View style={[styles.section, { marginBottom: 12 }]}>
          <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 14 }}>
            Select Status
          </Text>
  
          <View style={[styles.TypeContainer, { flexWrap: "wrap" }]}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.TypeButton,
                  selectedStatuses.includes(status) && styles.selectedButton,
                ]}
                onPress={() => toggleStatus(status)}
              >
                <Text
                  style={[
                    styles.TypebuttonText,
                    selectedStatuses.includes(status) &&
                      styles.selectedButtonText,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
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
    bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
    TypeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  TypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  TypebuttonText: {
    fontSize: 12,
    color: "#555",
  },
  selectedButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedButtonText: {
    color: "white",
  },
});

export default ViewAllIssuesPage;
