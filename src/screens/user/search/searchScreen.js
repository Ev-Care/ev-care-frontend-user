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
  Platform,
  Linking,
  Pressable,
  Alert,
  Keyboard,
} from "react-native";
import { DottedLoader2 } from "../../../utils/lottieLoader/loaderView";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../../constants/styles";
import MapView, { Circle, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectStations, selectUserCoordinate } from "../service/selector";
import Key from "../../../constants/key";
import imageURL from "../../../constants/baseURL";
import {
  openHourFormatter,
  formatDistance,
  getChargerLabel,
  openGoogleMaps,
  markerImages,
  getMarkerImage,
  trimName,
} from "../../../utils/globalMethods";
import {
  fetchStationsByLocation,
  searchStationsByLocation,
} from "../service/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";

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

];

const ChargingStationMap = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const stateStations = useSelector(selectStations);
  const [stations, setStations] = useState(stateStations);

  const dispatch = useDispatch();
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  // console.log("stations", stations?.length);
  const userCurrentRegion = useSelector(selectUserCoordinate);
  const [region, setRegion] = useState({
    latitude: userCurrentRegion?.latitude || 28.6139,
    longitude: userCurrentRegion?.longitude || 77.209,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapAnimation = useRef(new Animated.Value(0)).current;

  const mapIndexRef = useRef(0);
  const coords = {
    latitude: userCurrentRegion?.latitude || 28.6139,
    longitude: userCurrentRegion?.longitude || 77.209,
  };
  useEffect(() => {
    const fetchData = async () => {
      await getUserLocation("autoCall");
      await handleSearchedStation({ coords, radius: 10000 });
    };

    fetchData();
  }, []);


  useEffect(() => {
    const listenerId = mapAnimation.addListener(({ value }) => {
      const itemSpacing = cardWidth + 25;
      const index = Math.round(value / itemSpacing);

      if (index !== mapIndexRef.current && stations[index]) {
        mapIndexRef.current = index;
        setSelectedMarkerIndex(index);

        const { coordinates } = stations[index];
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
  }, [stations]);

  const handleSearchedStation = async (data) => {
    try {
      const response = await dispatch(searchStationsByLocation(data));

      if (searchStationsByLocation.fulfilled.match(response)) {
        const allStations = response?.payload?.data;
        console.log("allStations are", allStations.length);
        setStations(allStations);
      } else if (searchStationsByLocation.fulfilled.match(response)) {
        dispatch(
          showSnackbar({ message: "Location didn't fetched", type: "error" })
        );
      }
    } catch (error) {
      // console.log("error = " + error);
      dispatch(
        showSnackbar({
          message: "Something went wrong. Please try again later",
          type: "error",
        })
      );
    }
  };

  const _scrollView = useRef(null);



  const scrollTo = () => {
    if (stations.length > 0 && _scrollView.current) {
      _scrollView.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  const onMarkerPress = (e, index) => {
    setSelectedMarkerIndex(index);

    const offset = index * (cardWidth + 25); // match your FlatList item layout
    _scrollView.current?.scrollToOffset({
      offset,
      animated: true,
    });
  };

  const getUserLocation = async (calledBy) => {
    setIsLoading(true);
    try {
      // console.log('user try to fit inmap');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Using default location (Delhi).");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;


      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setCurrentLocation({ latitude, longitude });
      reverseGeocode(latitude, longitude);
      scrollTo();
      if (mapRef.current) {
        mapRef.current.animateCamera(
          { center: { latitude, longitude }, zoom: 15 },
          { duration: 0 }
        );

        if (stations.length > 0 && calledBy === "autoCall") {
          mapRef.current.fitToCoordinates(
            [
              { latitude, longitude }, // User's location
              stations[0].coordinates, // First station's location
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
    finally {
      setIsLoading(false);
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
    // setIsLoading(true);
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

    setTimeout(() => Keyboard.dismiss(), 100);
    setSearch(description);
    setIsLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${Key.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;

        const coords = {
          latitude: lat,
          longitude: lng,
        };

        await handleSearchedStation({ coords, radius: 10000 });

        const radiusInKm = 10000;
        const oneDegreeOfLatitudeInKm = 111.32;
        const latitudeDelta = radiusInKm / oneDegreeOfLatitudeInKm;
        const longitudeDelta =
          radiusInKm /
          (oneDegreeOfLatitudeInKm * Math.cos(lat * (Math.PI / 180)));

        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta,
          longitudeDelta,
        };

        setRegion(newRegion);
        const selectedCoord = { latitude: lat, longitude: lng };

        setSelectedLocation(selectedCoord);
        scrollTo();

        if (mapRef.current) {
          mapRef.current.animateCamera(
            { center: newRegion, zoom: 10 },
            { duration: 1000 }
          );
        }
      }
    } catch (error) {
      console.error("Place details error:", error);
    } finally { setIsLoading(false); }
  };

  const interpolation = stations?.map((marker, index) => {
    // Optional chaining
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
        <View style={{ position: "relative" }}>
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
                position: "absolute",
                right: 10,
                top: "50%",
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
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.suggestionItem}
                onPress={() =>
                  selectSuggestion(item.place_id, item.description)
                }
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
        customMapStyle={customMapStyle}
        onPress={() => setSuggestions([])}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}

        {selectedLocation && (
          <Circle
            center={selectedLocation}
            radius={50000} // 50 km
            strokeWidth={2}
            strokeColor="rgba(0, 150, 255, 0.5)"
            fillColor="rgba(0, 150, 255, 0.1)"
          />
        )}
        {stations?.map((marker, index) => {
          // Optional chaining to prevent errors if stationsList is undefined or null
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
              coordinate={marker?.coordinates}
              onPress={(e) => onMarkerPress(e, index)}
              title={trimName(40, marker?.station_name)}
              description={trimName(40, marker?.address)}
              anchor={{ x: 0.5, y: 0.5 }}
              pinColor={index === selectedMarkerIndex ? "blue" : "green"} // optional
            >
              <Image
                source={getMarkerImage(marker?.vendor?.owner_legal_name)}
                style={{
                  // backgroundColor:"teal",
                  // borderColor:"teal",
                  // borderWidth: 1,
                  width: 65,
                  height: 55,
                  transform: [{ scale: index === selectedMarkerIndex ? 1 : 0.8 }],
                }}
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

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => getUserLocation("button")}
      >
        <Ionicons name="locate-outline" size={28} color="white" />
      </TouchableOpacity>
      {chargingSpots()}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <DottedLoader2 />
          {/* <ActivityIndicator size="large" color={Colors.primaryColor} /> */}
        </View>
      )}
    </View>
  );

  function chargingSpots() {
    return (
      <View style={styles.chargingInfoWrapStyle}>
        <Animated.FlatList
          ref={_scrollView}
          data={stations}
          horizontal
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardWidth + 25}
          snapToAlignment="center"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: mapAnimation } } }],
            { useNativeDriver: true }
          )}
          getItemLayout={(_, index) => ({
            length: cardWidth + 25,
            offset: (cardWidth + 25) * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => navigation.push("ChargingStationDetail", { item })}
              activeOpacity={0.8}
              style={{
                ...styles.enrouteChargingStationWrapStyle,
                width: cardWidth,
                marginRight: 25, // add margin here
              }}
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
                  <Text
                    numberOfLines={1}
                    style={{ ...Fonts.blackColor18SemiBold }}
                  >
                    {item?.station_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ ...Fonts.grayColor14Medium }}
                  >
                    {item?.address}
                  </Text>

                  <View
                    style={{
                      marginTop: Sizes.fixPadding,
                      ...commonStyles.rowSpaceBetween,
                    }}
                  >
                    <View style={{ ...commonStyles.rowAlignCenter }}>
                      <Text style={{ ...Fonts.blackColor16Medium }}>
                        {openHourFormatter(
                          item?.open_hours_opening_time,
                          item?.open_hours_closing_time
                        )}
                      </Text>
                    </View>
                    <View style={{ ...commonStyles.rowAlignCenter }}>
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
                    {formatDistance(item?.distance_km)}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      openGoogleMaps(
                        item?.coordinates?.latitude,
                        item?.coordinates?.longitude,
                        item?.station_name
                      )
                    }
                    style={styles.getDirectionButton}
                  >
                    <Text style={{ ...Fonts.whiteColor16Medium }}>
                      Get Direction
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
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

    marginBottom: Sizes.fixPadding,
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
});

export default ChargingStationMap;
