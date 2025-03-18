import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import {
  Colors,
  commonStyles,
  Fonts,
  screenWidth,
  Sizes,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ConfirmDetailScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
        >
          {chargingStationInfo()}
          {bookingInfo()}
          {payableAmountInfo()}
        </ScrollView>
      </View>
      {confirmAndPayButton()}
    </View>
  );

  function confirmAndPayButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("Payment");
        }}
        style={{
          ...commonStyles.button,
          borderRadius: 0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Confirm & pay</Text>
      </TouchableOpacity>
    );
  }

  function payableAmountInfo() {
    return (
      <Text
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          textAlign: "center",
          ...Fonts.blackColor18Medium,
        }}
      >
        Payable amount {}
        <Text style={{ ...Fonts.primaryColor22SemiBold }}>$150</Text>
      </Text>
    );
  }

  function bookingInfo() {
    return (
      <View style={styles.bookingInfoWrapStyle}>
        <View
          style={{
            ...commonStyles.rowAlignCenter,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <View style={{ marginRight: Sizes.fixPadding, flex: 1 }}>
            <Text style={{ textAlign: "left", ...Fonts.blackColor18SemiBold }}>
              BMW i7
            </Text>
            <Text style={{ ...Fonts.grayColor16Medium }}>4 Wheeler</Text>
          </View>
          <Image
            source={require("../../assets/images/cars/car4.png")}
            style={{
              width: screenWidth / 2.5,
              height: screenWidth / 5.5,
              resizeMode: "contain",
            }}
          />
        </View>
        <View style={styles.dottedLineStyle} />
        <View style={{ ...styles.bookingDetailWrapStyle }}>
          <Text style={{ flex: 1, ...Fonts.blackColor18SemiBold }}>Date</Text>
          <Text
            style={{ flex: 1, ...Fonts.grayColor16Medium, textAlign: "right" }}
          >
            25 Sept 2023
          </Text>
        </View>
        <View style={{ ...styles.bookingDetailWrapStyle }}>
          <Text style={{ flex: 1, ...Fonts.blackColor18SemiBold }}>
            Slot time
          </Text>
          <Text
            style={{ flex: 1, ...Fonts.grayColor16Medium, textAlign: "right" }}
          >
            11:50 PM
          </Text>
        </View>
        <View style={{ ...styles.bookingDetailWrapStyle }}>
          <Text style={{ flex: 1, ...Fonts.blackColor18SemiBold }}>
            Connection type
          </Text>
          <Text
            style={{ flex: 1, ...Fonts.grayColor16Medium, textAlign: "right" }}
          >
            CCS2
          </Text>
        </View>
        <View style={{ ...styles.bookingDetailWrapStyle }}>
          <Text style={{ flex: 1, ...Fonts.blackColor18SemiBold }}>
            Battery
          </Text>
          <Text
            style={{ flex: 1, ...Fonts.grayColor16Medium, textAlign: "right" }}
          >
            120kw
          </Text>
        </View>
        <View style={{ ...styles.bookingDetailWrapStyle }}>
          <Text style={{ flex: 1, ...Fonts.blackColor16SemiBold }}>Price</Text>
          <Text
            style={{
              flex: 1,
              ...Fonts.primaryColor16Medium,
              textAlign: "right",
            }}
          >
            0.05$/kw
          </Text>
        </View>
        <Text style={styles.chargeInfoTextStyle}>
          You selected full charge for this booking.
        </Text>
      </View>
    );
  }

  function chargingStationInfo() {
    return (
      <View style={styles.chargingStationWrapStyle}>
        <Image
          source={require("../../assets/images/chargingStations/charging_station4.png")}
          style={styles.chargingStationImage}
        />
        <View style={styles.stationOpenCloseWrapper}>
          <Text style={{ ...Fonts.whiteColor18Regular }}>Open</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ margin: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              BYD Charging Point
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              Near shell petrol station
            </Text>
            <View
              style={{
                marginTop: Sizes.fixPadding,
                ...commonStyles.rowAlignCenter,
              }}
            >
              <View style={{ ...commonStyles.rowAlignCenter }}>
                <Text style={{ ...Fonts.blackColor18Medium }}>4.7</Text>
                <MaterialIcons
                  name="star"
                  color={Colors.yellowColor}
                  size={20}
                />
              </View>
              <View
                style={{
                  marginLeft: Sizes.fixPadding * 2.0,
                  ...commonStyles.rowAlignCenter,
                  flex: 1,
                }}
              >
                <View style={styles.primaryColorDot} />
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.grayColor14Medium,
                    flex: 1,
                  }}
                >
                  8 Charging Points
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              ...commonStyles.rowAlignCenter,
              paddingLeft: Sizes.fixPadding,
              marginTop: Sizes.fixPadding,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.blackColor16Medium,
                flex: 1,
                marginRight: Sizes.fixPadding - 5.0,
              }}
            >
              4.5 km
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("Direction");
              }}
              style={styles.getDirectionButton}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
            </TouchableOpacity>
          </View>
        </View>
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
          Confirm details
        </Text>
      </View>
    );
  }
};

export default ConfirmDetailScreen;

const styles = StyleSheet.create({
  chargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    flexDirection: "row",
  },
  chargingStationImage: {
    width: screenWidth / 3.2,
    height: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  stationOpenCloseWrapper: {
    position: "absolute",
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  primaryColorDot: {
    width: 10.0,
    height: 10.0,
    borderRadius: 5.0,
    backgroundColor: Colors.primaryColor,
  },
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  bookingDetailWrapStyle: {
    ...commonStyles.rowSpaceBetween,
    marginBottom: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  dottedLineStyle: {
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    borderStyle: "dashed",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  bookingInfoWrapStyle: {
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 7.0,
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
  },
  chargeInfoTextStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
    textAlign: "center",
    ...Fonts.primaryColor16Medium,
  },
});
