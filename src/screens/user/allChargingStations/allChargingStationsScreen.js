import { FlatList, StyleSheet, TouchableOpacity, Text, Image, View, Linking, Platform, } from "react-native";
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
import { useSelector } from "react-redux";
import { selectStations } from "../service/selector";
import { filterStations } from "../../../utils/filter";
import imageURL from "../../../constants/baseURL";
import { RefreshControl } from 'react-native';



const AllChargingStationsScreen = ({ navigation }) => {
  const stations = useSelector(selectStations);
    const [refreshing, setRefreshing] = useState(false);

  // console.log("stations in all charging stations screen ", stations.length);

  const openGoogleMaps = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  const [initialStations, setInitialStations] = useState(stations); // your fetched data
  const [filteredStations, setFilteredStations] = useState(stations); // to display

  const handleFilterApply = (filters) => {
    const result = filterStations(stations, filters);
    setFilteredStations(result);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log("Refresh completed!");
    }, 2000); 
  }


  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return (distance / 1000).toFixed(1).replace(/\.0$/, '') + 'k km';
    } else if (distance % 1 !== 0) {
      return distance.toFixed(1) + ' km';
    } else {
      return distance + ' km';
    }
  };

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
      <TouchableOpacity onPress={() => {
        navigation.navigate("ChargingStationDetail", { item });
      }} style={styles.enrouteChargingStationWrapStyle}>
       <Image
  source={
    item?.station_images
    ? { uri: imageURL.baseURL + item.station_images }
      : { uri: "https://plus.unsplash.com/premium_photo-1715639312136-56a01f236440?q=80&w=2057&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  }
  style={styles.enrouteChargingStationImage}
/>

        <View style={styles.enrouteStationOpenCloseWrapper}>
          <Text style={{ ...Fonts.whiteColor18Regular }}>
            {item?.status === "Planned" || item?.status === "Active" ? "Open" : "Closed"}
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
                ...commonStyles.rowAlignCenter,
              }}
            >
              <View style={{ ...commonStyles.rowAlignCenter }}>
                <Text style={{ ...Fonts.blackColor18Medium }}>
                  4.8
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
                  {item?.chargers.length} Charging Points
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
            <TouchableOpacity onPress={() => openGoogleMaps(item?.coordinates.latitude, item?.coordinates.longitude)} style={styles.getDirectionButton}>
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
          onPress={() => navigation.navigate('Filter', { onApplyFilter: handleFilterApply })}
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
