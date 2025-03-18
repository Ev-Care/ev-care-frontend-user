import { FlatList, StyleSheet, Text, Image, View } from "react-native";
import React from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const allStationsList = [
  {
    id: "1",
    stationImage: require("../../assets/images/chargingStations/charging_station2.png"),
    stationName: "Apex Charging Point",
    stationAddress: "Near shell petrol station",
    rating: 4.7,
    totalStations: 8,
    distance: "5.7 km",
    isOpen: true,
  },
  {
    id: "2",
    stationImage: require("../../assets/images/chargingStations/charging_station3.png"),
    stationName: "Horizon EV Station",
    stationAddress: "Near apex hospital",
    rating: 4.2,
    totalStations: 18,
    distance: "5.7 km",
    isOpen: true,
  },
  {
    id: "3",
    stationImage: require("../../assets/images/chargingStations/charging_station1.png"),
    stationName: "Rapid EV Charge",
    stationAddress: "Near shelby play ground",
    rating: 4.2,
    totalStations: 12,
    distance: "5.7 km",
    isOpen: false,
  },
  {
    id: "4",
    stationImage: require("../../assets/images/chargingStations/charging_station5.png"),
    stationName: "Tesla Recharge",
    stationAddress: "Near nissan show room",
    rating: 4.9,
    totalStations: 22,
    distance: "5.7 km",
    isOpen: true,
  },
  {
    id: "5",
    stationImage: require("../../assets/images/chargingStations/charging_station2.png"),
    stationName: "BYD Charging Point",
    stationAddress: "Near shell petrol station",
    rating: 4.7,
    totalStations: 8,
    distance: "4.5 km",
    isOpen: true,
  },
  {
    id: "6",
    stationImage: require("../../assets/images/chargingStations/charging_station4.png"),
    stationName: "TATA EStation",
    stationAddress: "Near orange business hub",
    rating: 3.9,
    totalStations: 15,
    distance: "5.7 km",
    isOpen: false,
  },
];

const AllChargingStationsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {allStationsInfo()}
      </View>
    </View>
  );

  function allStationsInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.enrouteChargingStationWrapStyle}>
        <Image
          source={item.stationImage}
          style={styles.enrouteChargingStationImage}
        />
        <View style={styles.enrouteStationOpenCloseWrapper}>
          <Text style={{ ...Fonts.whiteColor18Regular }}>
            {item.isOpen ? "Open" : "Closed"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ margin: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              {item.stationName}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item.stationAddress}
            </Text>
            <View
              style={{
                marginTop: Sizes.fixPadding,
                ...commonStyles.rowAlignCenter,
              }}
            >
              <View style={{ ...commonStyles.rowAlignCenter }}>
                <Text style={{ ...Fonts.blackColor18Medium }}>
                  {item.rating}
                </Text>
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
                  {item.totalStations} Charging Points
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
              {item.distance}
            </Text>
            <View style={styles.getDirectionButton}>
              <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
            </View>
          </View>
        </View>
      </View>
    );
    return (
      <FlatList
        data={allStationsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  function header() {
    return (
      <View style={{ ...commonStyles.rowSpaceBetween, margin: 20.0 }}>
        <View
          style={{
            ...commonStyles.rowAlignCenter,
            flex: 1,
            marginRight: Sizes.fixPadding - 5.0,
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
            numberOfLines={1}
            style={{
              ...Fonts.blackColor20SemiBold,
              flex: 1,
              marginLeft: Sizes.fixPadding * 2.0,
            }}
          >
            Nearby Charging Station
          </Text>
        </View>
        <MaterialIcons
          name="filter-list"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.push("Filter");
          }}
        />
      </View>
    );
  }
};

export default AllChargingStationsScreen;

const styles = StyleSheet.create({
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  enrouteChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  enrouteChargingStationImage: {
    width: screenWidth / 3.2,
    height: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  enrouteStationOpenCloseWrapper: {
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
});
