import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../../constants/styles";
import MyStatusBar from "../../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { BottomSheet } from "@rneui/themed";
import { Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../../auth/services/selector";
import { setupImagePicker } from "../../../vendor/CompleteProfileDetail/vendorDetailForm";
import { postSingleFile } from "../../../auth/services/crudFunction";
import { patchUpdateUserProfile } from "../../../user/service/crudFunction";
import { Ionicons } from "@expo/vector-icons";
import imageURL from "../../../../constants/baseURL";
import { RefreshControl } from 'react-native';
const EditProfileScreen = ({ navigation }) => {
  const user = useSelector(selectUser);
  const [businessName, setBusinessName] = useState(
    user?.business_name || "Anonymous User"
  );
  const [name, setname] = useState(user?.name || "Anonymous User");
  const [email, setemail] = useState(user?.email);
  const [showChangeProfilePicSheet, setshowChangeProfilePicSheet] =
    useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImageURI, setProfileImageURI] = useState(null);
  const dispatch = useDispatch(); // Get the dispatch function
  const accessToken = useSelector(selectToken); // Get access token from Redux store
  const [refreshing, setRefreshing] = useState(false);
  const [aadharNumber, setAadharNumber] = useState(
    user?.adhar_no || "Anonymous User"
  );
  const [panNumber, setPanNumber] = useState(user?.tan_no || "Anonymous User");
  const [tanNumber, setTanNumber] = useState(user?.pan_no || "Anonymous User");

  console.log("user profile URL", imageURL.baseURL + user?.adhar_front_pic);

  const handleSubmit = async () => {
    var updatedData = {
      owner_legal_name: name,
      email: email,
      avatar: profileImageURI,
      business_name: user?.business_name,
      user_key: user?.user_key,
    };
    console.log("Updated Data:", updatedData);
    const response = await dispatch(patchUpdateUserProfile(updatedData));
    Alert.alert(
      "Profile Updated",
      "Your profile has been updated successfully."
    );
  };

  const pickImage = async (source) => {
    let permissionResult;

    if (source === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      alert("Permission is required!");
      return;
    }

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      setImageLoading(true);
      const file = await setupImagePicker(imageUri);

      try {
        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );

        if (
          response?.payload?.code === 200 ||
          response?.payload?.code === 201
        ) {
          setProfileImageURI(response?.payload?.data?.filePathUrl);
          console.log(
            "profile Image URI set successfully:",
            response?.payload?.data?.filePathUrl
          );
          setProfileImage(imageUri);
          setImageLoading(false);
          // Alert.alert("Success", "File uploaded successfully!");
        } else {
          Alert.alert("Error", "File Should be less than 5 MB");
        }
      } catch (error) {
        setImageLoading(false);
        console.log("Error uploading file:", error);
        Alert.alert("Error", "Upload failed. Please try again.");
      }
    }
  };
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log("Refresh completed!");
    }, 2000);
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#9Bd35A', '#101942']}  // Android spinner colors
              tintColor="#101942"            // iOS spinner color
            />
          }

          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {profilePicInfo()}
          {nameInfo()}
          {businessNameInfo()}
          {emailInfo()}
          <View
            style={{
              marginBottom: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ ...Fonts.grayColor18SemiBold, color: "red" }}>
              You Can't Edit Below Fields
            </Text>
          </View>
          {aadharInfo()}
          {panInfo()}
          {tanInfo()}
        </ScrollView>
      </View>
      {updateProfileButton()}
      {changeProfilePicOptionSheet()}
    </View>
  );

  function changeProfilePicOptionSheet() {
    return (
      <BottomSheet
        isVisible={showChangeProfilePicSheet}
        onBackdropPress={() => setshowChangeProfilePicSheet(false)}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
      >
        <View style={styles.sheetWrapStyle}>
          <Text style={{ textAlign: "center", ...Fonts.blackColor18SemiBold }}>
            Choose action
          </Text>
          <View style={{ marginTop: Sizes.fixPadding + 5.0 }}>
            {sheetOptionSort({
              icon: require("../../../../../assets/images/icons/camera.png"),
              option: "Camera",
            })}
            {sheetOptionSort({
              icon: require("../../../../../assets/images/icons/gallery.png"),
              option: "Choose from gallery",
            })}
            {sheetOptionSort({
              icon: require("../../../../../assets/images/icons/remove_image.png"),
              option: "Remove profile picture",
            })}
          </View>
        </View>
      </BottomSheet>
    );
  }

  function sheetOptionSort({ icon, option }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowChangeProfilePicSheet(false);
          if (option === "Camera") {
            pickImage("camera");
          } else if (option === "Choose from gallery") {
            pickImage("gallery");
          } else if (option === "Remove profile picture") {
            setProfileImage(null);
          }
        }}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 1.5,
        }}
      >
        <View style={{ flex: 1, ...commonStyles.rowAlignCenter }}>
          <View style={{ ...styles.sheetOptionWrapStyle }}>
            <Image
              source={icon}
              style={{ width: 22.0, height: 22.0, resizeMode: "contain" }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor18Medium,
              flex: 1,
              marginLeft: Sizes.fixPadding * 1.5,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          color={Colors.primaryColor}
          size={15}
        />
      </TouchableOpacity>
    );
  }

  function updateProfileButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit}
        style={{ ...commonStyles.button, borderRadius: 0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Update profile</Text>
      </TouchableOpacity>
    );
  }

  function emailInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold }}>Email address</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your email address here"
            placeholderTextColor={Colors.grayColor}
            value={email}
            onChangeText={(text) => setemail(text)}
            style={{ ...Fonts.blackColor16Medium }}
            keyboardType="email-address"
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
    );
  }

  function businessNameInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold, marginTop: 10 }}>
          Business Name
        </Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your Business name here"
            placeholderTextColor={Colors.grayColor}
            value={businessName}
            onChangeText={(text) => setBusinessName(text)}
            style={{ ...Fonts.blackColor16Medium }}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
    );
  }
  function nameInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold }}>Name</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your name here"
            placeholderTextColor={Colors.grayColor}
            value={name}
            onChangeText={(text) => setname(text)}
            style={{ ...Fonts.blackColor16Medium }}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
    );
  }

  function profilePicInfo() {
    return (
      <View
        style={{
          alignSelf: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding + 5.0,
        }}
      >
        {profileImage ? (
          <>
            {imageLoading && <ActivityIndicator size={40} color="#ccc" />}
            <Image
              source={{ uri: profileImage }}
              style={styles.profilePicStyle}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </>
        ) : (
          <MaterialIcons
            name="account-circle"
            size={screenWidth / 4.0}
            color={Colors.grayColor}
            style={{ textAlign: "center" }}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowChangeProfilePicSheet(true);
          }}
          style={styles.editIconWrapper}
        >
          <MaterialIcons name="edit" color={Colors.whiteColor} size={16} />
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Edit Profile
        </Text>
      </View>
    );
  }
  function aadharInfo() {
    return (
      <>
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <Text style={{ ...Fonts.grayColor18SemiBold }}>Aadhar Card</Text>
          <View style={styles.textFieldWrapper}>
            <TextInput
              placeholder="Enter your name here"
              placeholderTextColor={Colors.grayColor}
              value={aadharNumber}
              style={{ ...Fonts.blackColor16Medium }}
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.docContainer}>
          <View style={styles.box}>
            <Image
              source={{
                uri:
                  user?.adhar_front_pic && user.adhar_front_pic.trim() !== ""
                    ? imageURL.baseURL + user.adhar_front_pic
                    : "https://media.istockphoto.com/id/1154042526/photo/maski-karnataka-india-december-22-2018-aadhaar-card-which-is-issued-by-government-of-india-as.jpg?s=2048x2048&w=is&k=20&c=pahX9npRpBMDr4YT2z-pRKZX2tGXWAOtJ18tHP-KonE=",
              }}
              style={styles.docImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="pencil" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.docContainer}>
          <View style={styles.box}>
            <Image
              source={{
                uri: user?.adhar_back_pic
                  ? imageURL.baseURL + user.adhar_back_pic
                  : "https://media.istockphoto.com/id/1154042526/photo/maski-karnataka-india-december-22-2018-aadhaar-card-which-is-issued-by-government-of-india-as.jpg?s=2048x2048&w=is&k=20&c=pahX9npRpBMDr4YT2z-pRKZX2tGXWAOtJ18tHP-KonE=",
              }}
              style={styles.docImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="pencil" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
  function panInfo() {
    return (
      <>
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <Text style={{ ...Fonts.grayColor18SemiBold }}>Pan Card</Text>
          <View style={styles.textFieldWrapper}>
            <TextInput
              placeholder="Enter your name here"
              placeholderTextColor={Colors.grayColor}
              value={panNumber}
              onChangeText={(text) => setname(text)}
              style={{ ...Fonts.blackColor16Medium }}
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.docContainer}>
          <View style={styles.box}>
            <Image
              source={{
                uri: user?.pan_pic
                  ? imageURL.baseURL + user.pan_pic
                  : "https://media.istockphoto.com/id/1154042526/photo/maski-karnataka-india-december-22-2018-aadhaar-card-which-is-issued-by-government-of-india-as.jpg?s=2048x2048&w=is&k=20&c=pahX9npRpBMDr4YT2z-pRKZX2tGXWAOtJ18tHP-KonE=",
              }}
              style={styles.docImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="pencil" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
  function tanInfo() {
    return (
      <>
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <Text style={{ ...Fonts.grayColor18SemiBold }}>Tan Card</Text>
          <View style={styles.textFieldWrapper}>
            <TextInput
              placeholder="Enter your name here"
              placeholderTextColor={Colors.grayColor}
              value={tanNumber}
              onChangeText={(text) => setname(text)}
              style={{ ...Fonts.blackColor16Medium }}
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.docContainer}>
          <View style={styles.box}>
            <Image
              source={{
                uri: user?.tan_pic
                  ? imageURL.baseURL + user.tan_pic
                  : "https://media.istockphoto.com/id/1154042526/photo/maski-karnataka-india-december-22-2018-aadhaar-card-which-is-issued-by-government-of-india-as.jpg?s=2048x2048&w=is&k=20&c=pahX9npRpBMDr4YT2z-pRKZX2tGXWAOtJ18tHP-KonE=",
              }}
              style={styles.docImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="pencil" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  editIconWrapper: {
    width: 32.0,
    height: 32.0,
    borderRadius: 16.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderColor: Colors.whiteColor,
    borderWidth: 1.0,
  },
  profilePicStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    paddingVertical:
      Platform.OS == "ios" ? Sizes.fixPadding - 2.0 : Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding,
  },
  sheetWrapStyle: {
    backgroundColor: Colors.bodyBackColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding + 10.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  sheetOptionWrapStyle: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: "rgba(6, 124, 96, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  docContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  box: {
    width: 350, // Width of the box
    height: 225, // Height to maintain 4:3 aspect ratio (4/3 * 300 = 225)
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    borderStyle: "dashed",
    position: "relative", // To position the edit icon at the top right
    justifyContent: "center",
    alignItems: "center",
  },
  docImage: {
    width: "100%",
    height: "100%",
  },
  editIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white", // Optional: make the icon stand out more
    borderRadius: 20,
    padding: 5,
  },
});
