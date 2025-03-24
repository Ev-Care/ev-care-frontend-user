import {
  BackHandler,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { useFocusEffect } from "@react-navigation/native";
import IntlPhoneInput from "react-native-intl-phone-input";
import { Overlay } from "@rneui/themed";

const SigninScreen = ({ navigation }) => {
  const [backClickCount, setBackClickCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSignIn = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    try {
      const sanitizedPhoneNumber = phoneNumber.replace(/\s+/g, "");
      const response = await fetch("https://ev-care-api.vercel.app/auth/signInMobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: sanitizedPhoneNumber }),
      });

     console.log(response);

      if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        console.log(data);
        Alert.alert("Success", data.message);
        navigation.navigate("Verification", { phoneNumber: sanitizedPhoneNumber });
      } else {
        Alert.alert("Server Error", "Please try again later.");
        // navigation.navigate("Register");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally{
      setIsLoading(false);
      
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {topImage()}
        <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
          {mobileNumberInfo()}
          {continueButton()}
        </ScrollView>
      </View>
      {exitInfo()}
      {loadingDialog()}
    </View>
  );

  function loadingDialog() {
    return (
      <Overlay isVisible={isLoading} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator size={50} color={Colors.primaryColor} style={{ alignSelf: "center" }} />
        <Text style={{ marginTop: Sizes.fixPadding, textAlign: "center", ...Fonts.blackColor16Regular }}>
          Please wait...
        </Text>
      </Overlay>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSignIn}
        style={{ ...commonStyles.button, borderRadius: Sizes.fixPadding - 5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Continue</Text>
      </TouchableOpacity>
    );
  }

  function mobileNumberInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding * 5.0 }}>
        <IntlPhoneInput
          onChangeText={({ phoneNumber }) => setPhoneNumber(phoneNumber.replace(/\s+/g, ""))}
          defaultCountry="IN"
          containerStyle={styles.mobileNumberWrapStyle}
          placeholder="Enter your phone number"
          placeholderTextColor={Colors.grayColor}
          phoneInputStyle={{ flex: 1, ...Fonts.blackColor16Medium }}
          dialCodeTextStyle={{ ...Fonts.blackColor16Medium, marginHorizontal: Sizes.fixPadding - 2.0 }}
          modalCountryItemCountryNameStyle={{ ...Fonts.blackColor16SemiBold }}
        />
      </View>
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
});