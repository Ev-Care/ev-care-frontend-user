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
import React, { useCallback, useEffect, useState } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import imageURL from "../../../constants/baseURL";
import { openHourFormatter,formatDistance } from "../../../utils/globalMethods";
import { useDispatch, useSelector } from "react-redux";
import { selectAdminStations } from "../services/selector";
import { useFocusEffect } from "@react-navigation/native";
import { fetchAllPendingStation } from "../services/crudFunctions";
import { RefreshControl } from "react-native";



const AllPendingStations = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const allStationsList = useSelector(selectAdminStations);
   const [refreshing, setRefreshing] = useState(false);
  const filteredStations = allStationsList.filter((station) =>
    station?.station_name?.toLowerCase().includes(searchText.toLowerCase())
  );
  const dispatch = useDispatch(selectAdminStations);
  console.log('pending Station', JSON.stringify(allStationsList, null,2));
  // Dummy coordinates for the location
// Called only on first mount
useEffect(() => {
  console.log('pending station fetched from useEffect');

  dispatch(fetchAllPendingStation());
}, [dispatch]);

// Called every time screen comes into focus
useFocusEffect(
  useCallback(() => {
    console.log('pending station fetched from useFocusEffect');
    dispatch(fetchAllPendingStation());
  }, [dispatch])
);

 
const handleRefresh = async () => {

  
};


  const openGoogleMaps = (latitude,longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
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
        onPress={() => navigation.navigate("StationDetailToVerify", { item })}
        style={styles.enrouteChargingStationWrapStyle}
      >
        <Image
          source={
            item?.station_images
              ? { uri: imageURL.baseURL + item?.station_images }
              : require("../../../../assets/images/chargingStations/charging_station3.png")
          }
          style={styles.enrouteChargingStationImage}
        />
        <View style={styles.enrouteStationOpenCloseWrapper}>
          <Text style={{ ...Fonts.whiteColor18Regular }}>Pending</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ margin: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              {item.station_name}
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
                <Text style={{ ...Fonts.blackColor16Medium }}>
                {openHourFormatter(item?.open_hours_opening_time, item?.open_hours_closing_time).opening} - {openHourFormatter(item?.open_hours_opening_time, item?.open_hours_closing_time).closing}
                </Text>
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
                   {item?.chargers?.length ?? 0} Chargers
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
              onPress={()=>openGoogleMaps( item.coordinates.latitude, item.coordinates.longitude)}
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

export default AllPendingStations;

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
