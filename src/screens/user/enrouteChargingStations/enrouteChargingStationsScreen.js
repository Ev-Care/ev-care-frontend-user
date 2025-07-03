import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { BottomSheet } from "@rneui/themed";
import React, { useState, createRef, useEffect, useRef } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
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
import {
  openHourFormatter,
  formatDistance,
  getChargerLabel,
  markerImages,
  getMarkerImage,
} from "../../../utils/globalMethods";
import polyline from "@mapbox/polyline";
import { DottedLoader2 } from "../../../utils/lottieLoader/loaderView";
import { FlatList as RNFlatList } from "react-native-gesture-handler";

const CARD_MARGIN = 12;
const cardWidth = screenWidth * 0.85;
const snapInterval = cardWidth + CARD_MARGIN * 2;

const EnrouteChargingStationsScreen = ({ navigation, route }) => {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const [expanded, setExpanded] = useState(false);
  const [showBottomSheet, setshowBottomSheet] = useState(true);
  const [addedStops, setAddedStops] = useState([]);
  const { enrouteStations } = route?.params || [];
  const [mapLayoutCompleted, setMapLayoutCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);
  // console.log("enrouteStations", JSON.stringify(enrouteStations[0]));
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
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const source = {
      latitude: fromDefaultLocation?.latitude,
      longitude: fromDefaultLocation?.longitude,
    };
    const destination = {
      latitude: toDefaultLocation?.latitude,
      longitude: toDefaultLocation?.longitude,
    };

    getRouteBetweenCoordinates(source, destination)
      .then(setCoordinates)
      .catch(console.error);
  }, []);

  const getRouteBetweenCoordinates = async (origin, destination) => {
    setIsLoading(true);
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;
      const apiKey = Key.apiKey;

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${apiKey}&mode=driving&overview=full&steps=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length) {
        let allPoints = [];

        data.routes[0].legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            if (step.polyline) {
              const decodedPoints = polyline.decode(step.polyline.points);
              allPoints = [...allPoints, ...decodedPoints];
            }
          });
        });

        return allPoints.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));
      } else {
        throw new Error("No route found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      return []; // return empty array or null depending on your app's behavior
    } finally {
      setIsLoading(false);
    }
  };

  const [markerList] = useState(enrouteStations || []);
  const [region, setRegion] = useState({
    latitude: fromDefaultLocation.latitude,
    longitude: fromDefaultLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef(null);
  const _scrollView = useRef(null);
  // const mapAnimation = useRef(new Animated.Value(0)).current;
  // const mapIndex = useRef(0);
  const mapAnimation = useRef(new Animated.Value(0)).current;

  const mapIndexRef = useRef(0);
  useEffect(() => {
    if (
      mapLayoutCompleted &&
      mapRef.current &&
      fromDefaultLocation &&
      toDefaultLocation
    ) {
      mapRef.current.fitToCoordinates(
        [fromDefaultLocation, toDefaultLocation],
        {
          edgePadding: { top: 50, right: 50, bottom: 150, left: 50 },
          animated: true,
        }
      );
    }
  }, [mapLayoutCompleted]);

  useEffect(() => {
    const listenerId = mapAnimation.addListener(({ value }) => {
      const index = Math.round(value / snapInterval);

      if (index !== mapIndexRef.current && markerList[index]) {
        mapIndexRef.current = index;
        setSelectedMarkerIndex(index);

        const { coordinates } = markerList[index];
        mapRef.current?.animateToRegion(
          {
            ...coordinates,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          },
          350
        );
      }
    });

    return () => {
      mapAnimation.removeListener(listenerId);
    };
  }, [markerList]);

  const scrollTo = () => {
    if (markerList.length > 0 && _scrollView.current) {
      _scrollView.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  const onMarkerPress = (e, index) => {
    setSelectedMarkerIndex(index);
    const offset = index * snapInterval;
    _scrollView.current?.scrollToOffset({
      offset,
      animated: true,
    });
  };
  const interpolation = markerList.map((_, index) => {
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval,
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
    // console.log("Toggle Stop called with station:", station.id);

    const exists = addedStops.find((stop) => stop.id === station.id);

    if (exists) {
      // console.log("Station exists, removing...");
      setAddedStops((prev) => prev.filter((stop) => stop.id !== station.id));
    } else {
      // console.log("Station does not exist, adding...");
      setAddedStops((prev) => [...prev, station]);
    }
  };

  // Use useEffect to monitor changes to addedStops
  useEffect(() => {
    // console.log("Updated added stops:", addedStops);
  }, [addedStops]);

  const removeStop = (id) => {
    // console.log("Remove Stop called with id:", id);
    debugger;

    const updatedStops = addedStops.filter((stop) => stop?.id !== id);
    // console.log("Updated stops after removal:", updatedStops);
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

  function trimName(threshold, str) {
    if (str.length <= threshold) {
      return str;
    }
    return str.substring(0, threshold) + ".....";
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {markersInfo()}
        {backArrow()}
        {chargingSpotsInfo()}
        {bottomSheet()}
      </View>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <DottedLoader2 />
          {/* <ActivityIndicator size="large" color={Colors.primaryColor} /> */}
        </View>
      )}
    </View>
  );
  function bottomSheet() {
    if (!addedStops || !Array.isArray(addedStops) || addedStops.length === 0)
      return null;

    return (
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
    if (!Array.isArray(addedStops) || addedStops.length === 0) return null;

    return (
      <>
        {addedStops.map((stop, index) => (
          <View key={stop.id} style={styles.stopsContainer}>
            {/* {console.log("stop", stop)} */}
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
                No. of Chargers - {stop.chargers.length}
              </Text>
              <Text style={styles.stopDescription}>
                Address: {trimName(45, stop.address)}
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
      <Animated.FlatList
        ref={_scrollView}
        horizontal
        data={markerList}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        pagingEnabled
        snapToInterval={snapInterval}
        decelerationRate="fast"
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
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
        contentContainerStyle={{ paddingHorizontal: CARD_MARGIN }}
        style={{ paddingVertical: Sizes.fixPadding, height: 134 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.push("ChargingStationDetail", {
                item,
              })
            }
            style={styles.enrouteChargingStationWrapStyle}
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
                <Text numberOfLines={1} style={Fonts.blackColor18SemiBold}>
                  {item?.station_name}
                </Text>
                <Text numberOfLines={1} style={Fonts.grayColor14Medium}>
                  {item?.address}
                </Text>
                <View
                  style={{
                    marginTop: Sizes.fixPadding,
                    ...commonStyles.rowSpaceBetween,
                  }}
                >
                  <View style={commonStyles.rowAlignCenter}>
                    <Text style={Fonts.blackColor16Medium}>
                      {openHourFormatter(
                        item?.open_hours_opening_time,
                        item?.open_hours_closing_time
                      )}
                    </Text>
                  </View>
                  <View style={commonStyles.rowAlignCenter}>
                    <View style={styles.primaryColorDot} />
                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: Sizes.fixPadding,
                        ...Fonts.grayColor14Medium,
                        maxWidth: 150,
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
                  {formatDistance(item?.distanceKm)}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleStop(item)}
                  style={[
                    styles.getDirectionButton,
                    {
                      backgroundColor: addedStops.some(
                        (s) => s?.id === item?.id
                      )
                        ? Colors.orangeColor
                        : Colors.primaryColor,
                    },
                  ]}
                >
                  <Text style={Fonts.whiteColor16Medium}>
                    {addedStops.some((s) => s?.id === item?.id)
                      ? "- Remove Stop"
                      : "+ Add Stop"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }

  function markersInfo() {
    return (
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        onLayout={() => setMapLayoutCompleted(true)}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={setRegion} // Allows zoom update
      >
        {markerList.map((marker, index) => {
          // console.log("Marker:", marker);
          const scaleStyle = {
            transform: [{ scale: interpolation[index].scale }],
          };
          return (
            <Marker
              key={index}
              coordinate={marker?.coordinates}
              onPress={(e) => onMarkerPress(e, index)}
              pinColor="#28692e"
              anchor={{ x: 0.5, y: 0.5 }}
              title={trimName(40, marker?.station_name)}
              description={trimName(40, marker?.address)}
            >
              <Image
                source={getMarkerImage(marker?.vendor?.owner_legal_name)}
                style={{
                  // backgroundColor:"teal",
                  // borderColor:"teal",
                  // borderWidth: 1,
                  width: 70 ,
                  height: 57,
                  transform: [{ scale: index === selectedMarkerIndex ? 1 : 0.8 }],
                }}
                resizeMode="contain"
              />
            </Marker>
          );
        })}

        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeWidth={3}
            strokeColor="rgba(0, 0, 255, 0.5)"
            lineCap="round"
          />
        )}
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
    width: cardWidth,
    marginHorizontal: 12,
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    flexDirection: "row",
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
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
