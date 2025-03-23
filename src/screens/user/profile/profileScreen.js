import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
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
import {  logoutUser } from "../../../redux/store/userSlice";
import {  useDispatch } from "react-redux";
const ProfileScreen = ({ navigation }) => {
  const [showLogoutSheet, setshowLogoutSheet] = useState(false);
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {profileInfoWithOptions()}
        </ScrollView>
      </View>
      {logoutSheet()}
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
                dispatch( logoutUser());
                navigation.push("Signin");
                setshowLogoutSheet(false);
               
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
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../../../assets/images/users/user4.png")}
            style={styles.userImageStyle}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor18SemiBold }}>User Name</Text>
          <Text style={{ ...Fonts.grayColor16Medium }}>+919677566679</Text>
        </View>
        <View>
          {profileOption({
            option: "Edit Profile",
            icon: require("../../../../assets/images/icons/user.png"),
            onPress: () => {
              navigation.push("EditProfile");
            },
          })}
          {profileOption({
            option: "My Bookings",
            icon: require("../../../../assets/images/icons/calendar.png"),
            onPress: () => {
              navigation.navigate("Booking");
            },
          })}
          {profileOption({
            option: "Notifications",
            icon: require("../../../../assets/images/icons/notification.png"),
            onPress: () => {
              navigation.push("Notification");
            },
          })}
          {profileOption({
            option: "Terms & Condition",
            icon: require("../../../../assets/images/icons/list.png"),
            onPress: () => {
              navigation.push("TermsAndConditions");
            },
          })}
          {profileOption({
            option: "FAQ",
            icon: require("../../../../assets/images/icons/faq.png"),
            onPress: () => {
              navigation.push("Faq");
            },
          })}
          {profileOption({
            option: "Privacy Policy",
            icon: require("../../../../assets/images/icons/privacy_policy.png"),
            onPress: () => {
              navigation.push("PrivacyPolicy");
            },
          })}
          {profileOption({
            option: "Help",
            icon: require("../../../../assets/images/icons/help.png"),
            onPress: () => {
              navigation.push("Help");
            },
          })}
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
            <Image
              source={require("../../../../assets/images/icons/logout.png")}
              style={{ width: 24.0, height: 24.0, resizeMode: "contain" }}
            />
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

  function profileOption({ option, icon, onPress }) {
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
            <Image
              source={icon}
              style={{ width: 24.0, height: 24.0, resizeMode: "contain" }}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  userImageStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
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
    backgroundColor: "rgba(6, 124, 96, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },  
  sheetButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical:
      Platform.OS == 'ios' ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
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
});
