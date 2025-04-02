import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
  Text,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Geolocation from "react-native-geolocation-service";
import Key from "../../../constants/key";
import { Colors, Fonts, commonStyles } from "../../../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation,StackActions } from "@react-navigation/native";
import * as Location from "expo-location";

const PickLocationScreen = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
   const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState(""); // Store address
  const [region, setRegion] = useState({
    latitude: 28.6139, // Default to Delhi
    longitude: 77.2090,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
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
      if (mapRef.current) {
        console.log("Animating camera to..:", latitude, longitude);
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
  
  

  // Fetch address from coordinates using Google Maps API
  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Key.apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Handle map tap to select location
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    fetchAddressFromCoordinates(latitude, longitude);
  };

  // Handle search selection
  const handleSearchSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    setRegion(newRegion);
    setSelectedLocation({ latitude: lat, longitude: lng });
    fetchAddressFromCoordinates(lat, lng);

    if (mapRef.current) {
      mapRef.current.animateCamera({ center: newRegion, zoom: 15 }, { duration: 1000 });
    }
  };

  // Submit function
  const handleSubmit = () => {
  
  
    if (!selectedLocation || !address) {
      Alert.alert("No Location Selected", "Please select a location first.");
      return;
    }
    if(route.params?.addressFor==="destination"){
   route.params.setDestinationAddress(address);
   route.params.setDestinationCoordinate(selectedLocation);
  }else if(route.params?.addressFor==="pickup"){
    route.params.setPickupAddress(address);
    route.params.setPickupCoordinate(selectedLocation);
  }
  else{
    route.params.setAddress(address);
  }
    // Replace current screen with Enroute instead of stacking
    navigation.dispatch(StackActions.pop(1));
    // navigation.pop("Enroute", {
    //   coordinate: selectedLocation,
    //   address: address,
    //   addressFor: route.params?.addressFor || "default",
    // });
  
    // console.log("Navigating back...");
  };
  
  
  
  
  
  
  

  return (
    <View style={styles.container}>
      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Search Location..."
        fetchDetails={true}
        onPress={handleSearchSelect}
        query={{ key: Key.apiKey, language: "en" }}
        styles={{ container: styles.searchContainer, textInput: styles.searchInput }}
      />

      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={false}  
        showsMyLocationButton={false}  
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
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

      {/* Display Selected Address */}
      {address ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      ) : null}

      {/* Current Location Button */}
      <TouchableOpacity style={styles.currentLocationButton} onPress={getUserLocation}>
        <Ionicons name="locate-outline" size={28} color="black" />
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={[commonStyles.button, styles.submitButton]} onPress={handleSubmit}>
        <Text style={Fonts.whiteColor18Medium}>Select Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchInput: {
    height: 50,
    borderRadius: 4,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: "gray",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 4,
    padding: 10,
    alignItems: "center",
    elevation: 5,
  },
  addressText: {
    fontSize: 16,
    color: "black",
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
  currentLocationButton: {
    position: "absolute",
    bottom: 150,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default PickLocationScreen;
//correct it as u are saying