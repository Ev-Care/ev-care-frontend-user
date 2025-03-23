import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
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

const RegisterScreen = ({ navigation }) => {
  const [fullName, setfullName] = useState("");
  const [userName, setuserName] = useState("");
  const [email, setemail] = useState("");
  const [role, setRole] = useState("User");
  
 

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {topImage()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >  {selectRole()}
          {fullNameInfo()}
          {userNameInfo()}
          {emailInfo()}
          {continueButton()}
          {agreeInfo()}
        </ScrollView>
      </View>
    </View>
  );
   function selectRole() {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around", margin: Sizes.fixPadding * 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="User"
            status={role === "User" ? "checked" : "unchecked"}
            onPress={() => setRole("User")}
          />
          <Text>User</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="Vendor"
            status={role === "Vendor" ? "checked" : "unchecked"}
            onPress={() => setRole("Vendor")}
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
          By continue you’re agreed to our
        </Text>
        <Text
          style={{
            textAlign: "center",
            ...Fonts.grayColor18SemiBold,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Terms & condition
        </Text>
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
          onChangeText={(text) => setemail(text)}
          style={{ ...Fonts.blackColor16Medium }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
      </View>
    );
  }

  function userNameInfo() {
    return (
      <View
        style={{
          ...styles.textFieldWrapper,
          marginVertical: Sizes.fixPadding * 2.0,
        }}
      >
        <TextInput
          placeholder="Username"
          placeholderTextColor={Colors.grayColor}
          value={userName}
          onChangeText={(text) => setuserName(text)}
          style={{ ...Fonts.blackColor16Medium }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
      </View>
    );
  }

  function fullNameInfo() {
    return (
      <View
        style={{
          ...styles.textFieldWrapper,
         
        }}
      >
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
        onPress={() => {
          navigation.push("Verification");
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
    borderRadius: Sizes.fixPadding-5.0,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    paddingVertical:
      Platform.OS == "ios" ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderColor:Colors.extraLightGrayColor,
    borderWidth:1.0,
  },
});
