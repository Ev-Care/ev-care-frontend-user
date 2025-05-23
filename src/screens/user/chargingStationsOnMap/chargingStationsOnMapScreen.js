import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Platform,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useState, createRef, useEffect, useRef } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { selectStations } from "../service/selector";
import imageURL from "../../../constants/baseURL";
import { openHourFormatter ,formatDistance} from "../../../utils/globalMethods";
const width = screenWidth;
const cardWidth = width / 1.15;
const SPACING_FOR_CARD_INSET = width * 0.1 - 30;
const customMapStyle = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.government",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.medical",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.park",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.sports_complex",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.airport",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.train_station",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit.station",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
];



const ChargingStationsOnMapScreen = ({ navigation }) => {

  const [currentLocation, setCurrentLocation] = useState(null);
  const _map = useRef();
  const [region, setRegion] = useState({
    latitude: 22.6292757,
    longitude: 88.444781,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  const stations = useSelector(selectStations);
  const [stationsList] = useState(Array.isArray(stations) ? stations : []); // Ensure stationsList is always an array

  let mapAnimation = new Animated.Value(0);
  let mapIndex = 0;

  useEffect(() => {
    console.log(" map page rendered");
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / cardWidth + 0.3);
      if (index >= stationsList.length) {
        index = stationsList.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { coordinates } = stationsList[index] ?? {}; // Optional chaining
          _map.current?.animateToRegion(
            {
              ...coordinates,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }, [mapAnimation, stationsList]);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert("Permission Denied", "Using default location (Delhi).");
        setRegion({
          latitude: 28.6139,
          longitude: 77.209,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords ?? {}; // Optional chaining

      // ✅ Update state instantly
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setCurrentLocation({ latitude, longitude });

      // ✅ Animate camera IMMEDIATELY without waiting for state update
      if (_map.current) {
        console.log("Animating camera to..:", latitude, longitude);
        _map.current.animateCamera(
          {
            center: { latitude, longitude },
            zoom: 15, // Adjust zoom level as needed
          },
          { duration: 500 }
        );
      }
    } catch (error) {
      console.error("Error requesting location:", error);
      Alert.alert("Error", "Failed to fetch location. Using default (Delhi).");
      setRegion({
        latitude: 28.6139,
        longitude: 77.209,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const interpolation = stationsList?.map((marker, index) => { // Optional chaining
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });



  const openGoogleMaps = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData?._targetInst?.return?.key; // Optional chaining

    let x = markerID * cardWidth + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current?.scrollTo({ x: x, y: 0, animated: true }); // Optional chaining
  };

  const _scrollView = useRef(null);



  return (
    stations ? (
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <MyStatusBar />
        <View style={{ flex: 1 }}>
          {markersInfo()}
          {chargingSpotsInfo()}
          {/* Floating Button to Get Current Location */}
          <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
            <Ionicons name="locate-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bodyBackColor }}>
        <Text style={{ fontSize: 18, color: 'gray' }}>Stations not found</Text>
      </View>
    )
  );
  
  function markersInfo() {
    return (
      <MapView
        ref={_map}
        style={{ flex: 1 }}
        initialRegion={region}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
      >
        {stationsList?.map((marker, index) => { // Optional chaining to prevent errors if stationsList is undefined or null
          const scaleStyle = {
            transform: [
              {
                scale: interpolation[index]?.scale, // Optional chaining for interpolation
              },
            ],
          };
          return (
            <Marker
              key={index}
              coordinate={marker?.coordinates} // Optional chaining for coordinates
              onPress={(e) => onMarkerPress(e)}
              anchor={{ x: 0.5, y: 0.5 }}
              pinColor="green"
            >
              <Image
                source={require("../../../../assets/images/stationMarker.png")}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </Marker>
          );
        })}
        {/* Custom Current Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Image
              source={require("../../../../assets/images/userMarker.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker>
        )}
      </MapView>
    );
  }
  
  function chargingSpotsInfo() {
    return <View style={styles.chargingInfoWrapStyle}>{chargingSpots()}</View>;
  }

  function chargingSpots() {
    return (
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 25}
        decelerationRate="fast"
        snapToAlignment="center"
        style={{ paddingVertical: Sizes.fixPadding }}
        contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      >
        {stationsList?.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.push("ChargingStationDetail", { item })}
            key={index}
            style={styles.enrouteChargingStationWrapStyle}
          >
            <Image
              source={
                item?.station_images
                  ? { uri: imageURL.baseURL + item?.station_images }
                  : {
                      uri:
                        "https://plus.unsplash.com/premium_photo-1715639312136-56a01f236440?q=80&w=2057&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }
              }
              style={styles.enrouteChargingStationImage}
            />
            <View style={styles.enrouteStationOpenCloseWrapper}>
              <Text
                style={[
                  styles.statusClosed,
                  {
                    color: item?.status === "Inactive" ? "#FF5722" : "white",
                  },
                ]}
              >
                {item?.status === "Inactive" ? "Closed" : "Open"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ margin: Sizes.fixPadding }}>
                <Text
                  numberOfLines={1}
                  style={{ ...Fonts.blackColor18SemiBold }}
                >
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
                      {item?.chargers?.length} Chargers
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
                    openGoogleMaps(item?.coordinates?.latitude, item?.coordinates?.longitude)
                  }
                  style={styles.getDirectionButton}
                >
                  <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    );
  }
  
};

export default ChargingStationsOnMapScreen;

const styles = StyleSheet.create({
  enrouteChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
    width: cardWidth,
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
  markerStyle: {
    alignItems: "center",
    justifyContent: "center",

  },
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  chargingInfoWrapStyle: {
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
  },
 
  locationButton: {
    position: "absolute",
    bottom: 200,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#101942",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
});
