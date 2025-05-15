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
} from "../../../constants/styles";import MyStatusBar from "../../../components/myStatusBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNModal from "react-native-modal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { color } from "@rneui/base";
import { RefreshControl } from "react-native";
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
    password: null
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
    password: null
  }
];

// User item component - extracted for better code organization

const ViewAllUserPage = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user?.owner_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.mobile_number?.includes(searchQuery)
  );

const handleRefresh = async () => {
     
};



  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar/>

     {searchBar()}

      <FlatList
       refreshing={refreshing}
       onRefresh={handleRefresh}
        data={filteredUsers}
        renderItem={({ item }) => <UserInfo user={item} />}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-search" size={60} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No users found</Text>
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

  function UserInfo({ user }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("userDetailScreen",{user})} style={styles.userItem}>
     {user?.avatar ? (
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        ) : (
          <Icon name="account-circle" size={50} color="#ccc" style={styles.avatar} />
        )}
  
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.owner_legal_name || "N/A"}</Text>
          <Text style={styles.userMobile}>{user?.mobile_number || "N/A"}</Text>
        </View>
  
        <View style={[styles.roleBadge]}>
          <Text
            style={[
              styles.roleText,
              { color: user?.role === "user" ? COLORS.primary : "orange" },
            ]}
          >
            {user?.role || "N/A"}
          </Text>
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
            placeholder="Search Users or Vendors...."
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
        <MaterialIcons
          name="filter-list"
          color={Colors.blackColor}
          size={26}
          style={{ marginLeft: 12 }} // add some spacing
          onPress={() =>
            setBottomSheetVisible(true)
          }
        />
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
            {roleSelector()}
            {statusSection()}
          </View>
        </RNModal>)
    }
  
    function roleSelector() {
      const roles = ["user", "vendor", "both"];
  
      return (
        <View style={[styles.section, { marginBottom: 12 }]}>
          <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
            Select Role
          </Text>
  
          <View style={styles.TypeContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.TypeButton,
                  selectedRole === role && styles.selectedButton,
                ]}
                onPress={() => setSelectedRole(role)}
              >
                <Text
                  style={[
                    styles.TypebuttonText,
                    selectedRole === role && styles.selectedButtonText,
                  ]}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
  
  
function statusSection() {
  const statuses = ['All', 'Active', 'Inactive', 'Rejected', 'Hold'];

  const toggleStatus = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <View style={[styles.section, { marginBottom: 12 }]}>
      <Text style={{ marginBottom: 4, fontWeight: 'bold', fontSize: 14 }}>
        Select Status
      </Text>

      <View style={[styles.TypeContainer, { flexWrap: 'wrap' }]}>
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
                selectedStatuses.includes(status) && styles.selectedButtonText,
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
    paddingHorizontal: Sizes.fixPadding*0.5,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 3,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
   
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
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
  }, TypeButton: {
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

export default ViewAllUserPage;
