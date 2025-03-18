import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenHeight,
  screenWidth,
} from "../../constants/styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Key from "../../constants/key";
import { Input } from "@rneui/themed";
import MyStatusBar from "../../components/myStatusBar";

const ASPECT_RATIO = screenWidth / screenHeight;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const PickLocationScreen = ({ navigation, route }) => {
  const [currentmarker, setCurrentMarker] = useState({
    latitude: LATITUDE - SPACE,
    longitude: LONGITUDE - SPACE,
  });

  const [address, setAddress] = useState("San Fransisco");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});    
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1, justifyContent: "center" }}>
        {mapView()}
        {searchFieldWithBackArrow()}
        <View style={styles.footer}>
          {locationInfo()}
          {pickLocationButton()}
        </View>
      </View>
    </View>
  );

  function locationInfo() {
    return (
      <View style={{ ...styles.locationInfoWrapStyle }}>
        <View style={styles.locationIconWrapStyle}>
          <MaterialIcons
            name="location-pin"
            size={17}
            color={Colors.primaryColor}
          />
        </View>
        <Text
          numberOfLines={2}
          style={{
            marginLeft: Sizes.fixPadding,
            flex: 1,
            ...Fonts.blackColor16Medium,
          }}
        >
          {address}
        </Text>
      </View>
    );
  }

  function pickLocationButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate({
            name: "Enroute",
            params: { address: address, addressFor: route.params.addressFor },
            merge: true,
          });
        }}
        style={{
          ...commonStyles.button,
          padding: Sizes.fixPadding,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Pick this location</Text>
      </TouchableOpacity>
    );
  }

  async function setTheMarkerAccordingSearch({ address }) {
    let response = await Location.geocodeAsync(address);
    const userSearchLocation = {
      latitude: response[0].latitude,
      longitude: response[0].longitude,
    };
    setCurrentMarker(userSearchLocation);
    getAddress({ location: userSearchLocation });
  }

  function searchFieldWithBackArrow() {
    return (
      <View style={{ ...styles.searchFieldWithBackArrowWrapStyle }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.pop()}
          style={styles.backArrowWrapper}
        >
          <MaterialIcons
            name={"arrow-back"}
            size={24}
            color={Colors.blackColor}
          />
        </TouchableOpacity>

        <View style={{ ...styles.searchFieldWrapStyle }}>
          <Ionicons
            name="search"
            color={Colors.grayColor}
            size={20}
            style={{ marginTop: Sizes.fixPadding - 3.0 }}
          />
          <GooglePlacesAutocomplete
            placeholder={"Search location here"}
            onPress={(data) => {
              setSearch(data.description);
              setTheMarkerAccordingSearch({ address: data.description });
            }}
            styles={{ textInput: { height: 40 } }}
            query={{
              key: Key.apiKey,
              language: "en",
            }}
            textInputProps={{
              InputComp: Input,
              value: search,
              onChangeText: (value) => {
                setSearch(value);
              },
              inputContainerStyle: { borderBottomWidth: 0.0, height: 40.0 },
              inputStyle: { ...Fonts.blackColor16Medium },
              containerStyle: { marginLeft: -Sizes.fixPadding, height: 40.0 },
              selectionColor: Colors.primaryColor,
            }}
          />
          {search ? (
            <MaterialIcons
              name="close"
              size={20}
              color={Colors.grayColor}
              style={{ marginTop: Sizes.fixPadding - 3.0 }}
              onPress={() => {
                setSearch("");
              }}
            />
          ) : null}
        </View>
      </View>
    );
  }

  function mapView() {
    return (
      <MapView
        style={{ height: "100%" }}
        region={{
          latitude: currentmarker.latitude,
          longitude: currentmarker.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={currentmarker}
          onDragEnd={(e) => {
            setCurrentMarker(e.nativeEvent.coordinate);
            getAddress({ location: e.nativeEvent.coordinate });
          }}
          draggable
        >
          <Image
            source={require("../../assets/images/icons/marker2.png")}
            style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
          />
        </Marker>
      </MapView>
    );
  }

  async function getAddress({ location }) {
    var streetNo = "";
    var street = "";
    var district = "";
    var postalCode = "";
    var city = "";
    var region = "";
    var country = "";
    let response = await Location.reverseGeocodeAsync(location);
    for (let item of response) {
      if (item.streetNumber != null) {
        streetNo = `${item.streetNumber} `;
      }
      if (item.street != null) {
        street = `${item.street}, `;
      }
      if (item.district != null) {
        district = `${item.district}, `;
      }
      if (item.postalCode != null) {
        postalCode = `${item.postalCode}, `;
      }
      if (item.city != null) {
        city = `${item.city}, `;
      }
      if (item.region != null) {
        region = `${item.region}, `;
      }
      if (item.country != null) {
        country = `${item.country}`;
      }

      let address = `${streetNo}${street}${district}${postalCode}${city}${region}${country}`;
      setAddress(address);
    }
  }
};

export default PickLocationScreen;

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
  },
  backArrowWrapper: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    justifyContent: "center",
    ...commonStyles.shadow,
  },
  searchFieldWithBackArrowWrapStyle: {
    position: "absolute",
    top: 0.0,
    left: 0.0,
    right: 0.0,
    margin: Sizes.fixPadding * 2.0,
    ...commonStyles.rowAlignCenter,
    zIndex: 100,
  },
  locationInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    justifyContent: "center",
    ...commonStyles.rowAlignCenter,
    ...commonStyles.shadow,
  },
  locationIconWrapStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  searchFieldWrapStyle: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding - 6.0,
    marginLeft: Sizes.fixPadding,
    ...commonStyles.shadow,
  },
});
