import { ScrollView, Text, View } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.";

const privacyPoliciesList = {
  "Information We Collect (Your Information)":
    "We collect information during your usage of the Platform, when you avail products or services, or when you visit our websites or mobile applications, either as a registered user or otherwise.",

  "Your Personal Information":
    "Full name, email ID, phone number, and other sensitive personal data or information. For vendors: PAN, Aadhaar, and GST details. Collected when you create an account or register for our services.",

  "Your Non-Personal Information":
    "Vehicle Information: Vehicle Registration Number, Vehicle Model Number, Vehicle Year of Manufacture, Vehicle Odometer Rating, Vehicle Range Left, and Vehicle Location. Third-Party Information: User ID and signup method (e.g., Facebook, Google) associated with social media accounts used to sign into the Platform. This includes public information from your social media account, information shared by the social media service, or data disclosed during sign-in, with your consent. Information from third parties such as partners, marketers, third-party websites, or researchers, combined with data we collect about you.",
};

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
        <Text style={{ fontSize: 12, marginBottom: 10, textAlign: "justify" }}>
          EV Care India and its affiliates, subsidiaries, and associate
          companies (hereinafter referred to individually and/or collectively as
          “EV Care”) are committed to protecting the privacy of users accessing,
          using, or purchasing products or services on any of EV Care’s
          websites, mobile sites, or mobile applications (collectively referred
          to as “Platform”) or otherwise doing business with EV Care. This
          Privacy Policy outlines how we collect, use, store, process, transfer,
          share, and protect your information when you visit our Platform, use
          our products and services, or otherwise interact with us. This policy
          is an electronic record under the Information Technology Act, 2000,
          and rules made thereunder (as amended), and does not require any
          physical signature or seal. In this document, “We”/“Us”/“Our” refers
          to EV Care, and “You”/“Your”/“Yourself” refers to users who visit,
          access, or use the Platform. Undefined terms have the same meaning as
          in our Terms of Service.
        </Text>
        {Object.entries(privacyPoliciesList).map(
          ([title, description], index, array) => (
            <View key={index} style={{ marginBottom: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor16Regular, fontWeight: "700" }}>
                {title}:
              </Text>
              <Text
                style={{ ...Fonts.blackColor16Regular, textAlign: "justify" }}
              >
                {description}
                {index === array.length - 1 ? (
                  <Text
                    onPress={() => Linking.openURL("http://evcareindia.com/")}
                    style={{ color: "blue", marginLeft: 5 }}
                  >
                    {" "}
                    see more
                  </Text>
                ) : null}
              </Text>
            </View>
          )
        )}
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
