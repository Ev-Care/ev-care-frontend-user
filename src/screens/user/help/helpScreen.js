import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { sendQuery } from "../service/api";
import { sendQueryAction } from "../service/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";

const HelpScreen = ({ navigation }) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [message, setmessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {helpImage()}
          {talkingInfo()}
          {nameInfo()}
          {emailInfo()}
          {mobileNumberInfo()}
          {messageInfo()}
          {submitButton()}
        </ScrollView>
      </View>
    </View>
  );

  async function sendQueryActionHandler() {
    setIsLoading(true);
    const sendQueryResponse = await dispatch(
      sendQueryAction({
        title: name,
        description: message,
        email: email,
        contactNumber: mobileNumber,
        image: "",
      })
    );
    if (sendQueryAction.fulfilled.match(sendQueryResponse)) {
      setIsLoading(false);
      dispatch(
        showSnackbar({
          message:
            "Support ticket is created regarding your query. You will got response withen 24 hours.",
          type: "success",
        })
      );
      navigation.pop();
      setemail("");
      setname("");
      setmobileNumber("");
      setmessage("");
    } else if (getAllFavoriteStations.rejected.match(favResponse)) {
      setIsLoading(false);
      dispatch(
        showSnackbar({
          message: errorMessage || "Failed to fetch favorite stations.",
          type: "error",
        })
      );
    }
  }

  function submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          sendQueryActionHandler();
        }}
        disabled={isLoading}
        style={[
          { ...styles.submitButtonStyle },
          { paddingVertical: 12, marginBottom: 50 },
        ]}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Submit</Text>
      </TouchableOpacity>
    );
  }

  function messageInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Message</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Write your message here.."
            value={message}
            onChangeText={(text) => setmessage(text)}
            style={[
              {
                ...Fonts.blackColor16Medium,
                paddingTop: Sizes.fixPadding,
                paddingHorizontal: Sizes.fixPadding,
                minHeight: 160, // Increased height for larger box
                textAlignVertical: "top",
              },
            ]}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            multiline
            numberOfLines={10}
          />
        </View>
      </View>
    );
  }

  function mobileNumberInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Mobile number</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your mobile number here"
            value={mobileNumber}
            onChangeText={(text) => setmobileNumber(text)}
            style={{
              ...Fonts.blackColor16Medium,
              height: 35, 
              paddingVertical: 0,
            }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            keyboardType="phone-pad"
          />
        </View>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Email address</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your email here"
            value={email}
            onChangeText={(text) => setemail(text)}
            style={{
              ...Fonts.blackColor16Medium,
              height: 35, 
              paddingVertical: 0,
            }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            keyboardType="email-address"
          />
        </View>
      </View>
    );
  }

  function nameInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Title</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            style={{
              ...Fonts.blackColor16Medium,
              height: 35, 
              paddingVertical: 0,
            }}
            placeholder="Enter Title here"
            value={name}
            onChangeText={(text) => setname(text)}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
    );
  }

  function talkingInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.blackColor18SemiBold }}>
          Talk to our support team
        </Text>
        <Text
          style={{
            ...Fonts.grayColor16Regular,
          }}
        >
          Fill below form and our support team will be in touch with you
          shortly.
        </Text>
      </View>
    );
  }

  function helpImage() {
    return (
      <Image
        source={require("../../../../assets/images/help.png")}
        style={styles.helpImageStyle}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Help
        </Text>
      </View>
    );
  }
};

export default HelpScreen;

const styles = StyleSheet.create({
  helpImageStyle: {
    width: "100%",
    height: screenWidth / 2,
    resizeMode: "contain",
    marginVertical: Sizes.fixPadding,
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    paddingVertical:
      Platform.OS == "ios" ? Sizes.fixPadding - 2.0 : Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding,
  },
  submitButtonStyle: {
    padding: Sizes.fixPadding,
    borderRadius: 10,
    marginHorizontal: 18,
    marginVertical: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
});
