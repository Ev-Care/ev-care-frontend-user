import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
} from "react-native";
import React, { useCallback } from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

const BookingSuccessScreen = ({ navigation }) => {
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      navigation.push("BottomTabBar");
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {thankYouText()}
          {bookingInfo()}
          {continueButton()}
        </ScrollView>
      </View>
    </View>
  );

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("BottomTabBar");
        }}
        style={{
          ...commonStyles.button,
          ...styles.continueButtonStyle,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Continue to Home</Text>
      </TouchableOpacity>
    );
  }

  function bookingInfo() {
    return (
      <View style={styles.bookingInfoWrapStyle}>
        <View style={styles.doneIconWrapStyle}>
          <MaterialIcons name="done" color={Colors.whiteColor} size={45} />
        </View>

        <Text style={styles.transactionSuccessTextStyle}>
          Your transaction was successful..!
        </Text>

        <View>
          <Text style={{ ...Fonts.grayColor16Medium }}>Vehicle</Text>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              marginTop: Sizes.fixPadding - 8.0,
            }}
          >
            BMW i7 - 4 Wheeler - CCS2 Type
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: Sizes.fixPadding * 2.0,
          }}
        >
          <View style={{ flex: 1 }}>
            <View>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor16Medium }}>
                Date
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor18Medium,
                  marginTop: Sizes.fixPadding - 8.0,
                }}
              >
                25 Sept 2023
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor16Medium }}>
                Booking ID
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor18Medium,
                  marginTop: Sizes.fixPadding - 8.0,
                }}
              >
                CHP12658789OP
              </Text>
            </View>
          </View>

          <View style={{ maxWidth: 150.0 }}>
            <View>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor16Medium }}>
                Time
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor18Medium,
                  marginTop: Sizes.fixPadding - 8.0,
                }}
              >
                11:50 PM
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor16Medium }}>
                Amount paid
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor18Medium,
                  marginTop: Sizes.fixPadding - 8.0,
                }}
              >
                150$
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={{ ...Fonts.grayColor16Medium }}>Payment method</Text>
          <View style={{ ...commonStyles.rowAlignCenter }}>
            <Image
              source={require("../../assets/images/icons/visa.png")}
              style={{ width: 40.0, height: 15.0, resizeMode: "contain" }}
            />
            <Text
              style={{
                ...Fonts.blackColor18Medium,
                marginTop: Sizes.fixPadding - 8.0,
                marginLeft: Sizes.fixPadding - 5.0,
              }}
            >
              Credit card **59
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function thankYouText() {
    return (
      <Text style={styles.thankYouTextStyle}>Thank you for your booking</Text>
    );
  }
};

export default BookingSuccessScreen;

const styles = StyleSheet.create({
  thankYouTextStyle: {
    ...Fonts.blackColor26SemiBold,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 6.0,
    textAlign: "center",
  },
  transactionSuccessTextStyle: {
    ...Fonts.grayColor18Medium,
    textAlign: "center",
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 3.0,
  },
  doneIconWrapStyle: {
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -Sizes.fixPadding * 3.0,
    alignSelf: "center",
  },
  bookingInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 5.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  continueButtonStyle: {
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 2.5,
    padding: Sizes.fixPadding + 1.0,
    marginHorizontal: Sizes.fixPadding * 4.0,
  },
});
