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
import {  useDispatch } from "react-redux";
import { loginUser } from "../../redux/store/userSlice";
const VerificationScreen = ({ navigation ,route }) => {
  const [otpInput, setotpInput] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const verifyOtp= async () => {
    // console.log("clicked");
    // if (otpInput==="123456"){
      // console.log("verified");

      // dispatch(loginUser(route.params?.phoneNumber));
       // api call - "https://ev-care-api.vercel.app/auth/verifyOtp"  with post method
     // setUserType(route.params?.role);
      // console.log("this is userRole"+route.params?.role+"this is number"+route.params?.phoneNumber); 
      setisLoading(true);
      try {
        const response = await fetch("https://ev-care-api.vercel.app/auth/verifyOtp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otpInput, mobileNumber: route.params?.phoneNumber }),
        });
    
        if (response.status === 200 || response.status === 201) {
          const data = await response.json();
          const user = {
            user_key : data.data.user.user_key,
            id: data.data.user.id,
            name: data.data.user.owner_legal_name,
            contactNo: data.data.user.mobile_number,
            role: data.data.user.role,
            status: data.data.user.status,
          };

          if(user.status === "new"){
            navigation.push("Register", {user : user});
          } else if(user.status === "completed"){
            // navigation.push("BottomTabBar");
            dispatch(loginUser(user));
          }
          // navigation.push("BottomTabBar");

        } else {
          // Handle verification failure
          console.log("Verification failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
      } finally {
        setisLoading(false);
      }

    // }
  }
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
          // if (text.length == 6) {
          //   setisLoading(true);
          //   setTimeout(() => {
          //     setisLoading(false);
          //     navigation.push("BottomTabBar");
          //   }, 2000);
          // }
        }
      }
        inputCount={6}
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
        onPress={verifyOtp}
        style={{ ...commonStyles.button,borderRadius: Sizes.fixPadding-5.0, margin: Sizes.fixPadding * 2.0 }}
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
    width: screenWidth / 8, // Adjusted width for 6-digit OTP
    height: 50, // Ensures proper height for input
    textAlign: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.bodyBackColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    ...Fonts.blackColor18SemiBold,
    ...commonStyles.shadow,
    marginHorizontal: Sizes.fixPadding / 2, // Reduced margin for better spacing
  }
  ,
  dialogStyle: {
    width: "80%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding * 2.0,
  },
});
