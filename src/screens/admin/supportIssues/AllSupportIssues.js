// ViewAllUserPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
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

// Sample user data
const USERS = [
  {
    id: 18,
    user_key: "b2ZB4gFprc",
    owner_legal_name: "Dummy User",
    business_name: null,
    mobile_number: "+916666666666",
    email: null,
    otp: "573937",
    pan_no: null,
    tan_no: null,
    adhar_no: null,
    address: null,
    avatar: null,
    adhar_front_pic: null,
    adhar_back_pic: null,
    pan_pic: null,
    tan_pic: null,
    google_id: null,
    otp_expiry_date: "2025-04-23T18:41:38.000Z",
    status: "New",
    role: "user",
    login_method: "mobile_otp",
    created_at: "2025-04-23T18:31:38.000Z",
    update_at: "2025-04-23T18:31:38.509Z",
    updated_by: 0,
    isLoggedIn: true,
    password: null,
  },
  {
    id: 19,
    user_key: "b2ZB4gFprc",
    owner_legal_name: "Dummy User 2",
    business_name: null,
    mobile_number: "+9166666666669",
    email: null,
    otp: "573937",
    pan_no: null,
    tan_no: null,
    adhar_no: null,
    address: null,
    avatar: null,
    adhar_front_pic: null,
    adhar_back_pic: null,
    pan_pic: null,
    tan_pic: null,
    google_id: null,
    otp_expiry_date: "2025-04-23T18:41:38.000Z",
    status: "New",
    role: "vendor",
    login_method: "mobile_otp",
    created_at: "2025-04-23T18:31:38.000Z",
    update_at: "2025-04-23T18:31:38.509Z",
    updated_by: 0,
    isLoggedIn: true,
    password: null,
  },
];

const allIssues = [
  {
    "user": {
      "id": 60,
      "user_key": "ALdwJF818e",
      "owner_legal_name": "vendor5",
      "business_name": "This is business 3466",
      "mobile_number": "6666666666",
      "email": "Vendor66@gmail.com",
      "otp": "264844",
      "pan_no": "MCNPS2766K",
      "tan_no": null,
      "gstin_number": null,
      "gstin_image": null,
      "adhar_no": "343934391765",
      "address": "16, Near Ganesh Garden, Ambegaon Pathar, Pune, Maharashtra 411046, India",
      "avatar": "/uploads/1746087113689.jpeg",
      "adhar_front_pic": "/uploads/1746087164706.jpeg",
      "adhar_back_pic": "/uploads/1746087168841.jpeg",
      "pan_pic": "/uploads/1746087180925.jpeg",
      "tan_pic": null,
      "google_id": null,
      "otp_expiry_date": "2025-05-07T20:02:48.000Z",
      "status": "Active",
      "role": "vendor",
      "vehicle_registration_number": null,
      "vehicle_manufacturer": null,
      "vehicle_model": null,
      "vendor_type": null,
      "login_method": "mobile_otp",
      "created_at": "2025-05-01T07:24:49.453Z",
      "update_at": "2025-05-07T19:52:47.000Z",
      "updated_by": 0,
      "isLoggedIn": true,
      "password": null
    },
    status: "pending",
    "contact_number": "+916666666666",
    "contact_email": "dummy.user@example.com",
    "title": "Unable to update profile",
    "message": "Every time I try to update my profile, the app crashes.",
    "reference_image_url": null,
    "created_at": "2025-05-08T13:30:00Z"
  },
  {
    "user":  {
      id: 19,
      user_key: "b2ZB4gFprc",
      owner_legal_name: "Ravi Kumar",
      business_name: null,
      mobile_number: "+911234567890",
      email: null,
      otp: "573937",
      pan_no: null,
      tan_no: null,
      adhar_no: null,
      address: null,
      avatar: null,
      adhar_front_pic: null,
      adhar_back_pic: null,
      pan_pic: null,
      tan_pic: null,
      google_id: null,
      otp_expiry_date: "2025-04-23T18:41:38.000Z",
      status: "New",
      role: "vendor",
      login_method: "mobile_otp",
      created_at: "2025-04-23T18:31:38.000Z",
      update_at: "2025-04-23T18:31:38.509Z",
      updated_by: 0,
      isLoggedIn: true,
      password: null,
    },
    status: "pending",
    "contact_number": "+916666666666",
    "contact_email": "dummy.user@example.com",
    "title": "App UI issue on support screen",
    "message": "The image preview is not loading correctly as shown in the screenshot.",
    "reference_image_url": "https://yourdomain.com/uploads/support/issue_screenshot_123.jpg",
    "created_at": "2025-05-08T14:05:00Z"
  },
  {
    "user": {
      id: 19,
      user_key: "b2ZB4gFprc",
      owner_legal_name: "Gaurav Chaubey",
      business_name: null,
      mobile_number: "+9166666666669",
      email: null,
      otp: "573937",
      pan_no: null,
      tan_no: null,
      adhar_no: null,
      address: null,
      avatar: null,
      adhar_front_pic: null,
      adhar_back_pic: null,
      pan_pic: null,
      tan_pic: null,
      google_id: null,
      otp_expiry_date: "2025-04-23T18:41:38.000Z",
      status: "New",
      role: "vendor",
      login_method: "mobile_otp",
      created_at: "2025-04-23T18:31:38.000Z",
      update_at: "2025-04-23T18:31:38.509Z",
      updated_by: 0,
      isLoggedIn: true,
      password: null,
    },
    status: "pending",
    "contact_number": "+916666666666",
    "contact_email": null,
    "title": "Login OTP not received",
    "message": "Tried multiple times but no OTP was received on my phone.",
    "reference_image_url": null,
    "created_at": "2025-05-08T15:00:00Z"
  }
];

// User item component - extracted for better code organization

const ViewAllIssuesPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(USERS);

  // Filter users based on search query
  const filteredIssues = allIssues.filter(
    (issue) =>
      issue?.user?.owner_legal_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      issue?.user.mobile_number?.includes(searchQuery)
  );

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
