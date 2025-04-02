import React, { useState, useEffect, useRef } from "react";
import { View,Image, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Alert, Platform, PermissionsAndroid } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { Ionicons } from "@expo/vector-icons"; 
// import {Colors} from " ../../../src/constants/styles";
import { useNavigation } from "@react-navigation/native";
import {Linking} from "react-native";
import * as Location from "expo-location";

const chargingStations = [
  { id: 1, name: "Delhi EV Station", place: "Connaught Place, Delhi", latitude: 28.6353, longitude: 77.2250 },
  { id: 2, name: "Mumbai Charge Hub", place: "Bandra, Mumbai", latitude: 19.0590, longitude: 72.8295 },
  { id: 3, name: "Bangalore Supercharge", place: "MG Road, Bangalore", latitude: 12.9716, longitude: 77.5946 },
  { id: 4, name: "Chennai Power Station", place: "T Nagar, Chennai", latitude: 13.0827, longitude: 80.2707 },
  { id: 5, name: "Kolkata Fast Charger", place: "Park Street, Kolkata", latitude: 22.5550, longitude: 88.3500 },
];

const ChargingStationMap = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [search, setSearch] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [permission, setPermission] = useState("");
  
  const [currentLocation, setCurrentLocation] = useState(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        getUserLocation();
      } else {
        console.log("Map reference is not ready yet");
      }
    }, 500); 
  
    return () => clearTimeout(timeout); 
  }, []);

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
  
      // ✅ Update state instantly
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
  
      setCurrentLocation({ latitude, longitude });
  
      // ✅ Animate camera IMMEDIATELY without waiting for state update
      if (mapRef.current) {
        console.log("Animating camera to:", latitude, longitude);
        mapRef.current.animateCamera(
          {
            center: { latitude, longitude },
            zoom: 15, // Adjust zoom level as needed
          },
          { duration: 0 }
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
  
  

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const results = chargingStations.filter((station) =>
        station.name.toLowerCase().includes(text.toLowerCase()) ||
        station.place.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStations(results);
    } else {
      setFilteredStations([]);
    }
  };

  const handleSelectStation = (station) => {
    setRegion({
      latitude: station.latitude,
      longitude: station.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
    mapRef.current.animateToRegion({
      latitude: station.latitude,
      longitude: station.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }, 1000);
    setFilteredStations([]);
    setSearch(station.name);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search for charging stations..."
        value={search}
        onChangeText={handleSearch}
      />
      {filteredStations.length > 0 && (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.id.toString()}
          style={styles.suggestionList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectStation(item)}>
              <Text>{item.name} - {item.place}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      
      <MapView
  ref={mapRef}
  style={styles.map}
  region={region}
  showsUserLocation={false}  // Hides default current location marker
  showsMyLocationButton={false}  // Hides default location button
>
  {/* Charging Stations Markers */}
  {chargingStations.map((station, index) => (
    <Marker
      key={station.id}
      coordinate={{ latitude: station.latitude, longitude: station.longitude }}
      pinColor={index % 2 === 0 ? "#101942" : "green"}
      onPress={() => navigation.navigate("ChargingStationDetail")}
    />
  ))}

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
  
      {/* Floating Button to Get Current Location */}
      <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
        <Ionicons name="locate-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 
    searchBox: {
      position: "absolute",
      top: 40,
      left: 10,
      right: 10,
      backgroundColor: "white",
      padding: 14,
      borderRadius: 6,
      borderWidth: 0.5,
      borderColor: "gray",
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 2, height: 4 },
      shadowRadius: 6,
      elevation: 10,
      zIndex: 1,
    },
  
  suggestionList: {
    position: "absolute",
    top: 90,
    left: 10,
    right: 10,
    backgroundColor: "white",
    maxHeight: 150,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
