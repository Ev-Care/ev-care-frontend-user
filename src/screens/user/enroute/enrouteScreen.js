import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  Pressable,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Key from "../../../constants/key";
import { Colors, Fonts, commonStyles } from "../../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getEnrouteStations } from "../service/crudFunction";
import { DottedLoader2 } from "../../../utils/lottieLoader/loaderView";
import { selectUserCoordinate } from "../service/selector";
const EnRouteScreen = () => {

  const mapRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const userCurrentRegion = useSelector(selectUserCoordinate);
  //  console.log('user current region ', userCurrentRegion);

  const [region, setRegion] = useState({
    latitude: userCurrentRegion?.latitude || 28.6139,
    longitude: userCurrentRegion?.longitude || 77.209,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [activeInput, setActiveInput] = useState(null);
  const [sourceText, setSourceText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [sourceCoordinate, setSourceCoordinate] = useState(null);
  const [destinationCoordinate, setDestinationCoordinate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getUserLocation("source");
  }, []);

  const getUserLocation = async (target) => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Using default location (Delhi).");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const address = await fetchAddressFromCoordinates(latitude, longitude);

      if (target === "source") {
        setSourceCoordinate({ latitude, longitude });
        setSourceText(address);
      } else if (target === "destination") {
        setDestinationCoordinate({ latitude, longitude });
        setDestinationText(address);
      }
    
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: { latitude, longitude },
          zoom: 15,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddressFromCoordinates = async (lat, lng) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Key.apiKey}`
      );
      const data = await response.json();
      return data.results[0]?.formatted_address || "";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (text, setter) => {
    setter(text);
    if (!text.trim()) {
      setter === setSourceText
        ? setSourceSuggestions([])
        : setDestinationSuggestions([]);
      return;
    }
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text
      )}&key=${Key.apiKey}&components=country:in`;
      const response = await fetch(url);
      const data = await response.json();
      setter === setSourceText
        ? setSourceSuggestions(data.predictions || [])
        : setDestinationSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  const selectPlace = async (placeId, description, type) => {
    setIsLoading(true);
    type === "source"
      ? setSourceSuggestions([])
      : setDestinationSuggestions([]);

    type === "source"
      ? setSourceText(description)
      : setDestinationText(description);

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${Key.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const position = { latitude: lat, longitude: lng };
        if (type === "source") {
          setSourceCoordinate(position);
        } else {
          setDestinationCoordinate(position);
        }
        mapRef.current?.animateCamera({
          center: position,
          zoom: 14,
        });
      }
    } catch (error) {
      console.error("Place details error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = async (event) => {
    setIsLoading(true);
    try {
      if (activeInput === null) {
        Alert.alert("Error", "Please select any Input first.");
        return;
      }

      const { latitude, longitude } = event.nativeEvent.coordinate;
      const address = await fetchAddressFromCoordinates(latitude, longitude);

      if (activeInput === "source") {
        setSourceCoordinate({ latitude, longitude });
        setSourceText(address);
      } else if (activeInput === "destination") {
        setDestinationCoordinate({ latitude, longitude });
        setDestinationText(address);
      }

      setSourceSuggestions([]);
      setDestinationSuggestions([]);
      const position = { latitude: latitude, longitude: longitude };
      mapRef.current?.animateCamera({
        center: position,
        zoom: 14,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sourceCoordinate || !destinationCoordinate) {
      Alert.alert("Error", "Please select both source and destination.");
      return;
    }

    setIsLoading(true);

    try {
      const enRoutedata = {
        fromLat: sourceCoordinate.latitude,
        fromLng: sourceCoordinate.longitude,
        toLat: destinationCoordinate.latitude,
        toLng: destinationCoordinate.longitude,
        maxDistance: 50,
      };

      const response = await dispatch(getEnrouteStations(enRoutedata));

      if (response?.payload?.code === 200) {
        // console.log("response of enroute:", response?.payload?.data);
        const enrouteStations = response?.payload?.data;

        navigation.push("EnrouteChargingStations", {
          enrouteStations,
          pickupCoordinate: sourceCoordinate,
          destinationCoordinate: destinationCoordinate,
          pickupAddress: sourceText,
          destinationAddress: destinationText,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View
          style={[
            styles.inputWrapper,
            activeInput === "source" && {
              borderColor: Colors.primaryColor,
              borderWidth: 2,
            },
          ]}
        >
          <TextInput
            placeholder="Source Location"
            value={sourceText}
            onFocus={() => {
              setActiveInput("source");
              mapRef.current?.animateCamera({
                center: sourceCoordinate,
                zoom: 14,
              });
            }}
            onChangeText={(text) => fetchSuggestions(text, setSourceText)}
            style={[styles.input]}
            placeholderTextColor="#888"
          />
          {!sourceText.length > 0 ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => getUserLocation("source")}
            >
              <Ionicons name="locate" size={20} color={Colors.primaryColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                setSourceText("");
                setSourceCoordinate(null);
                setSourceSuggestions([]);
              }}
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {sourceSuggestions.length > 0 && (
          <FlatList
            data={sourceSuggestions}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.suggestionItem}
                onPress={() =>
                  selectPlace(item.place_id, item.description, "source")
                }
              >
                <Text>{item.description}</Text>
              </Pressable>
            )}
          />
        )}

        <View
          style={[
            styles.inputWrapper,
            activeInput === "destination" && {
              borderColor: Colors.primaryColor,
              borderWidth: 2,
            },
          ]}
        >
          <TextInput
            placeholder="Destination Location"
            value={destinationText}
            onFocus={() => {
              setActiveInput("destination");
              mapRef.current?.animateCamera({
                center: destinationCoordinate,
                zoom: 14,
              });
            }}
            onChangeText={(text) => fetchSuggestions(text, setDestinationText)}
            style={[styles.input]}
            placeholderTextColor="#888"
          />
          {!destinationText > 0 ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => getUserLocation("destination")}
            >
              <Ionicons name="locate" size={20} color={Colors.primaryColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                setDestinationText("");
                setDestinationCoordinate(null);
                setDestinationSuggestions([]);
              }}
            >
              <Ionicons name="close" size={20} color={Colors.primaryColor} />
            </TouchableOpacity>
          )}
        </View>

        {destinationSuggestions.length > 0 && (
          <FlatList
            data={destinationSuggestions}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.suggestionItem}
                onPress={() =>
                  selectPlace(item.place_id, item.description, "destination")
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
        onPress={(event) => handleMapPress(event, activeInput)}
      >
        {sourceCoordinate && (
          <Marker coordinate={sourceCoordinate} pinColor="blue" />
        )}

        {destinationCoordinate && (
          <Marker coordinate={destinationCoordinate} pinColor="red" />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => getUserLocation("source")}
      >
        <Ionicons name="locate-outline" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[commonStyles.button, styles.submitButton]}
        onPress={handleSubmit}
      >
        <Text style={Fonts.whiteColor18Medium}>View Stations On Route</Text>
        {/* <Text style={Fonts.whiteColor18Medium}>View Route</Text> */}
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <DottedLoader2 />
          {/* <ActivityIndicator size="large" color={Colors.primaryColor} /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrapper: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 2,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 6,
    paddingHorizontal: 10,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 14,
    color: "#000",
  },
  suggestionList: {
    backgroundColor: "white",
    maxHeight: 200,
    borderRadius: 4,
    elevation: 5,
    marginBottom: 8,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  submitButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 4,
    padding: 15,
    alignItems: "center",
    elevation: 5,
  },
});

export default EnRouteScreen;
