import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  commonStyles,
  Fonts,
  FontFamily,
  Sizes,
} from "../../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CreditCardInput } from "rn-card-input";
import MyStatusBar from "../../../components/myStatusBar";

const PaymentScreen = ({ navigation }) => {
  const [cardNumberStatus, setcardNumberStatus] = useState("invalid");
  const [cardExpiryStatus, setcardExpiryStatus] = useState("invalid");
  const [cardCvcStatus, setcardCvcStatus] = useState("invalid");
  const [cardHolderStatus, setcardHolderStatus] = useState("invalid");
  const [saveCard, setsaveCard] = useState(true);

  const _onChange = (formData) => {
    setcardNumberStatus(formData.values.number);
    setcardExpiryStatus(formData.values.expiry);
    setcardCvcStatus(formData.values.cvc);
    setcardHolderStatus(formData.values.name);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {paymentDescriptionText()}
          {cardDetails()}
          {saveCardInfo()}
        </ScrollView>
        {payButton()}
      </View>
    </View>
  );

  function payButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("BookingSuccess");
        }}
        style={{ ...commonStyles.button, borderRadius: 0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Pay</Text>
      </TouchableOpacity>
    );
  }

  function saveCardInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setsaveCard(!saveCard)}
        style={styles.saveCardInfoWrapper}
      >
        <View
          style={{
            ...styles.selectionIndicatorStyle,
            backgroundColor: saveCard ? Colors.primaryColor : Colors.whiteColor,
            ...commonStyles.shadow,
          }}
        >
          {saveCard ? (
            <MaterialIcons name="check" color={Colors.whiteColor} size={18} />
          ) : null}
        </View>
        <Text
          style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}
        >
          Save this card
        </Text>
      </TouchableOpacity>
    );
  }

  function cardDetails() {
    return (
      <CreditCardInput
        requiresName
        requiresCVC
        labelStyle={{ ...Fonts.blackColor16SemiBold }}
        inputStyle={styles.cardInputFieldStyle}
        inputContainerStyle={{
          marginBottom: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
        cardFontFamily={FontFamily.SemiBold}
        cardScale={1.1}
        validColor={"black"}
        invalidColor={"red"}
        placeholderColor={Colors.grayColor}
        onChange={_onChange}
        cardImageFront={require("../../assets/images/cardbg.png")}
        cardImageBack={require("../../assets/images/cardbg.png")}
      />
    );
  }

  function paymentDescriptionText() {
    return (
      <Text
        style={{
          ...Fonts.grayColor16Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding + 5.0,
        }}
      >
        Enter your card detail and pay..
      </Text>
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
          Pay now
        </Text>
      </View>
    );
  }
};

export default PaymentScreen;

const styles = StyleSheet.create({
  cardInputFieldStyle: {
    ...Fonts.blackColor16Medium,
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    paddingHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    height: 45.0,
    marginTop: Sizes.fixPadding - 2.0,
  },
  selectionIndicatorStyle: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    alignItems: "center",
    justifyContent: "center",
  },
  saveCardInfoWrapper: {
    ...commonStyles.rowAlignCenter,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    alignSelf: "flex-start",
  },
});
