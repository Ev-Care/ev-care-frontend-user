import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import MyStatusBar from "../../../components/myStatusBar";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { selectUser } from "../../auth/services/selector";
import { useSelector } from "react-redux";

const nearByChargingStationsList = [
  {
    id: "1",
    stationImage: require("../../../../assets/images/chargingStations/charging_station2.png"),
    stationName: "VoltCharge Hub",
    stationDistance: "4.3 Km",
    rating: 4.5,
    totalStations: 10,
    isOpen: true,
  },
  {
    id: "2",
    stationImage: require("../../../../assets/images/chargingStations/charging_station3.png"),
    stationName: "EcoPower Station",
    stationDistance: "7.9 Km",
    rating: 4.1,
    totalStations: 14,
    isOpen: false,
  },
  {
    id: "3",
    stationImage: require("../../../../assets/images/chargingStations/charging_station1.png"),
    stationName: "ChargeSwift Point",
    stationDistance: "6.9 Km",
    rating: 4.3,
    totalStations: 9,
    isOpen: true,
  },
  {
    id: "4",
    stationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    stationName: "AmpereX Charging",
    stationDistance: "7.7 Km",
    rating: 4.8,
    totalStations: 20,
    isOpen: true,
  },
];

const enrouteChargingStationList = [
  {
    id: "1",
    stationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    stationName: "GridCharge Station",
    stationAddress: "Close to Highway Exit 12",
    rating: 4.6,
    totalStations: 7,
    distance: "3.2 km",
    isOpen: true,
  },
  {
    id: "2",
    stationImage: require("../../../../assets/images/chargingStations/charging_station1.png"),
    stationName: "HyperVolt Charge",
    stationAddress: "Near Grand Metro Tower",
    rating: 3.8,
    totalStations: 11,
    distance: "6.1 km",
    isOpen: false,
  },
  {
    id: "3",
    stationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    stationName: "FlashCharge Hub",
    stationAddress: "Next to Maple Business Park",
    rating: 4.7,
    totalStations: 5,
    distance: "2.9 km",
    isOpen: true,
  },
  {
    id: "4",
    stationImage: require("../../../../assets/images/chargingStations/charging_station3.png"),
    stationName: "PowerGrid EV Center",
    stationAddress: "Near Nova Tech Square",
    rating: 4.0,
    totalStations: 13,
    distance: "4.8 km",
    isOpen: false,
  },
];

export { nearByChargingStationsList, enrouteChargingStationList };


const HomeScreen = ({ navigation }) => {
 const user = useSelector( selectUser);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {welcomeInfo()}
          {searchBox()}
          {nearByChargingStationInfo()}
          {enrouteChargingStationInfo()}
        </ScrollView>
        {/* {mapViewButton()} */}
      </View>
    </View>
  );

  // function mapViewButton() {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.9}
  //       onPress={() => navigation.push("ChargingStationsOnMap")}
  //       style={styles.mapViewButton}
  //     >
  //       <MaterialIcons name="map" color={Colors.whiteColor} size={30} />
  //     </TouchableOpacity>
  //   );
  // }

  function enrouteChargingStationInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ChargingStationDetail");
        }}
        style={styles.enrouteChargingStationWrapStyle}
      >
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
      </TouchableOpacity>
    );
    return (
      <View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor20SemiBold,
          }}
        >
          Enroute charging station
        </Text>
        <FlatList
          data={enrouteChargingStationList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          style={{ paddingTop: Sizes.fixPadding * 1.5 }}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function nearByChargingStationInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ChargingStationDetail");
        }}
        style={styles.nearByChargingStationWrapStyle}
      >
        <View>
          <Image
            source={item.stationImage}
            style={styles.nearByChargingStationImageStyle}
          />
          <View style={styles.nearByOpenCloseWrapper}>
            <Text style={{ ...Fonts.whiteColor18Regular }}>
              {item.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
        <View style={{ width: screenWidth / 1.83 }}>
          <View style={{ padding: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              {item.stationName}
            </Text>
            <View  style={{ flexDirection: "row",justifyContent: "space-between"}}>
            <View style={{ ...commonStyles.rowAlignCenter }}>
              <Text style={{ ...Fonts.blackColor18Medium }}>{item.rating}</Text>
              <MaterialIcons name="star" color={Colors.yellowColor} size={20} />
            </View>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item.stationDistance}
            </Text>
            </View>
            
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: Sizes.fixPadding,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                ...Fonts.grayColor12Medium,
                flex: 1,
                marginRight: Sizes.fixPadding - 5.0,
              }}
            >
              {item.totalStations} Charging Points
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
      </TouchableOpacity>
    );
    return (
      <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
        <View
          style={{
            ...commonStyles.rowSpaceBetween,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ ...Fonts.blackColor20SemiBold, flex: 1 }}
          >
            Nearby charging station
          </Text>
          <Text
            onPress={() => {
              navigation.push("AllChargingStations");
            }}
            style={{ ...Fonts.primaryColor16Medium }}
          >
            See all
          </Text>
        </View>
        <FlatList
          data={nearByChargingStationsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding * 1.5,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        />
      </View>
    );
  }

  function searchBox() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.push("Search")}
        style={styles.searchBox}
      >
        <MaterialIcons name="search" color={Colors.grayColor} size={24} />
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.grayColor18Medium,
            flex: 1,
            marginLeft: Sizes.fixPadding,
          }}
        >
          Search for charging station
        </Text>
      </TouchableOpacity>
    );
  }

  function welcomeInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor26SemiBold }}>Welcome {user.owner_legal_name}</Text>
        <Text style={{ ...Fonts.grayColor18Regular }}>
          Find nearest Charging Stations
        </Text>
      </View>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  nearByChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    marginRight: Sizes.fixPadding * 2.0,
  },
  nearByChargingStationImageStyle: {
    width: screenWidth / 1.83,
    height: screenWidth / 3.2,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  nearByOpenCloseWrapper: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    right: 0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderBottomLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
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
  mapViewButton: {
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20.0,
    right: 20.0,
    ...commonStyles.shadow,
  },
});
