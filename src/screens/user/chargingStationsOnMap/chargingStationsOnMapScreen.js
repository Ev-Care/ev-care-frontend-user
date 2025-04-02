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

const width = screenWidth;
const cardWidth = width / 1.15;
const SPACING_FOR_CARD_INSET = width * 0.1 - 30;

const chargingSpotsList = [
  {
    coordinate: {
      latitude: 28.613939, // Delhi
      longitude: 77.209021,
    },
    id: "1",
    stationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    stationName: "BYD Charging Point",
    stationAddress: "Near Connaught Place",
    rating: 4.7,
    totalStations: 8,
    distance: "4.5 km",
    isOpen: true,
  },
  {
    coordinate: {
      latitude: 19.076090, // Mumbai
      longitude: 72.877426,
    },
    id: "2",
    stationImage: require("../../../../assets/images/chargingStations/charging_station4.png"),
    stationName: "TATA EStation",
    stationAddress: "Near Bandra Kurla Complex",
    rating: 3.9,
    totalStations: 15,
    distance: "5.7 km",
    isOpen: false,
  },
  {
    coordinate: {
      latitude: 13.082680, // Chennai
      longitude: 80.270721,
    },
    id: "3",
    stationImage: require("../../../../assets/images/chargingStations/charging_station3.png"),
    stationName: "HP Charging Station",
    stationAddress: "Near Marina Beach",
    rating: 4.9,
    totalStations: 6,
    distance: "2.1 km",
    isOpen: true,
  },
  {
    coordinate: {
      latitude: 12.971899, // Bengaluru
      longitude: 77.595566,
    },
    id: "4",
    stationImage: require("../../../../assets/images/chargingStations/charging_station6.png"),
    stationName: "VIDA Station V1",
    stationAddress: "Near MG Road",
    rating: 4.2,
    totalStations: 15,
    distance: "3.5 km",
    isOpen: false,
  },
  {
    coordinate: {
      latitude: 18.4663366, // pune
      longitude: 73.8348392,
    },
    id: "5",
    stationImage: require("../../../../assets/images/chargingStations/charging_station2.png"),
    stationName: "BYD Charging Point",
    stationAddress: "Near Park Street",
    rating: 4.7,
    totalStations: 8,
    distance: "4.5 km",
    isOpen: true,
  },
  {
    coordinate: {
      latitude: 17.385045, // Hyderabad
      longitude: 78.486671,
    },
    id: "6",
    stationImage: require("../../../../assets/images/chargingStations/charging_station1.png"),
    stationName: "TATA EStation",
    stationAddress: "Near HITEC City",
    rating: 3.9,
    totalStations: 15,
    distance: "5.7 km",
    isOpen: false,
  },
  
];

const ChargingStationsOnMapScreen = ({ navigation }) => {
  const [markerList] = useState(chargingSpotsList);
  const [currentLocation, setCurrentLocation] = useState(null);
  const _map = useRef();
  const [region,setRegion] = useState({
    latitude: 22.6292757,
    longitude: 88.444781,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  let mapAnimation = new Animated.Value(0);
  let mapIndex = 0;


  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / cardWidth + 0.3);
      if (index >= markerList.length) {
        index = markerList.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { coordinate } = markerList[index];
          _map.current.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  });

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
   
       const { latitude, longitude } = location.coords;
       // console.log("location fetched:", latitude, longitude);
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
 
  const interpolation = markerList.map((marker, index) => {
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
  const latitude = 28.6139;  
  const longitude = 77.2090;
  
 
  const openGoogleMaps = () => {
   const url = Platform.select({
     ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
     android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`
   });
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

  const _scrollView = useRef(null);

  return (
    <View style={{ flex: 1,backgroundColor:Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {markersInfo()}
        {backArrow()}
        {chargingSpotsInfo()}
        {/* Floating Button to Get Current Location */}
              <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
                <Ionicons name="locate-outline" size={28} color="white" />
              </TouchableOpacity>
      </View>
      
    </View>
  );

  function backArrow() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.pop()}
        style={styles.backArrowWrapStyle}
      >
        <MaterialIcons
          name={"arrow-back"}
          size={24}
          color={Colors.blackColor}
          onPress={() => navigation.pop()}
        />
      </TouchableOpacity>
    );
  }

  function markersInfo() {
    return (
      <MapView
      ref={_map}
      style={{ flex: 1 }}
      initialRegion={region}
      provider={PROVIDER_GOOGLE}
    >
      {markerList.map((marker, index) => {
        const scaleStyle = {
          transform: [
            {
              scale: interpolation[index].scale,
            },
          ],
        };
        return (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            onPress={(e) => onMarkerPress(e)}
            anchor={{ x: 0.5, y: 0.5 }} 
            // onPress={() => navigation.push("ChargingStationDetail")}
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
                   style={{ width: 50, height: 50 }}
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
        {markerList.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.push("ChargingStationDetail")}
            key={index}
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
                <Text
                  numberOfLines={1}
                  style={{ ...Fonts.blackColor18SemiBold }}
                >
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
                  onPress={openGoogleMaps}
                  style={styles.getDirectionButton}
                >
                  <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Get Direction
                  </Text>
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
