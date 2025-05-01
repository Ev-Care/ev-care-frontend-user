import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BottomSheet } from "@rneui/themed";
import { logoutUser } from "../../../redux/store/userSlice";
import { selectUser } from "../../auth/services/selector";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import imageURL from "../../../constants/baseURL";
import Icon from "react-native-vector-icons/MaterialIcons";
const AdminProfilePage = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogoutSheet, setshowLogoutSheet] = useState(false);

  console.log(
    "user image on vendor profile screen",
    imageURL?.baseURL + user?.avatar
  );

  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <ScrollView style={{ flex: 1 }}>
        {/* {header()} */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 50,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {profileInfoWithOptions()}
        </ScrollView>
      </ScrollView>
      {logoutSheet()}
      {/* Full Image Modal */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );

  function logoutSheet() {
    return (
      <BottomSheet
        isVisible={showLogoutSheet}
        onBackdropPress={() => setshowLogoutSheet(false)}
        containerStyle={{
          backgroundColor: "rgba(0.5, 0.50, 0, 0.50)",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.bodyBackColor,
            borderTopLeftRadius: Sizes.fixPadding,
            borderTopRightRadius: Sizes.fixPadding,
          }}
        >
          <Text style={styles.logoutTextStyle}>Logout</Text>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              marginVertical: Sizes.fixPadding,
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            Are you sure want to logout?
          </Text>
          <View
            style={{
              ...commonStyles.rowAlignCenter,
              marginTop: Sizes.fixPadding,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowLogoutSheet(false);
              }}
              style={{
                ...styles.cancelButtonStyle,
                ...styles.sheetButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.blackColor16Medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                dispatch(logoutUser());
                setshowLogoutSheet(false);
                console.log(
                  "User logged out successfully in profileScreen and navigting to Signin"
                );
              }}
              style={{
                ...styles.logoutButtonStyle,
                ...styles.sheetButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  }

  function profileInfoWithOptions() {
    return (
      <View style={styles.profileInfoWithOptionsWrapStyle}>
        <TouchableOpacity
          onPress={() => {
            if (user?.avatar && user.avatar.trim() !== "") {
              showFullImage(imageURL?.baseURL + user.avatar);
            }
          }}
          style={{ alignItems: "center" }}
        >
          {user?.avatar && user.avatar.trim() !== "" ? (
            <Image
              source={{ uri: imageURL?.baseURL + user.avatar }}
              style={styles.userImageStyle}
            />
          ) : (
            <View style={styles.userIconStyle}>
              <Icon name="person-off" size={60} color="#e0e0eb" />
            </View>
          )}
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor18SemiBold }}>{user?.name}</Text>
          <Text style={{ ...Fonts.grayColor16Medium }}>
            +91 {user?.mobile_number}
          </Text>
        </View>
        <View>
          {profileOption({
            option: "Edit Profile",
            iconName: "person",
            onPress: () => navigation.navigate("EditAdminProfile"),
          })}

          {profileOption({
            option: "Terms & Conditions",
            iconName: "list-alt",
            onPress: () => navigation.push("TermsAndConditionsScreen"),
          })}
          {/* {profileOption({
        option: "FAQ",
        iconName: "help-outline",
        onPress: () => navigation.push("FaqScreen"),
      })} */}
          {profileOption({
            option: "Privacy Policy",
            iconName: "privacy-tip",
            onPress: () => navigation.push("PrivacyPolicyScreen"),
          })}
          {/* {profileOption({
            option: "Help",
            iconName: "support-agent",
            onPress: () => navigation.push("HelpScreen"),
          })} */}
          {logoutInfo()}
        </View>
      </View>
    );
  }

  function logoutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowLogoutSheet(true);
        }}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <MaterialIcons name="logout" size={24} color={Colors.redColor} />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.redColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            Logout
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.redColor}
        />
      </TouchableOpacity>
    );
  }

  function profileOption({ option, iconName, onPress }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <MaterialIcons
              name={iconName}
              size={24}
              color={Colors.primaryColor}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.primaryColor}
        />
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor20SemiBold,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        Profile
      </Text>
    );
  }
};

export default AdminProfilePage;

const styles = StyleSheet.create({
  userImageStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
  },
  userIconStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: "#e0e0eb",
    borderWidth: 2.0,
    backgroundColor: Colors.whiteColor,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfoWithOptionsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  optionIconWrapper: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: "rgba(87, 88, 88, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical:
      Platform.OS == "ios" ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  logoutButtonStyle: {
    borderTopColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
  logoutTextStyle: {
    marginTop: Sizes.fixPadding * 1.5,
    ...Fonts.blackColor20SemiBold,
    textAlign: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  closeText: {
    color: "#000",
    fontWeight: "bold",
  },
});
