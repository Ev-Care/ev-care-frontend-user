import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Linking,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import React, { useState, useEffect } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useDispatch, useSelector } from "react-redux";
import { postSignUp } from "./services/crudFunction";
import { selectAuthError, selectToken, selectUser } from "./services/selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false); // Loader state
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Get user data from Redux store
  const token = useSelector(selectToken); // Get user data from Redux store
  const error = useSelector(selectAuthError); // Get error from Redux store
  const userKey = route?.params?.userKey;

  // console.log("user key in register : ", userKey);

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    setLoading(true);

    const userData = {
      email: email,
      owner_legal_name: fullName,
      role: role,
      user_key: userKey, // Use user_key from Redux state
    };

    console.log("Post signup called");
    try {
      const response = await dispatch(postSignUp(userData));
    } catch (error) {
      console.log("Error during registration");
      dispatch(
        showSnackbar({ message: error || "Registration Failed", type: "error" })
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect to handle user and token updates
  useEffect(() => {
    if (user && user?.status !== "New" && token) {
      console.log("User and token updated in useEffect:", user, token);

      try {
        // Save user data and token to AsyncStorage
        AsyncStorage.setItem("user", user.user_key);
        AsyncStorage.setItem("accessToken", token);

        console.log(
          "Access token stored in AsyncStorage:",
          AsyncStorage.getItem("token")
        );

        dispatch(
          showSnackbar({
            message: error || "Registration Successfull",
            type: "success",
          })
        );

        navigation.navigate("userHome"); // Navigate to the home screen
      } catch (error) {
        console.error("Error saving user data:", error);
        dispatch(
          showSnackbar({ message: "Error in saving user data", type: "error" })
        );
      }
    } else if (error) {
      console.error("Error during registration:", error);
      dispatch(
        showSnackbar({ message: error || "Registration Failed", type: "error" })
      );
    }
  }, [user, token, error, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {topImage()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >
          {selectRole()}
          {fullNameInfo()}
          {emailInfo()}
          {continueButton()}
          {agreeInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function selectRole() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          margin: Sizes.fixPadding * 2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="User"
            status={role === "user" ? "checked" : "unchecked"}
            onPress={() => setRole("user")}
          />
          <Text>User</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="Vendor"
            status={role === "vendor" ? "checked" : "unchecked"}
            onPress={() => setRole("vendor")}
          />
          <Text>Vendor</Text>
        </View>
      </View>
    );
  }

  function agreeInfo() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center", ...Fonts.grayColor16Medium }}>
          By continuing, you agree to our
        </Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("http://89.116.34.17:3000/terms-and-conditions")
          }
        >
          <Text
            style={{
              textAlign: "center",
              ...Fonts.grayColor18SemiBold,
              color:"blue",
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View
        style={{
          ...styles.textFieldWrapper,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <TextInput
          placeholder="Email address"
          placeholderTextColor={Colors.grayColor}
          value={email}
          onChangeText={(text) => setemail(text.toLowerCase())}
          style={{ ...Fonts.blackColor16Medium }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
      </View>
    );
  }

  function fullNameInfo() {
    return (
      <View style={{ ...styles.textFieldWrapper }}>
        <TextInput
          placeholder="Full name"
          placeholderTextColor={Colors.grayColor}
          value={fullName}
          onChangeText={(text) => setfullName(text)}
          style={{ ...Fonts.blackColor16Medium }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
      </View>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSignUp}
        style={{
          ...commonStyles.button,
          borderRadius: Sizes.fixPadding - 5.0,
          margin: Sizes.fixPadding * 2.0,
        }}
        disabled={loading}
      >
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={{ ...Fonts.whiteColor18Medium }}>Please Wait...</Text>
          </View>
        ) : (
          <Text style={{ ...Fonts.whiteColor18Medium }}>Continue</Text>
        )}
      </TouchableOpacity>
    );
  }

  function topImage() {
    return (
      <ImageBackground
        source={require("../../../assets/images/authbg.png")}
        style={{ width: screenWidth, height: screenWidth - 150 }}
        resizeMode="stretch"
      >
        <View style={styles.topImageOverlay}>
          <MaterialIcons
            name="arrow-back"
            color={Colors.whiteColor}
            size={26}
            onPress={() => navigation.goBack()} // Use goBack instead of navigate
          />
          <View>
            <Text style={{ ...Fonts.whiteColor22SemiBold }}>Register</Text>
            <Text
              style={{
                ...Fonts.whiteColor16Regular,
                marginTop: Sizes.fixPadding,
              }}
            >
              Create your account
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
};

export default RegisterScreen;

const styles = StyleSheet.create({
  topImageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: Sizes.fixPadding * 2.0,
  },
  textFieldWrapper: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    paddingVertical:
      Platform.OS === "ios" ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    marginBottom: Sizes.fixPadding * 2.0,
    marginLeft: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
  },
});
