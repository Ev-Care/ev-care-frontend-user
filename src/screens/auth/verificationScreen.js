import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Overlay } from "@rneui/themed";
import OTPTextView from "react-native-otp-textinput";
import { useDispatch, useSelector } from "react-redux";
import { postVerifyOtp } from "./services/crudFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  selectUser,
  selectToken,
  selectAuthloader,
  selectAuthError,
} from "./services/selector";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import { setAuthLoaderFalse } from "../../redux/store/userSlice";
import Timer from "../../components/Timer";

const VerificationScreen = ({ navigation, route }) => {
  const [otpInput, setOtpInput] = useState("");
  const isLoading = useSelector(selectAuthloader);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const error = useSelector(selectAuthError); // Get error from Redux store
  const [userKey, setUserKey] = useState(null);
  const [navigateToRegister, setNavigateToRegister] = useState(false);

  const [timerStarted, setTimerStarted] = useState(false);
  const { handleSignIn } = route?.params;

  const handleStartTimer = () => {
    handleSignIn();
    setTimerStarted(true);
  };

  console.log("isLoading in VerificationScreen:", isLoading); // Debugging line

  const verifyOtp = async () => {
    if (otpInput.length !== 6) {
      dispatch(
        showSnackbar({
          message: "Invalid OTP, Please enter a 6-digit OTP.",
          type: "error",
        })
      );
      return;
    }

    // dispatch(setAuthLoaderTrue()); // Optional: You can set loading true manually before API call

    const response = await dispatch(
      postVerifyOtp({ otp: otpInput, mobileNumber: route.params?.phoneNumber })
    );

    if (postVerifyOtp.fulfilled.match(response)) {
      console.log("OTP verified successfully:", response.payload);
      const extractedUserKey = response.payload?.data?.user?.user_key;
      setUserKey(extractedUserKey);
      setNavigateToRegister(true); // set flag for useEffect
    } else if (postVerifyOtp.rejected.match(response)) {
      console.error("OTP verification failed:", response.payload);
      dispatch(
        showSnackbar({
          message: response.payload || "OTP verification failed.",
          type: "error",
        })
      );
    }
  };

  // useEffect to handle user and token updates
  useEffect(() => {
    if (navigateToRegister && token && userKey && !user) {
      console.log("Navigating to register...");
      dispatch(
        showSnackbar({ message: "OTP verified successfully", type: "success" })
      );
      navigation.push("Register", { userKey });
      setNavigateToRegister(false); // reset
      return;
    }

    if (user && token) {
      console.log("Existing user, logging in...");
      try {
        AsyncStorage.setItem("user", user.user_key);
        AsyncStorage.setItem("accessToken", token);
        // dispatch(
        //   showSnackbar({
        //     message: "OTP verified successfully",
        //     type: "success",
        //   })
        // );
      } catch (error) {
        dispatch(
          showSnackbar({
            message: "User data not saved in device",
            type: "error",
          })
        );
      }
      1;
    } else if (error) {
      dispatch(
        showSnackbar({
          message: "Incorrect OTP entered. Please try again.",
          type: "error",
        })
      );
    }
  }, [user, token, error, navigateToRegister, userKey, navigation, dispatch]);

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
          {otpFields()}
          {continueButton()}
          {resendText()}
        </ScrollView>
      </View>
     
    </View>
  );

  function resendText() {
    return timerStarted ? (
      <Timer startTimer={timerStarted} setTimerStarted={setTimerStarted} />
    ) : (
      <Text
        onPress={handleStartTimer}
        style={{
          ...Fonts.grayColor18SemiBold,
          textAlign: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        Resend
      </Text>
    );
  }

  function otpFields() {
    return (
      <OTPTextView
        containerStyle={{
          margin: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 5.0,
        }}
        handleTextChange={setOtpInput}
        inputCount={6}
        keyboardType="numeric"
        tintColor={Colors.primaryColor}
        offTintColor={Colors.extraLightGrayColor}
        textInputStyle={styles.textFieldStyle}
      />
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={verifyOtp}
        style={{
          ...commonStyles.button,
          borderRadius: Sizes.fixPadding - 5.0,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        {isLoading ? (
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
            onPress={() => navigation.pop()}
          />
          <View>
            <Text style={{ ...Fonts.whiteColor22SemiBold }}>
              OTP Verification
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.whiteColor16Regular,
                marginTop: Sizes.fixPadding,
              }}
            >
              See your phone for the verification code
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
};

export default VerificationScreen;

const styles = StyleSheet.create({
  topImageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    width: screenWidth / 8,
    height: 50,
    textAlign: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.bodyBackColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    ...Fonts.blackColor18SemiBold,
    ...commonStyles.shadow,
    marginHorizontal: Sizes.fixPadding / 2,
  },
  dialogStyle: {
    width: "80%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding * 2.0,
  },
});
