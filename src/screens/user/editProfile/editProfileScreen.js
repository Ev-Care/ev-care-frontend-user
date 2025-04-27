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
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { BottomSheet } from "@rneui/themed";
import { Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../auth/services/selector";
import { setupImagePicker } from "../../vendor/CompleteProfileDetail/vendorDetailForm";
import { postSingleFile } from "../../auth/services/crudFunction";
import { patchUpdateUserProfile } from "../service/crudFunction";
import imageURL from "../../../constants/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RefreshControl } from 'react-native';
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
const EditProfileScreen = ({ navigation }) => {
  const user = useSelector(selectUser);
  const [name, setname] = useState(user?.name || "Anonymous User");
  const [email, setemail] = useState(user?.email);
  const [refreshing, setRefreshing] = useState(false);
  const [showChangeProfilePicSheet, setshowChangeProfilePicSheet] =
    useState(false);
  const [profileImage, setProfileImage] = useState(
    imageURL.baseURL + (user?.avatar || "")
  );
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImageURI, setProfileImageURI] = useState(null);
  const dispatch = useDispatch();
  const accessToken = useSelector(selectToken);
  console.log('token', accessToken);

  const handleSubmit = async () => {
    const updatedData = {
      owner_legal_name: name,
      email: email,
      avatar: profileImageURI ? profileImageURI : user?.avatar,
      business_name: user?.business_name,
      user_key: user?.user_key,
    };
    console.log("Updated Data: before call", updatedData);

    const response = await dispatch(patchUpdateUserProfile(updatedData));

    if (patchUpdateUserProfile.fulfilled.match(response)) {
      dispatch(showSnackbar({ message: 'Profile Updated Successfully.', type: "success" }));
      navigation.goBack();
    } else if (patchUpdateUserProfile.rejected.match(response)) {
      dispatch(showSnackbar({ message: errorMessage || "Failed to update profile.", type: "error" }));
    }
   
  };

  const pickImage = async (source) => {
    let permissionResult;

    if (source === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult?.granted === false) {
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
        quality: 0.2,
      });
    }

    if (!result?.canceled) {
      const imageUri = result?.assets?.[0]?.uri;

      if (!imageUri) {
        Alert.alert("Error", "Unable to pick image.");
        return;
      }

      setImageLoading(true);
      const file = await setupImagePicker(imageUri);

      try {
        console.log("request:", { file: file, accessToken: accessToken })
        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );

        if (
          response?.payload?.code === 200 ||
          response?.payload?.code === 201
        ) {
          setProfileImageURI(response?.payload?.data?.filePathUrl);
          // console.log("profile Image URI set successfully:", response?.payload?.data?.filePathUrl);
          setProfileImage(
            imageURL.baseURL + (response?.payload?.data?.filePathUrl || "")
          );

        } else {
          Alert.alert("Error", "File Should be less than 5 MB");
        }
      } catch (error) {

        console.log("Error uploading file:", error);
        Alert.alert("Error", "Upload failed. Please try again.");
      } finally {
        setImageLoading(false);
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
          {emailInfo()}
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
              icon: require("../../../../assets/images/icons/camera.png"),
              option: "Camera",
            })}
            {sheetOptionSort({
              icon: require("../../../../assets/images/icons/gallery.png"),
              option: "Choose from gallery",
            })}
            {sheetOptionSort({
              icon: require("../../../../assets/images/icons/remove_image.png"),
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
      <View style={{ margin: Sizes?.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold }}>Email address</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your email address here"
            placeholderTextColor={Colors.grayColor}
            value={email || ""}
            onChangeText={(text) => setemail(text?.toLowerCase?.())}
            style={{ ...Fonts.blackColor16Medium }}
            keyboardType="email-address"
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
    );
  }

  function nameInfo() {
    return (
      <View style={{ marginHorizontal: Sizes?.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold }}>Name</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your name here"
            placeholderTextColor={Colors.grayColor}
            value={name || ""}
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
          marginHorizontal: Sizes?.fixPadding * 2.0,
          marginBottom: Sizes?.fixPadding + 5.0,
        }}
      >
        {/* {console.log("Profile Image URI:", user?.avatar)} */}
        {profileImage ? (
          <>
            {console.log('imageLoading', imageLoading)}
            {imageLoading && <ActivityIndicator size={40} color="#ccc" />}
            <Image
              source={profileImage ? { uri: profileImage } : null}
              style={styles.profilePicStyle}
            // onLoadStart={() => setImageLoading(false)}
            // onLoadEnd={() => setImageLoading(false)}
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
          onPress={() => setshowChangeProfilePicSheet(true)}
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
});
