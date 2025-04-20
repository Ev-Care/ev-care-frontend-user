import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react"; // ✅ Added useRef
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../../components/myStatusBar";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getEnrouteStations } from "../service/crudFunction";

const EnRouteScreen = ({ navigation, route }) => {
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCoordinate, setPickupCoordinate] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationCoordinate, setDestinationCoordinate] = useState(null);
  const [pickAlert, setPickAlert] = useState(false); // ✅ Added missing state
  const dispatch = useDispatch();
  // 🔥 Store previous data using useRef to avoid losing values
  const prevPickupAddress = useRef("");
  const prevDestinationAddress = useRef("");

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (route.params?.address) {
  //       // console.log("Received Data:", route.params);

  //       if (route.params.addressFor === "pickup") {
  //         setPickupAddress(route.params.address);
  //         setPickupCoordinate(route.params.coordinate);
  //         prevPickupAddress.current = route.params.address; // Store in ref
  //       } else if (route.params.addressFor === "destination") {
  //         setDestinationAddress(route.params.address);
  //         setDestinationCoordinate(route.params.coordinate);
  //         prevDestinationAddress.current = route.params.address; // Store in ref
  //       }
  //     }
  //   }, [route.params])
  // );

  // 🔥 Restore previous values if they exist (to prevent losing data)
  useEffect(() => {
    if (!pickupAddress) setPickupAddress(prevPickupAddress.current);
    if (!destinationAddress) setDestinationAddress(prevDestinationAddress.current);
  }, [pickupAddress, destinationAddress]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {imageView()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {enrouteDescription()}
          {pickupInfo()}
          {destinationInfo()}
          {seeRouteButton()}
        </ScrollView>
        {pickAddressMessage()}
      </View>
    </View>
  );

  function pickAddressMessage() {
    return pickAlert ? (
      <Text style={styles.alertTextStyle}>Please Pick Correct Location!</Text>
    ) : null;
  }

  function seeRouteButton() {
    return (
      <TouchableOpacity
        style={{
          ...commonStyles.button,
          ...styles.seeRouteButtonStyle,
        }}
        onPress={async() => {
          if (pickupAddress && destinationAddress) {

            const enRoutedata = {
              fromLat:pickupCoordinate.latitude,
              fromLng:pickupCoordinate.longitude,
              toLat:destinationCoordinate.latitude,
              toLng:destinationCoordinate.longitude,
              maxDistance: 10,
              
            }
            console.log("enRoutedata:", enRoutedata);
           const response =  await dispatch(getEnrouteStations(enRoutedata));
           if (response?.payload?.code === 200) {
            console.log("response of enroute:", response?.payload?.data);
            const enrouteStations = response?.payload?.data;
            navigation.push("EnrouteChargingStations" ,{enrouteStations,pickupCoordinate :pickupCoordinate, destinationCoordinate: destinationCoordinate});
            
           } else {

            //Add alert here
            Alert.alert(
              "Error",
              "Failed to fetch enroute stations. Please try again later.",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
            
           }
            console.log("response after enroute:", response.payload.data);
          } else {
            setPickAlert(true); // ✅ Corrected function name
            setTimeout(() => {
              setPickAlert(false);
            }, 2000);
          }
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>
          See enroute charging stations
        </Text>
      </TouchableOpacity>
    );
  }

  function destinationInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("PickLocation", { addressFor: "destination" ,setDestinationAddress:setDestinationAddress, setDestinationCoordinate:setDestinationCoordinate });
        }}
        style={{ ...styles.pickPointWrapStyle }}
      >
        <View style={styles.locationIconWrapStyle}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color={Colors.primaryColor}
          />
        </View>
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18Medium }}>
            Pick destination point
          </Text>
          <Text numberOfLines={2} style={{ ...Fonts.grayColor14Medium }}>
            {destinationAddress
              ? destinationAddress
              : "Please pick destination point in google map"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function pickupInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("PickLocation", { addressFor: "pickup" , setPickupAddress:setPickupAddress,setPickupCoordinate:setPickupCoordinate});
        }}
        style={{ ...styles.pickPointWrapStyle, marginTop: Sizes.fixPadding }}
      >
        <View style={styles.locationIconWrapStyle}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color={Colors.primaryColor}
          />
        </View>
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18Medium }}>
            Pick starting point
          </Text>
          <Text numberOfLines={2} style={{ ...Fonts.grayColor14Medium }}>
            {pickupAddress
              ? pickupAddress
              : "Please pick starting point in google map"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function enrouteDescription() {
    return (
      <Text
        style={{
          ...Fonts.grayColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding,
        }}
      >
        Pick starting point & destination point and see how many charging
        stations are coming at that route.
      </Text>
    );
  }

  function imageView() {
    return (
      <ImageBackground
        source={require("../../../../assets/images/chargingStations/charging_station7.png")}
        style={styles.enRouteBgImageStyle}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.22)", "rgba(0, 0, 0, 0.16)"]}
          style={{ width: "100%", height: "100%", justifyContent: "flex-end" }}
        >
          <Text
            style={{
              ...Fonts.whiteColor20SemiBold,
              margin: Sizes.fixPadding * 1.5,
              textAlign: "center",
            }}
          >
            Enroute charging station
          </Text>
        </LinearGradient>
      </ImageBackground>
    );
  }
};

export default EnRouteScreen;

const styles = StyleSheet.create({
  enRouteBgImageStyle: {
    width: "100%",
    height: screenWidth / 1.5,
    resizeMode: "stretch",
  },
  pickPointWrapStyle: {
    ...commonStyles.rowAlignCenter,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    marginBottom: Sizes.fixPadding * 2.0,
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
  alertTextStyle: {
    ...Fonts.whiteColor14Medium,
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 0.0,
    alignSelf: "center",
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    borderRadius: Sizes.fixPadding * 2.0,
    zIndex: 100.0,
    overflow: "hidden",
  },
  seeRouteButtonStyle: {
    padding: Sizes.fixPadding + 4.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding ,
  },
});
