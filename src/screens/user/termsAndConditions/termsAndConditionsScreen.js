import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.";

  const termsAndConditionsList = [
    "Users must register with accurate personal and vehicle information.",
    "Charging stations are subject to availability and real-time status may vary.",
    "Users are responsible for ensuring their EVs are compatible with selected stations.",
    "EV Care is not liable for any damage caused due to improper charging practices.",
    "All payments made through the app are final and non-refundable unless stated otherwise.",
    "By using this service, users consent to location tracking for station discovery.",
    "Any misuse of the platform, including fraudulent bookings, may result in account suspension.",
    "Users must follow safety instructions displayed at each station while charging.",
    "We may collect and use user data to improve service quality and for technical support.",
    "EV Care reserves the right to modify or terminate services without prior notice.",
    "Continued use of the platform indicates acceptance of these terms and any future updates.",
  ];
  

const TermsAndConditionsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {termsAndConditionInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function termsAndConditionInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        {termsAndConditionsList.map((item, index) => (
          <Text
            key={`${index}`}
            style={{
              ...Fonts.blackColor16Regular,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {item}
          </Text>
        ))}
      </View>
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
          Terms & Condition
        </Text>
      </View>
    );
  }
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({});
