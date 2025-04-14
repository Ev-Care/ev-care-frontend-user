import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Linking,
  View,
} from "react-native";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import React, { useState } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const allStationsList = [
  {
    id: "1",
    stationImage: require("../../../../assets/images/chargingStations/charging_station2.png"),
    stationName: "Apex Charging Point",
    stationAddress: "Near shell petrol station",
    rating: 4.7,
    totalStations: 8,
    distance: "5.7 km",
    isOpen: true,
  },
  {
    id: "2",
    stationImage: require("../../../../assets/images/chargingStations/charging_station3.png"),
    stationName: "Horizon EV Station",
    stationAddress: "Near apex hospital",
    rating: 4.2,
    totalStations: 18,
    distance: "5.7 km",
    isOpen: true,
  },
  {
    id: "3",
    stationImage: require("../../../../assets/images/chargingStations/charging_station1.png"),
    stationName: "Rapid EV Charge",
    stationAddress: "Near shelby play ground",
    rating: 4.2,
    totalStations: 12,
    distance: "5.7 km",
    isOpen: false,
  },
  {
    id: "4",
    stationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    stationName: "Tesla Recharge",
    stationAddress: "Near nissan show room",
    rating: 4.9,
    totalStations: 22,
    distance: "5.7 km",
    isOpen: true,
  },
  {
    id: "5",
    stationImage: require("../../../../assets/images/chargingStations/charging_station2.png"),
    stationName: "BYD Charging Point",
    stationAddress: "Near shell petrol station",
    rating: 4.7,
    totalStations: 8,
    distance: "4.5 km",
    isOpen: true,
  },
  {
    id: "6",
    stationImage: require("../../../../assets/images/chargingStations/charging_station4.png"),
    stationName: "TATA EStation",
    stationAddress: "Near orange business hub",
    rating: 3.9,
    totalStations: 15,
    distance: "5.7 km",
    isOpen: false,
  },
];

const ViewAllStationsPage = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const filteredStations = allStationsList.filter((station) =>
    station.stationName.toLowerCase().includes(searchText.toLowerCase())
  );
  // Dummy coordinates for the location
  const latitude = 28.6139;  
  const longitude = 77.2090;
 

 const openGoogleMaps = () => {
  const url = Platform.select({
    ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`
  });
  Linking.openURL(url);
};
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {searchBar()}
        {allStationsInfo()}
      </View>
    </View>
  );

  function allStationsInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("ChargingStationDetail")}
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
            <TouchableOpacity onPress={openGoogleMaps} style={styles.getDirectionButton}>
              <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={filteredStations}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  function searchBar() {
    return (
      <View style={{ margin: 20.0 }}>
        <MyStatusBar/>
        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={24}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search Charging Stations"
            placeholderTextColor="#888"
            style={{
              flex: 1,
              fontSize: 16,
              color: "#000",
            }}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
    );
  }
};

export default ViewAllStationsPage;

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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
