import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../../constants/styles";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectStations } from "../service/selector";
import Key from "../../../constants/key";
import imageURL from "../../../constants/baseURL";
import { openHourFormatter ,formatDistance} from "../../../utils/globalMethods";
const width = screenWidth;
const cardWidth = width / 1.15;
const SPACING_FOR_CARD_INSET = width * 0.1 - 30;

const ChargingStationMap = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const stations = useSelector(selectStations);
  console.log("stations", stations?.length);

  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  let mapAnimation = new Animated.Value(0);
  let mapIndex = 0;

  const _scrollView = useRef(null);
  useEffect(() => {
    getUserLocation("autoCall");
  }, []);
  
  
  useEffect(() => {
      console.log(" map page rendered");
      mapAnimation.addListener(({ value }) => {
        let index = Math.floor(value / cardWidth + 0.3);
        if (index >= stations?.length) {
          index = stations?.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
  
        clearTimeout(regionTimeout);
  
        const regionTimeout = setTimeout(() => {
          if (mapIndex !== index) {
            mapIndex = index;
            const { coordinates } = stations[index] ?? {}; // Optional chaining
            mapRef.current?.animateToRegion(
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
    }, [mapAnimation, stations]);

    const getUserLocation = async (calledBy) => {
   
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Using default location (Delhi).");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
    
        setRegion({ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        setCurrentLocation({ latitude, longitude });
        reverseGeocode(latitude, longitude);
        scrollTo();
        if (mapRef.current) {
          mapRef.current.animateCamera(
            { center: { latitude, longitude }, zoom: 15 },
            { duration: 0 }
          );
        
          if (stations.length > 0 && calledBy==="autoCall") {
            mapRef.current.fitToCoordinates(
              [
                { latitude, longitude }, // User's location
                stations[0].coordinates   // First station's location
              ],
              {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
              }
            );
          }
        }
      } catch (error) {
        console.error("Location error:", error);
      }
    };
    
    

  const reverseGeocode = async (lat, lng) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Key.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        setSearch(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Reverse geocode error:", error);
    }
  };

  const fetchSuggestions = async (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setSuggestions([]);
      return;
    }
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      text
    )}&key=${Key.apiKey}&components=country:in`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Autocomplete error:", error);
      setSuggestions([]);
    }
  };

  const selectSuggestion = async (placeId, description) => {
    setSuggestions([]);
    setSearch(description);
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${Key.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        
        const { lat, lng } = data.results[0].geometry.location;
        const newRegion = { latitude: lat, longitude: lng, latitudeDelta: 0.03, longitudeDelta: 0.03 };
        setRegion(newRegion);
        const selectedCoord = { latitude: lat, longitude: lng };
        setSelectedLocation(selectedCoord);
        scrollTo();
        if (mapRef.current) {
          mapRef.current.animateCamera({ center: newRegion, zoom: 15 }, { duration: 1000 });
        }
  
        if (mapRef.current && currentLocation && selectedCoord) {
          mapRef.current.fitToCoordinates(
            [
              currentLocation,  // user's current location
              selectedCoord ,
              stations[0].coordinates
            ],
            {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            }
          );
        }
      }
    } catch (error) {
      console.error("Place details error:", error);
    }
  };

  const scrollTo = () => {
    if (stations.length > 0 && _scrollView.current) {
      _scrollView.current.scrollTo({
        x: 0,  // Scroll directly to the start of the first item
        y: 0,
        animated: true
      });
    }
  };
  
  
  

  const interpolation = stations?.map((marker, index) => { // Optional chaining
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
  return (
    <View style={styles.container}>
    <View style={styles.searchContainer}>
  <View style={{ position: 'relative' }}>
    <TextInput
      style={[styles.searchInput, { paddingRight: 35 }]} // extra right padding for icon
      value={search}
      placeholder="Search location..."
      onChangeText={fetchSuggestions}
    />
    {search.length > 0 && (
     <Pressable
     onPress={() => {
       setSearch("");
       setSuggestions([]);
     }}
     style={{
       position: 'absolute',
       right: 10,
       top: '50%',
       transform: [{ translateY: -12 }], // center vertically
     }}
   >
     <Ionicons name="close-circle" size={24} color="gray" />
   </Pressable>
   
    )}
  </View>

  {suggestions.length > 0 && (
    <FlatList
      data={suggestions}
      keyExtractor={(item) => item.place_id}
      style={styles.suggestionList}
      renderItem={({ item }) => (
        <Pressable
          style={styles.suggestionItem}
          onPress={() => selectSuggestion(item.place_id, item.description)}
        >
          <Text>{item.description}</Text>
        </Pressable>
      )}
    />
  )}
</View>


      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        onPress={() => setSuggestions([])}  
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
       
          {stations?.map((marker, index) => { // Optional chaining to prevent errors if stationsList is undefined or null
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
        {currentLocation && (
          <Marker coordinate={currentLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <Image
              source={require("../../../../assets/images/userMarker.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={()=>getUserLocation("button")}>
        <Ionicons name="locate-outline" size={28} color="white" />
      </TouchableOpacity>
    {chargingSpots()}
    </View>
  );
   
function chargingSpots() {
      return (
        <View style={styles.chargingInfoWrapStyle}>
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
          {stations?.map((item, index) => (
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
        </View>
      );
    }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchInput: {
    height: 45,
    borderRadius: 4,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: "gray",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 10,
  },
  suggestionList: {
    backgroundColor: "white",
    maxHeight: 250,
    borderRadius: 4,
    marginTop: 2,
    elevation: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  map: { ...StyleSheet.absoluteFillObject },
  locationButton: {
    position: "absolute",
    bottom: 100,
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
  // cards 
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
  // cards end 
});

export default ChargingStationMap;
