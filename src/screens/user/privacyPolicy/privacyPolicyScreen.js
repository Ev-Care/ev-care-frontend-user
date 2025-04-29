import { ScrollView, Text, View } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.";

  const privacyPoliciesList = [
    "We collect personal information such as name, contact details, and vehicle information to deliver our services effectively.",
    "Your location data may be used to provide nearby station suggestions and real-time availability.",
    "All user data is stored securely and is only accessible by authorized personnel for service-related purposes.",
    "We do not share your personal information with third parties except for essential service integrations or as required by law.",
    "Payment information is processed securely through certified third-party gateways; we do not store credit/debit card details.",
    "We use app analytics to improve performance and user experience; data collected is anonymized.",
    "You have the right to access, update, or delete your personal data at any time via account settings or by contacting support.",
    "Push notifications are used only for service alerts, updates, and important announcements.",
    "Cookies and similar technologies may be used to enhance app functionality and remember user preferences.",
    "By using EV Care, you consent to the collection and use of your data as outlined in this policy.",
    "We may update our privacy policy from time to time; continued use of the app implies acceptance of the latest version.",
  ];
  

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {privacyPolicyInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function privacyPolicyInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        {privacyPoliciesList.map((item, index) => (
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
          Privacy Policy
        </Text>
      </View>
    );
  }
};

export default PrivacyPolicyScreen;