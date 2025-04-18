import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
  Platform,
  FlatList,
} from "react-native";
import {
  Colors,
  Sizes,
  Fonts,
  commonStyles,
  screenWidth,
} from "../../../../constants/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker } from "react-native-maps";
import { Overlay } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { updateStationsChargersConnectorsStatus } from "../../services/crudFunction";
import { selectStation } from "../../services/selector";
import imageURL from "../../../../constants/baseURL";
import { RefreshControl } from 'react-native';
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
//Wifi,Cafe,Restroom,Lodging,Store,Car Care
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

const StationManagement = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef(null);
  const stationId = route.params.station.id;
  const station = useSelector(selectStation).find((s) => s.id === stationId);

  const [showDeleteDialogue, setshowDeleteDialogue] = useState(false);
  const dispatch = useDispatch();
  const [isChargerAvailable, setIsChargerAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  console.log("StationManagement", JSON.stringify(station, null, 2));
  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
  };

  useEffect(() => {
    if (station) {
      console.log("Station changedd");
    }
  }, [station]);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (activeTab !== index) {
      setActiveTab(index);
    }
  };
  //  console.log(station.amenities)

  // const toggleChargerAvailability = (chargerId) => {
  //   setStation((prev) => {
  //     if (prev.status === "Inactive") {
  //       console.log("Station is Inactive — can't toggle charger.");
  //       return prev;
  //     }

  //     return {
  //       ...prev,
  //       chargers: prev.chargers.map((charger) => {
  //         if (charger.charger_id === chargerId) {
  //           const newStatus = charger.status === "Available" ? "Out-Of-Service" : "Available";

  //           const updatedConnectors =
  //             newStatus === "Available"
  //               ? [...charger.connectors] // leave them as they are
  //               : charger.connectors.map((conn) => ({
  //                 ...conn,
  //                 connector_status: "out-of-service",
  //               }));

  //           const updatedCharger = {
  //             ...charger,
  //             status: newStatus,
  //             connectors: updatedConnectors,
  //           };

  //           console.log("Charger after toggle:", updatedCharger);
  //           return updatedCharger;
  //         }
  //         return charger;
  //       }),
  //     };
  //   });
  // };

  // const toggleConnectorAvailability = (chargerId, chargerConnectorId) => {
  //   setStation((prev) => {
  //     if (prev.status === "Inactive") {
  //       console.log("Station is Inactive — can't toggle connector.");
  //       return prev;
  //     }

  //     return {
  //       ...prev,
  //       chargers: prev.chargers.map((charger) => {
  //         if (charger.charger_id === chargerId) {
  //           if (charger.status !== "Available") {
  //             console.log("Charger is not Available — connectors must stay out-of-service.");
  //             return {
  //               ...charger,
  //               connectors: charger.connectors.map((conn) => ({
  //                 ...conn,
  //                 connector_status: "out-of-service",
  //               })),
  //             };
  //           }

  //           return {
  //             ...charger,
  //             connectors: charger.connectors.map((conn) => {
  //               if (conn.charger_connector_id === chargerConnectorId) {
  //                 const newStatus =
  //                   conn.connector_status === "operational" ? "out-of-service" : "operational";

  //                 const updatedConnector = { ...conn, connector_status: newStatus };
  //                 console.log("Connector after toggle:", updatedConnector);
  //                 return updatedConnector;
  //               }
  //               return conn;
  //             }),
  //           };
  //         }
  //         return charger;
  //       }),
  //     };
  //   });
  // };

  const handleDelete = () => {
    console.log("handleDelete Called");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={COLORS.yellow}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };
  function trimName(threshold, str) {
    if (str.length <= threshold) {
      return str;
    }
    return str.substring(0, threshold) + ".....";
  }
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log("Refresh completed!");
    }, 2000); 
  }
  return (
    <View style={styles.container}>
      {/* Header with map background */}
      <View style={styles.header}>
        <Image
          source={
            station.station_images
              ? { uri: imageURL.baseURL + station.station_images }
              : {
                  uri: "https://plus.unsplash.com/premium_photo-1664283228670-83be9ec315e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }
          }
          style={styles.mapBackground}
        />

        <View style={styles.overlay}>
          <View style={styles.communityBadgeAndBack}>
            <MaterialIcons
              name="arrow-back"
              color={Colors.whiteColor}
              size={26}
              onPress={() => {
                navigation.pop();
              }}
            />
            <View style={styles.communityBadge}>
              <Text style={styles.communityText}>Public</Text>
            </View>
          </View>

          <Text style={styles.stationName}>
            {trimName(50, station.station_name)}
          </Text>
          <Text style={styles.stationAddress}>
            {trimName(50, station.address)}
          </Text>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusClosed,
                {
                  color:
                    station.status === "Active"
                      ? "green"
                      : station.status === "Inactive"
                      ? "#FF5722"
                      : station.status === "Planned"
                      ? "blue"
                      : "black", // fallback color
                },
              ]}
            >
              {station.status}
            </Text>

            <Text style={styles.statusTime}>
              • {station.open_hours_opening_time} -{" "}
              {station.open_hours_closing_time}
            </Text>
            <View style={styles.newBadge}>
              <Text style={styles.newText}>4.5 ⭐</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
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
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 2 && styles.activeTabButton]}
          onPress={() => handleTabPress(2)}
        >
          <Text
            style={[styles.tabText, activeTab === 2 && styles.activeTabText]}
          >
            Reviews
          </Text>
          {activeTab === 2 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      <ScrollView
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Charger Tab */}
        {chargerTab(station)}
        {/* Details Tab */}
        {detailTab()}
        {/* Reviews Tab */}
        {reviewsTab()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() => {
            setshowDeleteDialogue(true);
          }}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Delete</Text>
        </TouchableOpacity>
        {/* onPress={() => navigation.navigate("UpdateStation")} */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("UpdateStation", { station })}
        >
          <Text style={styles.submitButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
      {deleteDialogue()}
    </View>
  );
  function chargerTab(station) {
    // Log chargers

    return (
      <ScrollView style={styles.tabContent}>
        {station.chargers.map((charger, index) => (
          <View key={charger.charger_id} style={styles.chargerCard}>
            <View style={styles.titleContainer}>
              <Text style={styles.chargerTitle}>
                {"Charger " + (index + 1)}
              </Text>
              <Switch
                value={charger.status === "Available"}
                onValueChange={() =>
                  dispatch(
                    updateStationsChargersConnectorsStatus({
                      statusType: "charger",
                      status:
                        charger.status === "Available" ? "inactive" : "active",
                      station_id: station.id,
                      charger_id: charger.charger_id,
                    })
                  )
                }
                trackColor={{ false: "#FF8C00", true: COLORS.primary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.chargerSpecs}>
              <Text style={styles.chargerSpecText}>
                Type: {charger.charger_type}
              </Text>
              <Text style={styles.chargerSpecText}>|</Text>
              <Text style={styles.chargerSpecText}>
                Power: {charger.max_power_kw} kW
              </Text>
            </View>

            <View style={styles.connectorContainer}>
              {charger.connectors.map((conn, index) => (
                <View key={index} style={styles.connector}>
                  <View style={styles.connectorType}>
                    <Icon
                      name={
                        connectorIcons[conn.connectorType.description] ||
                        "ev-plug-type1"
                      }
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.connectorTypeText}>
                      {conn.connectorType.description}
                    </Text>
                  </View>
                  <Switch
                    value={conn.connector_status === "operational"} // Use backend enum value
                    onValueChange={() =>
                      dispatch(
                        updateStationsChargersConnectorsStatus({
                          station_id: station.id,
                          statusType: "connector",
                          charger_id: charger.charger_id,
                          connector_id: conn.charger_connector_id,
                          status:
                            conn.connector_status === "operational"
                              ? "inactive"
                              : "active",
                        })
                      )
                    }
                    trackColor={{ false: "#FF8C00", true: COLORS.primary }} // Orange when off, green when on
                    thumbColor={
                      conn.connector_status === "operational"
                        ? "#ffffff"
                        : "#ffffff"
                    } // Thumb color stays white
                  />
                </View>
              ))}
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
              latitude: station.coordinates.latitude,
              longitude: station.coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: station.coordinates.latitude,
                longitude: station.coordinates.longitude,
              }}
              title={station.station_name}
              description={station.address}
            />
          </MapView>
        </View>
        <Text style={styles.sectionTitle}>Address</Text>
        <View style={styles.landmarkContainer}>
          <Text style={styles.landmarkTitle}>{station.address}</Text>
        </View>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {station.amenities.split(",").map((amenityName, index) => {
            const trimmedName = amenityName.trim();
            const iconName = amenityMap[trimmedName] || "help-circle";

            return (
              <View key={index} style={styles.amenityItem}>
                <Icon name={iconName} size={24} color={COLORS.primary} />
                <Text style={styles.connectorTypeText}>{trimmedName}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
  function reviewsTab() {
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
        </View>
        {reviews.map((item) => renderReviewItem({ item }))}
      </ScrollView>
    );
  }

  function renderReviewItem({ item }) {
    return (
      <View style={styles.reviewItem}>
        <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
        <View style={styles.reviewContent}>
          <Text style={styles.reviewName}>{item.name}</Text>
          {renderStars(item.rating)}
          <Text style={styles.reviewText}>{item.comment}</Text>
        </View>
      </View>
    );
  }
  function deleteDialogue() {
    return (
      <Overlay
        isVisible={showDeleteDialogue}
        onBackdropPress={() => setshowDeleteDialogue(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              textAlign: "center",
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginVertical: Sizes.fixPadding * 2.0,
            }}
          >
            Do You Want To Delete?
          </Text>
          <View
            style={{
              alignSelf: "center",
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 2,
              borderColor: "#ff4d4d",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Sizes.fixPadding * 1.5,
            }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={40}
              color="#ff7f50"
            />
          </View>

          <View
            style={{
              ...commonStyles.rowAlignCenter,
              marginTop: Sizes.fixPadding,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowDeleteDialogue(false);
              }}
              style={{
                ...styles.noButtonStyle,
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.blackColor16Medium }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                handleDelete();
                setshowDeleteDialogue(false);
                // handle delete logic here
              }}
              style={{
                backgroundColor: "#ff7f50", // Coral Orange
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
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
    backgroundColor: "rgba(230, 216, 242, 0.6)", // Light purple with opacity
  },
  communityBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
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
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusClosed: {
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginLeft: 8,
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
    width: 60,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 10,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    color: COLORS.accent,
    fontWeight: "bold",
  },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 8,
    lineHeight: 20,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  editButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: "85%",
    padding: 0.0,
    elevation: 0,
  },
  ratingImageStyle: {
    marginTop: Sizes.fixPadding * 1.5,
    width: 70.0,
    height: 60.0,
    resizeMode: "contain",
    alignSelf: "center",
  },
  ratingWrapStyle: {
    ...commonStyles.rowAlignCenter,
    justifyContent: "center",
    marginVertical: Sizes.fixPadding + 5.0,
  },
  dialogYesNoButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,

    padding: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  noButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  yesButtonStyle: {
    borderTopColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
  dialogCancelTextStyle: {
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    textAlign: "center",
    ...Fonts.blackColor18Medium,
  },
});

export default StationManagement;
