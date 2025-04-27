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
import React, { useState } from "react";
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
import { selectUser, selectToken, selectAuthloader } from "./services/selector";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";

const VerificationScreen = ({ navigation, route }) => {
  const [otpInput, setOtpInput] = useState("");
  const isLoading = useSelector(selectAuthloader);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const verifyOtp = async () => {
    if (otpInput.length !== 6) {
      await dispatch(showSnackbar({ message: "Invalid OTP, Please enter a 6-digit OTP.", type: "error" }));

      // Alert.alert("Invalid OTP", "Please enter a 6-digit OTP.");
      return;
    }

    try {
      // Dispatch the action to verify OTP
      await dispatch(postVerifyOtp({ otp: otpInput, mobileNumber: route.params?.phoneNumber }));

      // Access the updated state values
      if (user) {
        console.log("User status in VerificationScreen:", user.status);

        if (user.status === "New") {
          console.log("User is new. Navigating to Register screen.");
          navigation.push("Register", { userKey: user.user_key });
        } else {
          try {
            // Save user data and token to AsyncStorage
             AsyncStorage.setItem("user", user.user_key);
             AsyncStorage.setItem("accessToken", token);

            // Show success snackbar
            dispatch(showSnackbar({ message: "OTP verified successfully", type: "success" }));
            return;
          } catch (error) {
            dispatch(showSnackbar({ message: "User data not saved in device", type: "error" }));
          }
        }
      } else {
        dispatch(showSnackbar({ message: "Incorrect OTP entered. Please try again.", type: "error" }));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      dispatch(showSnackbar({ message: "An error occurred while verifying OTP. Please try again.", type: "error" }));
    }
  };
  

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
      {loadingDialog()}
    </View>
  );

  function resendText() {
    return (
      <Text
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

  function loadingDialog() {
    return (
      <Overlay isVisible={isLoading} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator size={50} color={Colors.primaryColor} />
        <Text style={{ marginTop: Sizes.fixPadding, textAlign: "center", ...Fonts.blackColor16Regular }}>
          Please wait...
        </Text>
      </Overlay>
    );
  }

  function otpFields() {
    return (
      <OTPTextView
        containerStyle={{ margin: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding * 5.0 }}
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
        style={{ ...commonStyles.button, borderRadius: Sizes.fixPadding - 5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Continue</Text>
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
          <MaterialIcons name="arrow-back" color={Colors.whiteColor} size={26} onPress={() => navigation.pop()} />
          <View>
            <Text style={{ ...Fonts.whiteColor22SemiBold }}>OTP Verification</Text>
            <Text numberOfLines={1} style={{ ...Fonts.whiteColor16Regular, marginTop: Sizes.fixPadding }}>
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
