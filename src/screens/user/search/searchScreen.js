import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectStations } from "../service/selector";
import Key from "../../../constants/key";
// const stations1 = [
//   {
//     owner_id: 7,
//     station_name: "Tesla EV India",
//     address: "Rajstan india",
//     coordinates: {
//       latitude: 18.4663572,
//       longitude: 73.8348122,
//     },
//     amenities: "restroom,wifi,store, car care,lodging",
//     rate: null,
//     rate_type: null,
//     station_images: null,
//     additional_comment: null,
//     distance_km:5000, //check it
//     open_hours_opening_time: "00:00:00",
//     open_hours_closing_time: "23:59:59",
//     id: 2,
//     status: "Planned",
//     created_at: "2025-04-21T02:23:19.671Z",
//     update_at: "2025-04-21T02:23:19.671Z",
//     updated_by: 0,
//     chargers: [
//       {
//         charger_type: "AC",
//         max_power_kw: 60,
//         station: {
//           id: 2,
//           owner_id: 7,
//           station_name: "Tesla EV India",
//           address: "Rajstan india",
//           coordinates: {
//             latitude: 18.4745984,
//             longitude: 73.8197504,
//           },
//           amenities: "restroom,wifi,store, car care,lodging",
//           rate: null,
//           rate_type: null,
//           station_images: null,
//           additional_comment: null,
//           open_hours_opening_time: "00:00:00",
//           open_hours_closing_time: "23:59:59",
//           status: "Planned",
//           created_at: "2025-04-21T02:23:19.671Z",
//           update_at: "2025-04-21T02:23:19.671Z",
//           updated_by: 0,
//         },
//         charger_id: 3,
//         status: "Available",
//         created_at: "2025-04-21T02:23:19.760Z",
//         update_at: "2025-04-21T02:23:19.760Z",
//         updated_by: 0,
//         connectors: [
//           {
//             connector_status: "operational",
//             charger: {
//               charger_id: 3,
//               charger_type: "AC",
//               max_power_kw: 60,
//               status: "Available",
//               created_at: "2025-04-21T02:23:19.760Z",
//               update_at: "2025-04-21T02:23:19.760Z",
//               updated_by: 0,
//               station: {
//                 id: 2,
//                 owner_id: 7,
//                 station_name: "Tesla EV India",
//                 address: "Rajstan india",
//                 coordinates: {
//                   latitude: 18.4745984,
//                   longitude: 73.8197504,
//                 },
//                 amenities: "restroom,wifi,store, car care,lodging",
//                 rate: null,
//                 rate_type: null,
//                 station_images: null,
//                 additional_comment: null,
//                 open_hours_opening_time: "00:00:00",
//                 open_hours_closing_time: "23:59:59",
//                 status: "Planned",
//                 created_at: "2025-04-21T02:23:19.671Z",
//                 update_at: "2025-04-21T02:23:19.671Z",
//                 updated_by: 0,
//               },
//             },
//             connectorType: {
//               connector_type_id: 1,
//               max_power_kw: "60.00",
//               description: "CCS-2",
//             },
//             charger_connector_id: 2,
//           },  
//         ],
//       },
//     ],
//   },
// ];
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

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
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
      if (mapRef.current) {
        mapRef.current.animateCamera({ center: { latitude, longitude }, zoom: 15 }, { duration: 0 });
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
        setSelectedLocation({ latitude: lat, longitude: lng });
        if (mapRef.current) {
          mapRef.current.animateCamera({ center: newRegion, zoom: 15 }, { duration: 1000 });
        }
      }
    } catch (error) {
      console.error("Place details error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          placeholder="Search location..."
          onChangeText={fetchSuggestions}
        />
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
        {stations?.length > 0 && stations.map((item) => (
          <Marker
            key={item?.id}
            coordinate={{
              latitude: item?.coordinates?.latitude ?? 0,
              longitude: item?.coordinates?.longitude ?? 0,
            }}
            onPress={() => navigation.navigate("ChargingStationDetail", { item })}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../../../assets/images/stationMarker.png")}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </View>
          </Marker>
        ))}
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

      <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
        <Ionicons name="locate-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
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
});

export default ChargingStationMap;
