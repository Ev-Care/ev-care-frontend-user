import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.";

const termsAndConditionsObject = {
  Safety:
    "Charging station operators are responsible for prioritizing user safety and implementing necessary precautions to ensure a safe charging experience.",

  Damage:
    "Operators are liable for any damages caused to the property of the land-owning agency by their equipment.",

  "Limited Liability":
    "Operators may limit their liability for certain losses, including but not limited to loss of profits, data, or goodwill, arising from the use of their website or services, to the extent permitted by applicable law.",

  "Fair Usage":
    "Certain offers may include a fair usage period with limits on usage (e.g., kilowatt-hours or duration).",

  "Standard Tariff":
    "After the fair usage period expires, standard tariffs will apply for continued use.",

  Payment:
    "Users agree to pay for the electricity consumed. Bills will itemize usage and associated costs for transparency.",

  "Payment Methods":
    "Payments are typically processed through registered debit or credit cards. Users may be required to provide payment details during registration.",

  "Dispute Resolution":
    "Any discrepancies in billing should be reported promptly. The operator will investigate and address billing errors in accordance with applicable policies.",

  Suspension:
    "Non-payment of bills may result in account suspension until outstanding amounts are settled.",

  "Termination/Modification":
    "Operators reserve the right to terminate or modify offers at any time without prior notice. This includes changes to locations, usage terms, or other conditions.",

  "Governing Law":
    "All offers are governed by the laws of the jurisdiction where they are applicable.",

  "Technical Issues":
    "Operators are not responsible for technical difficulties that prevent users from accessing or using an offer, unless caused by the operator’s negligence.",

  Acceptance:
    "By using a charging station or accepting an offer, you agree to abide by these Terms and Conditions.",

  Interoperability:
    "Charging stations are designed with interoperability in mind, enabling users to access various charging networks seamlessly.",

  Connectivity:
    "EV charging infrastructure requires connectivity to a central management system to ensure efficient operation and real-time updates.",
};

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
      <View
        style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: 50 }}
      >
        <Text style={{ fontSize: 12, marginBottom: 10 ,textAlign: 'justify'}}>
          By visiting our platform, using, or availing any of our services or
          products, you indicate that you understand, agree, and consent to
          these Terms and Conditions. You hereby give your unconditional consent
          to EV Charging Station Finder App ("EV Care") for the collection, use,
          storage, processing, sharing, transfer, and disclosure of your
          information as required under applicable law. You acknowledge that you
          have all legal rights and lawful authority to share your information
          with us. You further acknowledge that the collection, sharing,
          processing, and transferring of information provided by you shall not
          cause any loss or wrongful gain to you or any other person...
        </Text>
        {Object.entries(termsAndConditionsObject).map(
          ([title, description], index, array) => (
            <View key={index} style={{ marginBottom: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor16Regular, fontWeight: "700" }}>
                {title}:
              </Text>
              <Text style={{ ...Fonts.blackColor16Regular,textAlign: 'justify' }}>
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
          Terms & Condition
        </Text>
      </View>
    );
  }
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({});
