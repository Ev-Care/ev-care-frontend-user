import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Platform,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import { BottomSheet } from "@rneui/themed";
import React, { useState, createRef, useEffect, useRef } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapViewDirections from "react-native-maps-directions";
import Key from "../../../constants/key";
import imageURL from "../../../constants/baseURL";

const width = screenWidth;
const cardWidth = width / 1.15;
const SPACING_FOR_CARD_INSET = width * 0.1 - 30;

const EnrouteChargingStationsScreen = ({ navigation, route }) => {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const [expanded, setExpanded] = useState(false);
  const [showBottomSheet, setshowBottomSheet] = useState(true);
  const [addedStops, setAddedStops] = useState([]);
  const { enrouteStations } = route?.params;
  console.log("enrouteStations", JSON.stringify(enrouteStations[0]));
  const [destinationAddress, setDestinationAddress] = useState(
    route?.params?.destinationAddress || "Destination Address"
  );
  const [pickupAddress, setPickupAddress] = useState(
    route?.params?.pickupAddress || "Pickup Address"
  );

  // console.log("enrouteStations",enrouteStations?.length);
  const fromDefaultLocation = {
    latitude: route.params?.pickupCoordinate?.latitude || 0,
    longitude: route.params?.pickupCoordinate?.longitude || 0,
  };
  const toDefaultLocation = {
    latitude: route.params?.destinationCoordinate?.latitude || 0,
    longitude: route.params?.destinationCoordinate?.longitude || 0,
  };
  const [markerList] = useState(enrouteStations || []); 
  const [region, setRegion] = useState({
    latitude: fromDefaultLocation.latitude,
    longitude: fromDefaultLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const _map = useRef(null);
  const _scrollView = useRef(null);
  const mapAnimation = useRef(new Animated.Value(0)).current;
  const mapIndex = useRef(0);

  useEffect(() => {
    if (_map.current) {
      _map.current.animateToRegion(
        {
          latitude: fromDefaultLocation.latitude,
          longitude: fromDefaultLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  }, []);

  useEffect(() => {
    const listener = mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / cardWidth + 0.3);
      index = Math.max(0, Math.min(index, markerList?.length - 1));

      if (mapIndex.current !== index) {
        mapIndex.current = index;
        const { coordinate } = markerList[index];

        _map.current?.animateToRegion(
          {
            ...coordinate,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          },
          350
        );
      }
    });

    return () => {
      mapAnimation.removeListener(listener);
    };
  }, [mapAnimation, markerList, region]);

  const interpolation = markerList.map((marker, index) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];

    return {
      scale: mapAnimation.interpolate({
        inputRange,
        outputRange: [1, 1.5, 1],
        extrapolate: "clamp",
      }),
    };
  });


  const toggleStop = (station) => {
    console.log("Toggle Stop called with station:", station);
    const exists = addedStops.find((stop) => stop.id === station.id);
    
    // Log all stop IDs and the station's ID
    console.log("Existing stop IDs:", addedStops.map(s => s.id));
    console.log("Station ID being checked:", station.id);
  
    if (exists) {
      console.log("Station exists, removing...");
      setAddedStops((prev) => prev.filter((stop) => stop.id !== station.id));
    } else {
      console.log("Station does not exist, adding...");
      setAddedStops((prev) => [...prev, station]);
    }
  };
  
  
  
  const removeStop = (id) => {
    console.log("Remove Stop called with id:", id);
    debugger;
  
    const updatedStops = addedStops.filter((stop) => stop?.id !== id);
    console.log("Updated stops after removal:", updatedStops);
    setAddedStops(updatedStops);
  };
  

  

  const openGoogleMapsWithStops = () => {
    const source = `${fromDefaultLocation.latitude},${fromDefaultLocation.longitude}`;
    const destination = `${toDefaultLocation.latitude},${toDefaultLocation.longitude}`;
  
    const waypoints = addedStops
      .map(
        (stop) => `${stop.coordinates.latitude},${stop.coordinates.longitude}`
      )
      .join("|");
  
    const url = `https://www.google.com/maps/dir/?api=1&origin=${source}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  
    Linking.openURL(url);
  };
  

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * cardWidth + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };
  function trimName(threshold, str) {
    if (str.length <= threshold) {
      return str;
    }
    return str.substring(0, threshold) + ".....";
  }
  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return (distance / 1000).toFixed(1).replace(/\.0$/, "") + "k km";
    } else if (distance % 1 !== 0) {
      return distance.toFixed(1) + " km";
    } else {
      return distance + " km";
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {markersInfo()}
        {backArrow()}
        {chargingSpotsInfo()}
        {bottomSheet()}
      </View>
    </View>
  );
  function bottomSheet() {
    return (
      addedStops?.length > 0 && (
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            { height: expanded ? SCREEN_HEIGHT * 0.75 : 200 },
          ]}
        >
          {/* Handle */}
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View style={styles.bottomSheetHandle} />
          </TouchableOpacity>
          {/* Scrollable content */}
          <ScrollView style={styles.bottomSheetScroll}>
            {pickupInfo()}
            {addedStopsInfo()}
            {destinationInfo()}
          </ScrollView>

          {/* Bottom Button */}
          <TouchableOpacity
            onPress={openGoogleMapsWithStops}
            style={styles.bottomSheetButton}
          >
            <Text style={styles.bottomSheetButtonText}>Start Journey</Text>
          </TouchableOpacity>
        </Animated.View>
      )
    );
  }
  function destinationInfo() {
    return (
      <View style={styles.stopsContainer}>
        <View
          style={[
            styles.progress,
            {
              height: 88,
              width: 30,
              alignItems: "center",
            },
          ]}
        >
          <MaterialIcons name="location-on" size={20} color="red" />
        </View>
        <View style={[styles.stops, { marginTop: 2 }]}>
          <Text style={styles.stopText}>
            {trimName(30, destinationAddress)}
          </Text>

          <Text style={[styles.stopDescription, {}]}>
            {trimName(50, destinationAddress)}
          </Text>
        </View>
      </View>
    );
  }
  function pickupInfo() {
    return (
      <View style={styles.stopsContainer}>
        <View
          style={[
            {
              height: 90,
              width: 30,
              alignItems: "center",
            },
          ]}
        >
          <MaterialIcons name="circle" size={20} color="#3366ff" />

          <View
            style={{
              width: 2,
              flex: 1,

              borderStyle: "dotted",
              borderWidth: 1,
              borderColor: "gray",
            }}
          />
        </View>

        <View style={[styles.stops, {}]}>
          <Text style={styles.stopText}>{trimName(30, pickupAddress)}</Text>
          <Text style={styles.stopDescription}>
            {trimName(50, pickupAddress)}
          </Text>
          <Text style={[styles.stopDescription, { color: "red" }]}>
            Charge Your EV to avoid any issues on Trip
          </Text>
          <View style={[styles.stopBottomline]}></View>
        </View>
      </View>
    );
  }
  function addedStopsInfo() {
    return (
      <>
        {addedStops?.length > 0 &&  addedStops.map((stop, index) => (
          <View key={stop.id} style={styles.stopsContainer}>
            <View
              style={{
                height: 90,
                width: 30,
                alignItems: "center",
              }}
            >
              <MaterialIcons name="location-on" size={20} color={"green"} />
              <View
                style={{
                  width: 2,
                  flex: 1,
                  borderStyle: "dotted",
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              />
            </View>

            <View style={styles.stops}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.stopText}>
                  {trimName(30, stop?.station_name)}
                </Text>
                <TouchableOpacity onPress={() => removeStop(stop.id)}>
                  <MaterialIcons name="delete" size={20} color={"red"} />
                </TouchableOpacity>
              </View>
              <Text style={styles.stopDescription}>
                No. of Chargers - {stop.totalStations}
              </Text>
              <Text style={styles.stopDescription}>
                Address: {trimName(45, stop.stationAddress)}
              </Text>
              <View style={styles.stopBottomline} />
            </View>
          </View>
        ))}
      </>
    );
  }

  function backArrow() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.pop()}
        style={styles.backArrowWrapStyle}
      >
        <MaterialIcons name="arrow-back" size={24} color={Colors.blackColor} />
      </TouchableOpacity>
    );
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
        {markerList.map((item, index) => (
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
                      uri: "https://plus.unsplash.com/premium_photo-1715639312136-56a01f236440?q=80&w=2057&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }
              }
              style={styles.enrouteChargingStationImage}
            />
            <View style={styles.enrouteStationOpenCloseWrapper}>
              <Text
                style={[
                  styles.statusClosed,
                  { color: item?.status === "Inactive" ? "#FF5722" : "white" },
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
                  {item.address}
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
                      {item?.chargers?.length} Charging Points
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
                  {formatDistance(item?.distanceKm)}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleStop(item)}
                  style={[
                    styles.getDirectionButton,
                    {
                      backgroundColor: addedStops.some((s) => s?.id === item?.id)
                        ? Colors.orangeColor
                        : Colors.primaryColor,
                    },
                  ]}
                >
                  <Text style={{ ...Fonts.whiteColor16Medium }}>
                    {addedStops.some((s) => s?.id === item?.id)
                      ? "- Remove Stop"
                      : "+ Add Stop"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    );
  }
  function markersInfo() {
    return (
      <MapView
        ref={_map}
        style={{ flex: 1 }}
        initialRegion={region}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={setRegion} // Allows zoom update
      >
        {markerList.map((marker, index) => {
          const scaleStyle = {
            transform: [{ scale: interpolation[index].scale }],
          };
          return (
            <Marker
              key={index}
              coordinate={marker.coordinates}
              onPress={onMarkerPress}
              pinColor="#28692e"
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Image
                source={require("../../../../assets/images/stationMarker.png")}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </Marker>
          );
        })}

        <MapViewDirections
          origin={fromDefaultLocation}
          destination={toDefaultLocation}
          apikey={Key.apiKey}
          strokeColor={Colors.primaryColor}
          strokeWidth={3}
        />

        <Marker coordinate={fromDefaultLocation}>
          <Image
            source={require("../../../../assets/images/userMarker.png")}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </Marker>
        <Marker coordinate={toDefaultLocation} pinColor="red" />
      </MapView>
    );
  }

  function chargingSpotsInfo() {
    return (
      <View
        style={[
          styles.chargingInfoWrapStyle,
          { bottom: addedStops?.length > 0 ? 200 : 0 },
        ]}
      >
        {chargingSpots()}
      </View>
    );
  }
};

export default EnrouteChargingStationsScreen;

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
  // bottom sheet
  bottomSheetContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    elevation: 20,
  },
  bottomSheetHandle: {
    width: 60,
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 30,
  },
  bottomSheetScroll: {
    flex: 1,
  },
  stopBottomline: {
    backgroundColor: "#e0ebeb",
    width: 300,
    height: 0.9,
    marginVertical: 20,
  },

  bottomSheetButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  bottomSheetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  stopsContainer: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: "space-between",
    gap: 6,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  stopText: {
    ...Fonts.blackColor18SemiBold,
  },
  stopDescription: {
    marginVertical: 2,
    ...Fonts.grayColor14Medium,
  }, //bttom sheet

  primaryColorDot: {
    width: 10.0,
    height: 10.0,
    borderRadius: 5.0,
    backgroundColor: Colors.primaryColor,
  },
  markerStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 45.0,
    height: 45.0,
  },
  getDirectionButton: {
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  chargingInfoWrapStyle: {
    position: "absolute",
    left: 0.0,
    right: 0.0,
  },
  backArrowWrapStyle: {
    width: 40.0,
    height: 40.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: 20.0,
    ...commonStyles.shadow,
    position: "absolute",
    top: 20.0,
    left: 20.0,
    alignItems: "center",
    justifyContent: "center",
  },
});
