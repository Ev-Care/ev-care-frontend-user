import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Platform ,
  Linking,
  TouchableOpacity,
} from "react-native";


import React, { useState, createRef, useEffect, useRef } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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

const width = screenWidth;
const cardWidth = width / 1.15;
const SPACING_FOR_CARD_INSET = width * 0.1 - 30;

const chargingSpotsList = [
  {
    coordinate: {
      latitude: 22.6181,
      longitude: 88.456747,
    },
    id: "1",
    stationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    stationName: "BYD Charging Point",
    stationAddress: "Near shell petrol station",
    rating: 4.7,
    totalStations: 8,
    distance: "4.5 km",
    isOpen: true,
  },
  {
    coordinate: {
      latitude: 22.6345648,
      longitude: 88.4377279,
    },
    id: "2",
    stationImage: require("../../../../assets/images/chargingStations/charging_station4.png"),
    stationName: "TATA EStation",
    stationAddress: "Near orange business hub",
    rating: 3.9,
    totalStations: 15,
    distance: "5.7 km",
    isOpen: false,
  },
  {
    coordinate: {
      latitude: 22.616357,
      longitude: 88.442317,
    },
    id: "3",
    stationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    stationName: "HP Charging Station",
    stationAddress: "Near ananta business park",
    rating: 4.9,
    totalStations: 6,
    distance: "2.1 km",
    isOpen: true,
  },
  {
    coordinate: {
      latitude: 22.6341137,
      longitude: 88.4497463,
    },
    id: "4",
    stationImage: require("../../../../assets/images/chargingStations/charging_station4.png"),
    stationName: "VIDA Station V1",
    stationAddress: "Near opera street",
    rating: 4.2,
    totalStations: 15,
    distance: "3.5 km",
    isOpen: false,
  }, 
];



const EnrouteChargingStationsScreen = ({ navigation, route }) => {
  const fromDefaultLocation = {
    latitude: route.params?.pickupCoordinate?.latitude || 0,
    longitude: route.params?.pickupCoordinate?.longitude || 0,
  };

  const toDefaultLocation = {
    latitude: route.params?.destinationCoordinate?.latitude || 0,
    longitude: route.params?.destinationCoordinate?.longitude || 0,
  };

  const [markerList] = useState(chargingSpotsList); // Declared already
  const [region, setRegion] = useState({
    latitude: fromDefaultLocation.latitude,
    longitude: fromDefaultLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const _map = useRef(null);
  const _scrollView = useRef(null);
  const mapAnimation = useRef(new Animated.Value(0)).current;
  const mapIndex = useRef(0);

  useEffect(() => {
    if (_map.current) {
      _map.current.animateToRegion(
        {
          latitude: fromDefaultLocation.latitude,
          longitude: fromDefaultLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  }, []);

  useEffect(() => {
    const listener = mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / cardWidth + 0.3);
      index = Math.max(0, Math.min(index, markerList.length - 1));

      if (mapIndex.current !== index) {
        mapIndex.current = index;
        const { coordinate } = markerList[index];

        _map.current?.animateToRegion(
          {
            ...coordinate,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          },
          350
        );
      }
    });

    return () => {
      mapAnimation.removeListener(listener);
    };
  }, [mapAnimation, markerList, region]);

  const interpolation = markerList.map((marker, index) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];

    return {
      scale: mapAnimation.interpolate({
        inputRange,
        outputRange: [1, 1.5, 1],
        extrapolate: "clamp",
      }),
    };
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
  const onMarkerPress = (e) => {
    const markerID = e.nativeEvent.id || 0;
    let x = markerID * cardWidth + markerID * 20;

    if (Platform.OS === "ios") {
      x -= SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x, y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {markersInfo()}
        {backArrow()}
        {chargingSpotsInfo()}
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
        <MaterialIcons name="arrow-back" size={24} color={Colors.blackColor} />
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
        onRegionChangeComplete={setRegion} // Allows zoom update
      >
        {markerList.map((marker, index) => {
          const scaleStyle = { transform: [{ scale: interpolation[index].scale }] };
          return (
            <Marker 
            key={index} 
            coordinate={marker.coordinate} 
            onPress={onMarkerPress}
            pinColor="#28692e" 
          />
            
          );
        })}

        <MapViewDirections
          origin={fromDefaultLocation}
          destination={toDefaultLocation}
          apikey={Key.apiKey}
          strokeColor={Colors.primaryColor}
          strokeWidth={3}
        />

        <Marker coordinate={fromDefaultLocation} pinColor="blue" />
        <Marker coordinate={toDefaultLocation} pinColor="red" />
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

export default EnrouteChargingStationsScreen;

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
    width: 45.0,
    height: 45.0,
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
});
