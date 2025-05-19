import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import {
  default as Icon,
  default as MaterialIcons,
} from "react-native-vector-icons/MaterialIcons";

import { sendQuery } from "../service/api";
import { sendQueryAction } from "../service/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import { Overlay } from "@rneui/themed";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../constants/regex";

const HelpScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleTimer, setTitleTimer] = useState(null);
  const emailTimer = useRef(null);
  const mobileTimer = useRef(null);
  const descriptionTimer = useRef(null);
  const [inputHeight, setInputHeight] = useState(160);
  const [showEmergencyDialog, setshowEmergencyDialog] = useState(false);
  const [emergencyQuery, setEmergencyQuery] = useState("");
  const [charCount, setCharCount] = useState(120);
  const time = 2000;
  const handleEmergencyQueryChange = (text) => {
    if (text.length <= 100) {
      setEmergencyQuery(text);
      setCharCount(100 - text.length);
    }
  };


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
          {titleInfo()}
          {emailInfo()}
          {mobileNumberInfo()}
          {descriptionInfo()}
          {submitButton()}
          {emergencyDialog()}
          {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
        </ScrollView>
      </View>
    </View>
  );

  async function sendQueryActionHandler() {
    // console.log("in query");
    setIsLoading(true);
    const data = {
      title: title,
      description: description,
      email: email,
      contactNumber: mobileNumber,
      
    };

   
    const sendQueryResponse = await dispatch(
      sendQueryAction({
        title: title,
        description: description,
        email: email,
        contactNumber: mobileNumber,
        image: null,
      })
    );
    // console.log("data - ", data);
    if (sendQueryAction.fulfilled.match(sendQueryResponse)) {
      setIsLoading(false);
      dispatch(
        showSnackbar({
          message:
            "Support ticket is created regarding your query. You will got response within 24 hours.",
          type: "success",
        })
      );
      navigation.pop();
      setEmail("");
      setTitle("");
      setMobileNumber("");
      setDescription("");
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
    const handleSubmit = () => {
      if (!title || title.trim().length < 3) {
        dispatch(
          showSnackbar({
            message: "Title must be at least 3 characters",
            type: "error",
          })
        );
        return;
      }

      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!EMAIL_REGEX.test(email)) {
        dispatch(
          showSnackbar({ message: "Invalid email format", type: "error" })
        );
        return;
      }

      // const phoneRegex = /^[0-9]{10}$/;
      if (!PHONE_REGEX.test(mobileNumber)) {
        dispatch(
          showSnackbar({
            message: "Mobile number must be exactly 10 digits",
            type: "error",
          })
        );
        return;
      }

      if (!description || description.trim().length < 10) {
        dispatch(
          showSnackbar({
            message: "Description must be at least 10 characters",
            type: "error",
          })
        );
        return;
      }

      sendQueryActionHandler();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit}
        disabled={isLoading}
        style={[
          styles.submitButtonStyle,
          { paddingVertical: 12, marginBottom: 50 },
        ]}
      >
          <Text style={{ ...Fonts.whiteColor18Medium }}>Submit</Text>
      
      </TouchableOpacity>
    );
  }

  function descriptionInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Message</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Write your description here.."
            value={description}
            maxLength={256}
            onChangeText={(text) => {
              setDescription(text);

              if (descriptionTimer.current)
                clearTimeout(descriptionTimer.current);

              descriptionTimer.current = setTimeout(() => {
                if (!text.trim()) {
                  dispatch(
                    showSnackbar({
                      message: "Description cannot be empty",
                      type: "error",
                    })
                  );
                } else if (text.trim().length < 10) {
                  dispatch(
                    showSnackbar({
                      message: "Description must be at least 10 characters",
                      type: "error",
                    })
                  );
                }
              }, time);
            }}
            style={[
              {
                ...Fonts.blackColor16Medium,
                paddingTop: Sizes.fixPadding,
                paddingHorizontal: Sizes.fixPadding,
                minHeight: 160,
                textAlignVertical: "top",
                height: inputHeight,
              },
            ]}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
         
            multiline
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
            onChangeText={(text) => {
              const cleanedText = text.replace(/[^0-9]/g, ""); // Only numbers
              setMobileNumber(cleanedText);

              // Clear previous timer
              if (mobileTimer.current) clearTimeout(mobileTimer.current);

              // Delay validation
              mobileTimer.current = setTimeout(() => {
                if (!cleanedText) {
                  dispatch(
                    showSnackbar({
                      message: "Mobile number is required",
                      type: "error",
                    })
                  );
                } else if (cleanedText.length !== 10) {
                  dispatch(
                    showSnackbar({
                      message: "Mobile number must be exactly 10 digits",
                      type: "error",
                    })
                  );
                }
              }, time);
            }}
            style={[styles.input, { ...Fonts.blackColor16Medium }]}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
           
            keyboardType="phone-pad"
            maxLength={10}
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
            onChangeText={(text) => {
              setEmail(text.trim().toLowerCase());

              // Clear previous validation timer
              if (emailTimer.current) {
                clearTimeout(emailTimer.current);
              }

              // Delay validation by 500ms
              emailTimer.current = setTimeout(() => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!text.trim()) {
                  dispatch(
                    showSnackbar({
                      message: "Email is required",
                      type: "error",
                    })
                  );
                } else if (!emailRegex.test(text.trim())) {
                  dispatch(
                    showSnackbar({
                      message: "Invalid email format",
                      type: "error",
                    })
                  );
                }
              }, time);
            }}
            style={[styles.input, { ...Fonts.blackColor16Medium }]}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
          
            keyboardType="email-address"
          />
        </View>
      </View>
    );
  }

  function titleInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Title</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter Title here"
            value={title}
            onChangeText={(text) => {
              const trimmedText = text.trimStart(); // Allow typing but trim only leading spaces

              // Live feedback validations
              if (trimmedText.length > 100) {
                dispatch(
                  showSnackbar({
                    message: "Title cannot exceed 100 characters",
                    type: "error",
                  })
                );
                return;
              }

              // Optional: restrict invalid characters
              const validText = trimmedText.replace(
                /[^a-zA-Z0-9 .,'!?\-]/g,
                ""
              );

              setTitle(validText);

              // Optional: delayed validation after user stops typing
              clearTimeout(titleTimer);
              const timer = setTimeout(() => {
                if (validText.length < 3) {
                  dispatch(
                    showSnackbar({
                      message: "Title must be at least 3 characters",
                      type: "error",
                    })
                  );
                }
              }, time);
              setTitleTimer(timer);
            }}
            style={[styles.input, { ...Fonts.blackColor16Medium }]}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
           
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
        <Text style={{ ...Fonts.grayColor16Regular }}>
          Fill the form below and our support team will be in touch with you
          shortly. {/*Or In case of Emergency,{" "}
          <Text
            onPress={() => setshowEmergencyDialog(true)}
            style={{
              ...Fonts.grayColor16SemiBold,
              color: "blue",
              textDecorationLine: "underline",
            }}
          >
            Click Here
          </Text>
          */}
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
     <View style={styles.appBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
   <Text style={styles.title}>Help & Support</Text>
   <View style={{ width: 20 }} />
   </View>
    
    );
  }
  function emergencyDialog() {
    return (
      <Overlay
        isVisible={showEmergencyDialog}
        onBackdropPress={() => setshowEmergencyDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View style={{ paddingTop: 10 }}>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              textAlign: "center",
              color: Colors.primaryColor,
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            Write Query In Short
          </Text>
          <Text
            style={{
              color: charCount > 30 ? "green" : "red",
              fontSize: 10,
              textAlign: "center",
              fontFamily: "YourFontFamily-Regular",
            }}
          >
            {charCount} characters left
          </Text>{" "}
          <View
            style={{
              padding: 5,
              margin: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 4,
            }}
          >
            <TextInput
              placeholder="Describle Your Query Here.."
              value={emergencyQuery}
              onChangeText={handleEmergencyQueryChange}
              style={[
                {
                  ...Fonts.blackColor16Medium,
                  paddingTop: Sizes.fixPadding,
                  paddingHorizontal: Sizes.fixPadding,
                  minHeight: 100,
                  textAlignVertical: "top",
                  height: 100,
                },
              ]}
              placeholderTextColor={Colors.grayColor}
              cursorColor={Colors.primaryColor}
             
              multiline
            />
          </View>
          <View
            style={{
              ...commonStyles.rowAlignCenter,
              marginTop: Sizes.fixPadding,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowEmergencyDialog(false);
                setEmergencyQuery("")
              }}
              style={{
                ...styles.noButtonStyle,
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.blackColor16Medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowEmergencyDialog(false);
              }}
              style={{
                ...styles.yesButtonStyle,
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    );
  }
};

export default HelpScreen;

const styles = StyleSheet.create({
  helpImageStyle: {
    width: "100%",
    height: screenWidth /1.5,
    resizeMode: "contain",
    marginVertical: Sizes.fixPadding,
    // backgroundColor:"teal"
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
     zIndex: 999,
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: 10,
    padding: 4,

    marginTop: Sizes.fixPadding,
  },
  input: {
    padding: 12,
    fontSize: 12,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bodyBackColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0eb",
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
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: "85%",
    padding: 0.0,
    elevation: 0,
  },
  overlayImageStyle: {
    marginTop: Sizes.fixPadding * 1.5,
    width: 70.0,
    height: 60.0,
    resizeMode: "contain",
    alignSelf: "center",
  },
  dialogYesNoButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
    padding: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  noButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  yesButtonStyle: {
    borderTopColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
});
