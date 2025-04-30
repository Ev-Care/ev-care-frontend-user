import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Snackbar,
  TextInput,
  Linking,
} from "react-native";
import {
  Colors,
  Sizes,
  Fonts,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";
import { Overlay } from "@rneui/themed";
import { addToFavorite } from "../service/stationSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectFavoriteStations, selectUser } from "../service/selector";
import imageURL from "../../../constants/baseURL";
import { getAllFavoriteStations, postFavoriteStation, unFavoriteStation } from "../service/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import { openHourFormatter } from "../../../utils/globalMethods";
// Define colors at the top for easy customization
const COLORS = {
  primary: "#101942",
  accent: "#FF5722", // Orange
  lightPurple: "#E6D8F2",
  white: "#FFFFFF",
  gray: "#8A94A6",
  lightGray: "#F5F7FA",
  red: "#FF3B30",
  green: "#4CAF50",
  yellow: "#FFC107",
  black: "#333333",
};

const { width } = Dimensions.get("window");
// Sample review data
const reviews = [
  {
    id: "1",
    name: "Andrew Anderson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    comment:
      "Lorem ipsum dolor sit amet consectetur. Vitae turpissimus viverra eget pulvinar. Vestibulum ut core eleifend natoque nec. Sed eget gravida phasellus viverra vel sit id. Placerat et lacus tellus. Facilisis et id a eros tincidunt egestas in faucibus viverra.",
  },
  {
    id: "2",
    name: "Peter Jones",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    rating: 3,
    comment:
      "Lorem ipsum dolor sit amet consectetur. Vitae turpissimus viverra eget pulvinar. Vestibulum ut core eleifend natoque nec. Sed eget gravida phasellus viverra vel sit id. Placerat et lacus tellus. Facilisis et id a eros tincidunt egestas in faucibus viverra.",
  },
  {
    id: "3",
    name: "Emily Wood",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4,
    comment:
      "Lorem ipsum dolor sit amet consectetur. Vitae turpissimus viverra eget pulvinar. Vestibulum ut core eleifend natoque nec. Sed eget gravida phasellus viverra vel sit id. Placerat et lacus tellus. Facilisis et id a eros tincidunt egestas in faucibus viverra.",
  },
];

const ChargingStationDetailScreen = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const favStations = useSelector(selectFavoriteStations);
  // const [showSnackBar, setshowSnackBar] = useState(false);
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const station = route?.params?.item;

  if (!station) {
    return <Text>Loading...</Text>; // Handle when station is not available
  }

  const [inFavorite, setInFavorite] = useState(false);
  console.log(station.id);

  useEffect(() => {
    if (favStations && station) {
      const isFavorite = favStations.some((favStation) => favStation.stationId === station.id);
      setInFavorite(isFavorite);
      console.log("stationdetail useEffect called.", inFavorite);
    }
  }, [favStations, station]);


  useEffect(() => {
    console.log("inFavorite changed to", inFavorite)
  }, [inFavorite]);


  const connectorIcons = {
    "CCS-2": "ev-plug-ccs2",
    CHAdeMO: "ev-plug-chademo",
    "Type-2": "ev-plug-type2",
    Wall: "ev-plug-type1",
    GBT: "ev-plug-type2",
  };

  const amenityMap = {
    Restroom: "toilet",
    Cafe: "coffee",
    Wifi: "wifi",
    Store: "cart",
    "Car Care": "car",
    Lodging: "bed",
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (activeTab !== index) {
      setActiveTab(index);
    }
  };

  const openGoogleMaps = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };


  const handleAddToFavorite = async(station) => {

    if (station && !inFavorite) {
      const postFavresponse = await dispatch(postFavoriteStation({ stationId: station.id, userId: user.id }));
      console.log("station favorited ");
     
      await dispatch(getAllFavoriteStations({ user_key: user.user_key }));
      if (postFavoriteStation.fulfilled.match(postFavresponse)) {
        await dispatch(showSnackbar({ message: 'Station added to favorite.', type: "success" }));
        setInFavorite(true);
      } else if (postFavoriteStation.rejected.match(postFavresponse)) {
        await dispatch(showSnackbar({ message: errorMessage || "Failed to favorite station", type: "error" }));
      }

    } else {
      const unFavResponse = await dispatch(unFavoriteStation({ stationId: station.id, userId: user.id }));
      console.log("station unfavorited ");
      
      await dispatch(getAllFavoriteStations({ user_key: user.user_key }));
      if (unFavoriteStation.fulfilled.match(unFavResponse)) {
        await dispatch(showSnackbar({ message: 'Station removed from favorite.', type: "success" }));
        setInFavorite(false);
      } else if (postFavoriteStation.rejected.match(unFavResponse)) {
        await dispatch(showSnackbar({ message: errorMessage || "Failed unfavorite station", type: "error" }));
      }
      // navigation.navigate("FavoriteScreen");
    }
  };

  const trimName = (threshold, str) => {
    if (str?.length <= threshold) {
      return str;
    }
    return str?.substring(0, threshold) + ".....";
  };

  return (
    <View style={styles.container}>
      {/* Header*/}
      {header()}
      {/* Tab Navigation */}
      {navigationTab()}
      {/* Swipeable Content */}
      {SwipeableContent()}

      {/* Bottom Buttons */}
      {buttons()}

    </View>
  );

  function header() {
    if (!station) {
      return <Text>Loading...</Text>; // Or show a fallback UI
    }

    const imageUrl = station?.station_images
      ? { uri: imageURL.baseURL + station.station_images }
      : {
        uri: "https://plus.unsplash.com/premium_photo-1664283228670-83be9ec315e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      };

    return (
      <View style={styles.header}>
        <Image source={imageUrl} style={styles.mapBackground} />

        <View style={styles.overlay}>
          <View style={styles.communityBadgeAndBack}>
            <MaterialIcons
              name="arrow-back"
              color={Colors.whiteColor}
              size={26}
              onPress={() => {
                navigation.pop(); // Check if this works as expected
              }}
            />
            <View style={styles.communityBadge}>
              <Text style={styles.communityText}>Public</Text>
            </View>
          </View>
          <Text style={styles.stationName}>
            {trimName(50, station?.station_name)}
          </Text>
          <Text style={styles.stationAddress}>
            {trimName(50, station?.address)}
          </Text>
          <View
            style={[{ flexDirection: "row", justifyContent: "space-between" }]}
          >
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusClosed,
                  {
                    color: station?.status === "Inactive" ? "#FF5722" : "green",
                  },
                ]}
              >
                {station?.status === "Inactive" ? "Closed" : "Open"}
              </Text>
              <Text style={styles.statusTime}>
              {openHourFormatter(station?.open_hours_opening_time, station?.open_hours_closing_time)} 
              </Text>
              <View style={styles.newBadge}>
                <Text style={styles.newText}>
                  {station.status === "Active"
                    ? "VERIFIED"
                    : station.status === "Planned"
                      ? "PENDING"
                      : ""}
                </Text>
              </View>
            </View>
            <MaterialIcons
              name={inFavorite ? "favorite" : "favorite-border"}
              color={inFavorite ? Colors.redColor : Colors.primaryColor}
              size={35}
              onPress={() => {
                handleAddToFavorite(station);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  function navigationTab() {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 0 && styles.activeTabButton]}
          onPress={() => handleTabPress(0)}
        >
          <Text
            style={[styles.tabText, activeTab === 0 && styles.activeTabText]}
          >
            Charger
          </Text>
          {activeTab === 0 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTabButton]}
          onPress={() => handleTabPress(1)}
        >
          <Text
            style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
          >
            Details
          </Text>
          {activeTab === 1 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

      </View>
    );
  }
  function SwipeableContent() {
    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Charger Tab */}
        {chargerTab()}
        {/* Details Tab */}
        {detailTab()}

      </ScrollView>
    );
  }
  function buttons() {
    return (
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() =>
            openGoogleMaps(
              station?.coordinates?.latitude,
              station?.coordinates?.longitude
            )
          }
          style={styles.directionButton}
        >
          <Text style={styles.directionButtonText}>Get Direction</Text>
        </TouchableOpacity>

      </View>
    );
  }
  function chargerTab() {
    return (
      <ScrollView style={styles.tabContent}>
        {station?.chargers?.map((charger, index) => (
          <View key={charger.charger_id} style={styles.chargerCard}>
            <Text style={styles.chargerTitle}>
              {charger?.name || `Charger ${index + 1}`}
            </Text>
            <View style={styles.chargerSpecs}>
              <Text style={styles.chargerSpecText}>
                Type: {charger?.charger_type || "Unknown Type"}
              </Text>
              <Text style={styles.chargerSpecText}>|</Text>
              <Text style={styles.chargerSpecText}>
                Power: {charger?.max_power_kw || "Unknown Power"} KW
              </Text>
            </View>
            <View style={styles.connector}>
              <View style={[{ flexDirection: "row", alignItems: "center" }]}>
                <Icon
                  name={
                    charger?.connector_type
                      ? connectorIcons[charger?.connector_type]
                      : "ev-plug-type1"
                  }
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.connectorTypeText}>
                  {charger?.connector_type}
                </Text>
              </View>
              <Text
                style={[
                  styles.connectorTypeText,
                  {
                    color:
                      charger?.status === "Available"
                        ? "green"
                        : Colors.darOrangeColor,
                  },
                ]}
              >
                {charger?.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  function detailTab() {
    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: station?.coordinates?.latitude,
              longitude: station?.coordinates?.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: station?.coordinates?.latitude,
                longitude: station?.coordinates?.longitude,
              }}
              title={station?.station_name}
              description={station?.address}
            />
          </MapView>
        </View>
        <Text style={styles.sectionTitle}>Address</Text>
        <View style={styles.landmarkContainer}>
          <Text style={styles.landmarkTitle}>{station?.address}</Text>
        </View>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {station?.amenities?.split(",").map((amenityName, index) => {
            const trimmedName = amenityName.trim();
            let iconName = "help-circle"; // default fallback

            if (trimmedName === "Restroom") {
              iconName = "toilet";
            } else if (trimmedName === "Cafe") {
              iconName = "coffee";
            } else if (trimmedName === "Wifi") {
              iconName = "wifi";
            } else if (trimmedName === "Store") {
              iconName = "cart";
            } else if (trimmedName === "Car Care") {
              iconName = "car";
            } else if (trimmedName === "Lodging") {
              iconName = "bed";
            }

            return (
              <View key={trimmedName} style={styles.amenityItem}>
                <Icon name={iconName} size={24} color={COLORS.primary} />
                <Text style={styles.AminitiesTypeText}>{trimmedName}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }





  function snackBarInfo() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.lightBlackColor }}
        visible={showSnackBar}
        onDismiss={() => setshowSnackBar(false)}
        elevation={0}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          {inFavorite ? "Added to favorite" : "Removed from favorite"}
        </Text>
      </Snackbar>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    height: 200,
    position: "relative",
  },
  mapBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 1,
  },
  overlay: {
    padding: 16,
    height: "100%",
    justifyContent: "flex-end",
    backgroundColor: "rgba(230, 216, 242, 0.44)", // Light purple with opacity
  },
  communityBadgeAndBack: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 16,
    paddingLeft: 0,
    paddingRight: 5,
    paddingVertical: 6,
    borderRadius: 4,
    // backgroundColor:"cyan",
    width: "100%",
    marginLeft: 18,
  },
  communityBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  communityText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 12,
    color: COLORS.black,
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusClosed: {
    color: COLORS.red,
    fontWeight: "bold",
    fontSize: 12,
  },
  statusTime: {
    color: COLORS.black,
    fontSize: 12,
    marginLeft: 4,
  },
  newBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: "bold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.accent,
  },
  tabContent: {
    width,
    padding: 16,
  },
  chargerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  chargerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  chargerSpecs: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  chargerSpecText: {
    fontSize: 12,
    color: COLORS.gray,
    marginRight: 8,
  },
  connectorContainer: {
    marginBottom: 16,
  },
  connector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  connectorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  connectorType: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectorTypeText: {
    fontSize: 10,
  marginLeft:10,
    color: COLORS.gray,
  },
  AminitiesTypeText: {
    fontSize: 10,
    color: COLORS.gray,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  landmarkContainer: {
    marginBottom: 24,
  },
  landmarkTitle: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 8,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  amenityItem: {
    padding:6,
    minWidth: 60,
    minHeight: 60,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 10,
  },

  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 10,
  },

  directionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  directionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },

});

export default ChargingStationDetailScreen;
