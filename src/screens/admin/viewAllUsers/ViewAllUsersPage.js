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
} from "../../../constants/styles";import MyStatusBar from "../../../components/myStatusBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { color } from "@rneui/base";
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
    id: "1",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "user",
  },
  {
    id: "2",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "vendor",
  },
  {
    id: "3",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "user",
  },
  {
    id: "4",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "vendor",
  },
  {
    id: "5",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "user",
  },
  {
    id: "6",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "user",
  },
  {
    id: "7",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "vendor",
  },
  {
    id: "8",
    name: "user name",
    mobile: "+912678387266",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "user",
  },

];

// User item component - extracted for better code organization

const ViewAllUserPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(USERS);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar/>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => <UserInfo user={item} />}
        keyExtractor={(item) => item.id}
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
    </SafeAreaView>
  );
  function UserInfo({ user }) {
    return (
      <View style={styles.userItem}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userMobile}>{user.mobile}</Text>
        </View>
        <View style={[styles.roleBadge]}>
          <Text
            style={[
              styles.roleText,
              { color: user.role === "user" ? COLORS.primary : "orange" },
            ]}
          >
            {user.role}
          </Text>
        </View>
      </View>
    );
  }
  function SearchBar({ value, onChangeText }) {
    return (
      <View style={{ margin: 20.0 }}>
        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={24}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search users"
            placeholderTextColor="#888"
            style={{
              flex: 1,
              fontSize: 16,
              color: "#000",
            }}
            value={value}
            onChangeText={onChangeText}
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
});

export default ViewAllUserPage;
