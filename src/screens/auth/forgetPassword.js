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
import { Overlay } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { selectloader } from "./services/selector";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { forgetPassword } from "./services/crudFunction";
const ForgetPassword = ({ navigation }) => {
  // 
  const [backClickCount, setBackClickCount] = useState(0);
  const [emailOrNumber, setEmailOrNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleSubmit = async () => {
    console.log("submitt button clicked");
    setIsLoading(true);
    try {
      const response = await dispatch(forgetPassword({ identifier: emailOrNumber }));
      console.log('response = ', response?.payload);
      if (response?.payload?.code == 200) {
        Alert.alert("Success", response?.payload?.message);
        // dispatch(showSnackbar({message: response?.payload?.message, type: 'success'}));
      } else {
        dispatch(showSnackbar({ message: response?.payload, type: 'error' }));
      }

    } catch (error) {
      dispatch(showSnackbar({ message: 'Something went wrong. Please try again', type: 'error' }));
    } finally {
      setIsLoading(false);
    }
  }

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

          {submitButton()}
          {SignInText()}
        </ScrollView>
      </View>

    </View>
  );

  function emailOrNumberInfo() {
    return (<>
      <Text style={styles.sectionLabel}>
        Email or Mob Number <Text style={styles.label}>*</Text>
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
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
      </View>
    </>
    );
  }


  function submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit}
        style={{ ...commonStyles.button, borderRadius: Sizes.fixPadding - 5.0, }}
      >
        {isLoading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ ...Fonts.whiteColor18Medium }}>Please Wait...</Text>
          </View>
        ) : (
          <Text style={{ ...Fonts.whiteColor18Medium }}>Submit</Text>
        )}
      </TouchableOpacity>
    );
  }


  function topImage() {
    return (
      <ImageBackground
        source={require("../../../assets/images/authbg.png")}
        style={{ width: screenWidth, height: screenWidth - 150 }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 8,
            zIndex: 10,
            elevation: 4,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>

        {/* Overlay Text */}
        <View style={styles.topImageOverlay}>
          <Text style={{ ...Fonts.whiteColor22SemiBold }}>Forget Password</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Regular,
              marginTop: Sizes.fixPadding,
            }}
          >
            Recover Your Password Easily
          </Text>
        </View>
      </ImageBackground>
    );

  }


  function SignInText() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        <Text style={{ textAlign: "center", ...Fonts.grayColor18Medium }}>
          Do You Want to SignIn ? {" "}
          <Text
            onPress={() => navigation.goBack()}
            style={{ textAlign: "center", ...Fonts.grayColor18SemiBold, color: "blue", fontWeight: "700" }}>
            Click Here
          </Text>
        </Text>
      </View>
    );
  }


};

export default ForgetPassword;

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