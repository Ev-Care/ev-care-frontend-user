import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
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

const VerificationScreen = ({ navigation }) => {
  const [otpInput, setotpInput] = useState("");
  const [isLoading, setisLoading] = useState(false);

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
        <ActivityIndicator
          size={50}
          color={Colors.primaryColor}
          style={{
            alignSelf: "center",
            transform: [{ scale: Platform.OS == "ios" ? 2 : 1 }],
          }}
        />
        <Text
          style={{
            marginTop: Sizes.fixPadding,
            textAlign: "center",
            ...Fonts.blackColor16Regular,
          }}
        >
          Please wait...
        </Text>
      </Overlay>
    );
  }

  function otpFields() {
    return (
      <OTPTextView
        containerStyle={{
          margin: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 5.0,
          justifyContent: "center",
        }}
        handleTextChange={(text) => {
          setotpInput(text);
          if (text.length == 4) {
            setisLoading(true);
            setTimeout(() => {
              setisLoading(false);
              navigation.push("BottomTabBar");
            }, 2000);
          }
        }}
        inputCount={4}
        keyboardType="numeric"
        tintColor={Colors.primaryColor}
        offTintColor={Colors.extraLightGrayColor}
        textInputStyle={{ ...styles.textFieldStyle }}
      />
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
            setisLoading(true);
            setTimeout(() => {
              setisLoading(false);
              navigation.push("BottomTabBar");
            }, 2000);
        }}
        style={{ ...commonStyles.button,borderRadius: Sizes.fixPadding-5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Continue</Text>
      </TouchableOpacity>
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
          <MaterialIcons
            name="arrow-back"
            color={Colors.whiteColor}
            size={26}
            onPress={() => {
              navigation.pop();
            }}
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
              See your phone to see the verification code
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
    borderBottomWidth: null,
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.bodyBackColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    ...Fonts.blackColor18SemiBold,
    ...commonStyles.shadow,
    marginHorizontal: Sizes.fixPadding,
  },
  dialogStyle: {
    width: "80%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding * 2.0,
  },
});
