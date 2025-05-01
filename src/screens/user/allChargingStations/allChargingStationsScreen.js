import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStations,
  selectStationsLoading,
  selectUserCoordinate,
} from "../service/selector";
import { filterStations } from "../../../utils/filter";

import imageURL from "../../../constants/baseURL";
import { RefreshControl } from "react-native";
import { handleRefreshStationsByLocation } from "../service/handleRefresh";
import {
  openHourFormatter,
  formatDistance,
  getChargerLabel,
  getLocationPermission,
} from "../../../utils/globalMethods";
import * as Location from "expo-location";

const AllChargingStationsScreen = ({ navigation }) => {
  const stations = useSelector(selectStations);
  const [refreshing, setRefreshing] = useState(false);
  const userCoords = useSelector(selectUserCoordinate);
  const isLoading = useSelector(selectStationsLoading);
  const dispatch = useDispatch();

  const openGoogleMaps = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  const [initialStations, setInitialStations] = useState(stations || []); // ensure fallback to empty array if stations is null or undefined
  const [filteredStations, setFilteredStations] = useState(stations || []); // same as above for filteredStations

  const handleFilterApply = (filters) => {
    const result = filterStations(stations, filters);
    setFilteredStations(result);
  };

  const handleRefresh = async () => {
    console.log("handle refresh called");
    const data = {
      radius: 30000,
      coords: userCoords,
    };
    //  const { status } = await Location.requestForegroundPermissionsAsync();
    //  if(status==="granted"){
    await handleRefreshStationsByLocation(dispatch, data, setRefreshing);
    // }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />

      {header()}
      {allStationsInfo()}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </View>
  );

  function allStationsInfo() {
    const noItemInfo = () => {
      if (filteredStations.length === 0) {
        return (
          <View style={[styles.centeredContainer, {}]}>
            <Text style={styles.noStationsText}>
              No Charging Stations Found
            </Text>
          </View>
        );
      }
    };

    const renderItem = ({ item }) => (
      <TouchableOpacity
       activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("ChargingStationDetail", { item });
        }}
        style={[styles.enrouteChargingStationWrapStyle, {}]}
      >
        <Image
          source={
            item?.station_images
              ? { uri: imageURL.baseURL + item?.station_images }
              : require("../../../../assets/images/nullStation.png")
          }
          style={styles.enrouteChargingStationImage}
        />

        <View style={styles.enrouteStationOpenCloseWrapper}>
          <Text style={{ ...Fonts.whiteColor18Regular }}>
            {item?.status === "Planned" || item?.status === "Active"
              ? "Open"
              : "Closed"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ margin: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              {item?.station_name}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item?.address}
            </Text>

            <View
              style={{
                marginTop: Sizes.fixPadding,
                ...commonStyles.rowSpaceBetween,
              }}
            >
              {/* Left Section */}
              <View style={{ ...commonStyles.rowAlignCenter }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                  {openHourFormatter(
                    item?.open_hours_opening_time,
                    item?.open_hours_closing_time
                  )}
                </Text>
              </View>

              {/* Right Section */}
              <View style={{ ...commonStyles.rowAlignCenter }}>
                <View style={styles.primaryColorDot} />
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.grayColor14Medium,
                    maxWidth: 150, // optional: limit text to prevent overflow
                  }}
                >
                  {getChargerLabel(item?.chargers?.length ?? 0)}
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
              {formatDistance(item?.distance_km)}
            </Text>
            <TouchableOpacity
              onPress={() =>
                openGoogleMaps(
                  item?.coordinates?.latitude,
                  item?.coordinates?.longitude
                )
              }
              style={styles.getDirectionButton}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={filteredStations}
        keyExtractor={(item) => `${item?.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 15 }}
        ListEmptyComponent={noItemInfo}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowSpaceBetween,
          elevation: 10,
          padding: 15,
          backgroundColor: Colors.bodyBackColor,
        }}
      >
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
              color: "black",
              textAlign: "center",
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
          onPress={() =>
            navigation.navigate("Filter", { onApplyFilter: handleFilterApply })
          }
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
    marginBottom: Sizes.fixPadding * 1.0,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(182, 206, 232, 0.3)",
    zIndex: 999,
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "80%",
    // backgroundColor: Colors.whiteColor,
  },
  noStationsText: {
    ...Fonts.blackColor18Medium,
    textAlign: "center",
    color: Colors.blackColor,
  },
});
