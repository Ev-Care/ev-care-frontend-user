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
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/store/userSlice";
const SigninScreen = ({ navigation }) => {
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

  const [backClickCount, setBackClickCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
 
  const users = useSelector((state) => state.users.users);

  const handleSignIn = () => {
    try {
      if (!phoneNumber) {
        Alert.alert("Error", "Please enter a phone number");
        return;
      }

      const sanitizedPhoneNumber = phoneNumber.replace(/\s+/g, ""); // Remove spaces
      // console.log("Sanitized Phone Number:", sanitizedPhoneNumber);

      const user = users.find((user) => user.contactNo === sanitizedPhoneNumber);
      if (user) {
        console.log("User exists: " + user.contactNo);
        navigation.navigate("Verification", { phoneNumber: user.contactNo, role: user.role });
      } else {
        Alert.alert("User not found: " + sanitizedPhoneNumber);
        navigation.navigate("Register");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
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
        >
          {mobileNumberInfo()}
          {continueButton()}
        </ScrollView>
      </View>
      {exitInfo()}
    </View>
  );

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSignIn}
        style={{ ...commonStyles.button,borderRadius: Sizes.fixPadding-5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Continue</Text>
      </TouchableOpacity>
    );
  }

  function mobileNumberInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 5.0,
        }}
      >
        <IntlPhoneInput
         onChangeText={({ phoneNumber }) => setPhoneNumber(phoneNumber.replace(/\s+/g, ""))}
         defaultCountry="IN"
          containerStyle={styles.mobileNumberWrapStyle}
          placeholder={"Enter your phone number"}
          placeholderTextColor={Colors.grayColor}
          phoneInputStyle={{ flex: 1, ...Fonts.blackColor16Medium }}
          dialCodeTextStyle={{
            ...Fonts.blackColor16Medium,
            marginHorizontal: Sizes.fixPadding - 2.0,
          }}
          modalCountryItemCountryNameStyle={{ ...Fonts.blackColor16SemiBold }}
        />
      </View>
    );
  }

  function topImage() {
    return (
      <ImageBackground
        source={require("../../assets/images/authbg.png")}
        style={{ width: screenWidth, height: screenWidth - 150 }}
        resizeMode="stretch"
      >
        <View style={styles.topImageOverlay}>
          <Text style={{ ...Fonts.whiteColor22SemiBold }}>Sign in</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Regular,
              marginTop: Sizes.fixPadding,
            }}
          >
            Sign in to your account
          </Text>
        </View>
      </ImageBackground>
    );
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
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
    borderRadius: Sizes.fixPadding-5.0,
    marginTop: Sizes.fixPadding,
    ...commonStyles.shadow,
    borderColor:Colors.extraLightGrayColor,
    borderWidth:1.0,
  },
});
