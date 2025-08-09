import {
  BackHandler,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { useFocusEffect } from "@react-navigation/native";

import { Overlay } from "@rneui/themed";
import { login, postSignIn } from "./services/crudFunction";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthError, selectloader, selectToken, selectUser } from "./services/selector";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
const SigninScreen = ({ navigation }) => {
  // 
  const [backClickCount, setBackClickCount] = useState(0);
 
  const [emailOrNumber, setEmailOrNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const user = useSelector(selectUser);
  const authErrorMessage = useSelector(selectAuthError);
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectloader);
  const dispatch = useDispatch();


  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      navigation.addListener("gestureEnd", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
        navigation.removeListener("gestureEnd", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const handleSignIn = async() => {
    // console.log(" handle Signin called ");
    if (!emailOrNumber || emailOrNumber.length < 3) {
      dispatch(showSnackbar({ message: 'Invalid Email or Phone', type: 'error' }))
      return;
    }

    if (!password) {
      dispatch(showSnackbar({ message: 'Password is required', type: 'error' }));
      return;
    }


    try {
      const response = await dispatch(login({ identifier: emailOrNumber, password }));

      if (login.fulfilled.match(response)) {
        // Save user data and token to AsyncStorage
        AsyncStorage.setItem("user", response?.payload?.data?.user?.user_key);
        // console.log('token in sigin = ', token);
        AsyncStorage.setItem("accessToken", response?.payload?.data?.access_token);

        // console.log(
        //   "Access token stored in AsyncStorage:",
        //   AsyncStorage.getItem("accessToken")
        // );

        dispatch(
          showSnackbar({
            message: "Log-In Successfull",
            type: "success",
          })
        );
      } else if(login.rejected.match(response)){
   
        dispatch(showSnackbar({
          message: response?.payload || authErrorMessage || "Log-In Failed",
          type: "error",
        }))
      }
    } catch (error) {
     
      dispatch(showSnackbar({
        message: authErrorMessage || "Something went wrong, try again",
        type: "error",
      }))

    }


  };




  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {topImage()}
        <ScrollView
          style={{ padding: 20 }}
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
          {emailOrNumberInfo()}
          {passwordField()}
          {forgetPassText()}
          {continueButton()}
          {SignUpText()}
        </ScrollView>
      </View>
      {exitInfo()}

    </View>
  );

  function emailOrNumberInfo() {
    return (<>
      <Text style={styles.sectionLabel}>
        Email or Mobile Number <Text style={styles.label}>*</Text>
        {/* <Text style={styles.optional}>(Optional)</Text> */}
      </Text>
      <View
        style={{
          ...styles.textFieldWrapper,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <TextInput
          placeholder="Enter Your Email id  or Mobile Number"
          placeholderTextColor={Colors.grayColor}
          value={emailOrNumber}
          onChangeText={(text) => setEmailOrNumber(text.toLowerCase())}
          style={{ ...Fonts.blackColor16Medium, paddingVertical: 12, fontSize: 12, }}
          cursorColor={Colors.primaryColor}
         
          keyboardType="email-address"
          maxLength={50}
        />
      </View>
    </>
    );
  }
  function passwordField() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Password <Text style={styles.label}>*</Text>
        </Text>
        <View
          style={{
            ...styles.textFieldWrapper,
            marginBottom: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            placeholder="Enter Your Password"
            placeholderTextColor={Colors.grayColor}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={secureText}
            style={{
              ...Fonts.blackColor16Medium,
              paddingVertical: 12,
              fontSize: 12,
              flex: 1,
            }}
            cursorColor={Colors.primaryColor}
         
          />
          <Ionicons
            name={secureText ? 'eye-off' : 'eye'}
            size={20}
            color={Colors.grayColor}
            onPress={() => setSecureText(!secureText)}
            style={{ marginHorizontal: 10 }}
          />
        </View>
      </>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSignIn}
        style={{ ...commonStyles.button, borderRadius: Sizes.fixPadding - 5.0, }}
      >
        {isLoading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ ...Fonts.whiteColor18Medium }}>Please Wait...</Text>
          </View>
        ) : (
          <Text style={{ ...Fonts.whiteColor18Medium }}>Sign In</Text>
        )}
      </TouchableOpacity>
    );
  }


  function topImage() {
    return (
      <ImageBackground
        source={require("../../../assets/images/authbg.png")}
        style={{ width: screenWidth, height: screenWidth - 150 }}
      // resizeMode="stretch"
      >
        <View style={styles.topImageOverlay}>
          <Text style={{ ...Fonts.whiteColor22SemiBold }}>Sign in</Text>
          <Text style={{ ...Fonts.whiteColor16Regular, marginTop: Sizes.fixPadding }}>
            Sign in to your account
          </Text>
        </View>
      </ImageBackground>
    );
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>Press Back Once Again To Exit!</Text>
      </View>
    ) : null;
  }
  function SignUpText() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        <Text style={{ textAlign: "center", ...Fonts.grayColor18Medium }}>
          Are You  New User ? {" "}
          <Text
            onPress={() => navigation.navigate("Register")}
            style={{ textAlign: "center", ...Fonts.grayColor18SemiBold, color: "blue", fontWeight: "700" }}>
            Sign Up
          </Text>
        </Text>
      </View>
    );
  }
  function forgetPassText() {
    return (
      <View style={{ alignItems: "flex-end", marginBottom: 20 }}>
        <Text style={{ ...Fonts.grayColor18Medium, textAlign: "right" }}>
          Forgot Password?{" "}
          <Text
            onPress={() => navigation.navigate("ForgetPassword")}
            style={{
              ...Fonts.grayColor18SemiBold,
              color: "blue",
              fontWeight: "700",
            }}
          >
            Click Here
          </Text>
        </Text>
      </View>
    );
  }

};

export default SigninScreen;

const styles = StyleSheet.create({
  exitInfoWrapStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },

  topImageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    padding: Sizes.fixPadding * 2.0,
  },
  mobileNumberWrapStyle: {
    paddingVertical: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    backgroundColor: Colors.bodyBackColor,
    borderRadius: Sizes.fixPadding - 5.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    ...commonStyles.shadow,
  },
  textFieldWrapper: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    // backgroundColor:"cyan",
    paddingVertical: 5,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    marginBottom: Sizes.fixPadding * 2.0,

  },
  sectionLabel: {

    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: 10,
  },
  optional: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#888",
  },
  container: { marginBottom: 10 },
  textField: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    ...commonStyles.shadow,
    padding: 12,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: Colors.bodyBackColor,
  },
});