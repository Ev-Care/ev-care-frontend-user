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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { sendQuery } from "../service/api";
import { sendQueryAction } from "../service/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";

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

  const handleContentSizeChange = (event) => {
    const newHeight = event.nativeEvent.contentSize.height;
    const minHeight = 160;
    const maxHeight = 300;
    setInputHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
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
        </ScrollView>
      </View>
    </View>
  );

  async function sendQueryActionHandler() {
    console.log("in query");
    setIsLoading(true);
    const data = {
      title: title,
      description: description,
      email: email,
      contactNumber: mobileNumber,
      image: "",
    };
    const sendQueryResponse = await dispatch(
      sendQueryAction({
        title: title,
        description: description,
        email: email,
        contactNumber: mobileNumber,
        image: "",
      })
    );
    console.log("data - ", data);
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

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        dispatch(
          showSnackbar({ message: "Invalid email format", type: "error" })
        );
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(mobileNumber)) {
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
          { ...styles.submitButtonStyle },
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
              }, 600);
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
            selectionColor={Colors.primaryColor}
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
              }, 500);
            }}
            style={{ ...Fonts.blackColor16Medium }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
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
              setEmail(text.trim());

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
              }, 500);
            }}
            style={{ ...Fonts.blackColor16Medium }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
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
              }, 500);
              setTitleTimer(timer);
            }}
            style={{ ...Fonts.blackColor16Medium }}
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
        <Text style={{ ...Fonts.grayColor16Regular }}>
          Fill the form below and our support team will be in touch with you
          shortly. In case of urgency, you can{" "}
          <Text style={{ ...Fonts.grayColor16SemiBold }}>
            Contact Us on +91233456778
          </Text>
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
