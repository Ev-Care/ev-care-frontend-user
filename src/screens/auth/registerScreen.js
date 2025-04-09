import {
  ActivityIndicator,
  Alert,
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
import { signUpUser } from "../../redux/store/userSlice";
import { useDispatch } from "react-redux";
import { postSignUp } from "./services/crudFunction";
const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false); // Loader state
  const dispatch = useDispatch();
  
  const user = route.params?.user;

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    setLoading(true);
    console.log("post signup called");

    const userData = {
        email: email,
        owner_legal_name: fullName,
        role: role,
        user_key: user.user_key
    };


    try {
        const response = await dispatch(postSignUp(userData)).unwrap(); // ✅ Ensure API response is returned
        console.log("post signup success", response);
        Alert.alert("Success", "Registration successful!");
        userData.status = "Completed";
        dispatch(signUpUser(userData)); // ✅ Use actual API response data
    } catch (error) {
        console.error("Signup failed:", error);
        Alert.alert("Registration Failed", "Please check your details and try again.");
    } finally {
        setLoading(false);
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
          By continuing, you agree to our
        </Text>
        <Text
          style={{
            textAlign: "center",
            ...Fonts.grayColor18SemiBold,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Terms & Conditions
        </Text>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View style={{ ...styles.textFieldWrapper, marginBottom: Sizes.fixPadding * 2.0 }}>
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
        style={{ ...commonStyles.button, borderRadius: Sizes.fixPadding - 5.0, margin: Sizes.fixPadding * 2.0 }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ ...Fonts.whiteColor18SemiBold }}>Continue</Text>
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
            <Text style={{ ...Fonts.whiteColor22SemiBold }}>Register</Text>
            <Text style={{ ...Fonts.whiteColor16Regular, marginTop: Sizes.fixPadding }}>
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
    paddingVertical: Platform.OS === "ios" ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    marginBottom: Sizes.fixPadding * 2.0,
    marginLeft: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
  },
});
