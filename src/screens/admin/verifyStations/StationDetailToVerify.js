import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
   ActivityIndicator,
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";
import { Overlay } from "@rneui/themed";
import imageURL from "../../../constants/baseURL";
import {
  approveStation,
  fetchAllPendingStation,
} from "../services/crudFunctions";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import { useDispatch } from "react-redux";
import {
  formatDistance,
  openHourFormatter,
} from "../../../utils/globalMethods";

// import imageURL from "../../../constants/baseURL";
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

const StationDetailToVerify = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSnackBar, setshowSnackBar] = useState(false);
  const [showRejectDialogue, setshowRejectDialogue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApproveDialogue, setshowApproveDialogue] = useState(false);
  const scrollViewRef = useRef(null);
  const station = route?.params?.item;
  const dispatch = useDispatch();
  if (!station) {
    return <Text>Loading...</Text>; // Handle when station is not available
  }

  const connectorIcons = {
    "CCS-2": "ev-plug-ccs2",
    CHAdeMO: "ev-plug-chademo",
    "Type-2": "ev-plug-type2",
    Wall: "ev-plug-type1",
    GBT: "ev-plug-type2",
  };

  //   const amenityMap = {
  //     Restroom: "toilet",
  //     Cafe: "coffee",
  //     Wifi: "wifi",
  //     Store: "cart",
  //     "Car Care": "car",
  //     Lodging: "bed",
  //   };

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


  const trimName = (threshold, str) => {
    if (str?.length <= threshold) {
      return str;
    }
    return str?.substring(0, threshold) + ".....";
  };

  const handleReject = async () => {
    console.log("handle Reject Called");
    await dispatch(
      showSnackbar({
        message: "This service is in under development.",
        type: "error",
      })
    );
  };
  const handleApprove = async () => {
    console.log("in approve");
    setIsLoading(true);
  
    try {
      const approvedResponse = await dispatch(approveStation(station?.id));
      console.log("in approve fff");
  
      if (approveStation.fulfilled.match(approvedResponse)) {
        console.log("in approve fulfill");
  
        const pendingStationResponse = await dispatch(fetchAllPendingStation());
        console.log("in approve fulfill");
  
        if (fetchAllPendingStation.fulfilled.match(pendingStationResponse)) {
          await dispatch(
            showSnackbar({
              message: "Station approved successfully.",
              type: "success",
            })
          );
          navigation.goBack();
        } else if (
          fetchAllPendingStation.rejected.match(pendingStationResponse)
        ) {
          await dispatch(
            showSnackbar({
              message: "Failed to get all pending station.",
              type: "error",
            })
          );
        }
      } else if (approveStation.rejected.match(approvedResponse)) {
        await dispatch(
          showSnackbar({ message: "Failed to approve station.", type: "error" })
        );
      }
    } finally {
      setIsLoading(false);
    }
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
      {/* reject dialog */}
      {rejectDialogue()}
      {approveDialogue()}
      { loadingDialog()}
      {/* Snackbar for feedback */}
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
                {openHourFormatter(
                  station?.open_hours_opening_time,
                  station?.open_hours_closing_time
                )}
              </Text>
              <View style={styles.newBadge}>
                <Text style={styles.newText}>New</Text>
              </View>
            </View>
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
          onPress={() => {
            setshowRejectDialogue(true);
          }}
          style={styles.rejectButton}
        >
          <Text style={styles.approveButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setshowApproveDialogue(true);
          }}
          style={styles.approveButton}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
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
              Power:⚡ {charger?.max_power_kw || "Unknown Power"} KW
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
                <Text style={[styles.connectorTypeText,{fontWeight:"700",fontSize:12}]}>
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
  function rejectDialogue() {
    return (
      <Overlay
        isVisible={showRejectDialogue}
        onBackdropPress={() => setshowRejectDialogue(false)}
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
            Do You Want To Reject?
          </Text>
          <View
            style={{
              alignSelf: "center",
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 2,
              borderColor: Colors.darOrangeColor,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Sizes.fixPadding * 1.5,
            }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={40}
              color={Colors.darOrangeColor}
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
                setshowRejectDialogue(false);
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
                handleReject();
                setshowRejectDialogue(false);
                // handle delete logic here
              }}
              style={{
                backgroundColor: Colors.darOrangeColor,
                borderBottomRightRadius: 4,
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
  function approveDialogue() {
    return (
      <Overlay
        isVisible={showApproveDialogue}
        onBackdropPress={() => setshowApproveDialogue(false)}
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
            Do You Want To Approve?
          </Text>
          <View
            style={{
              alignSelf: "center",
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 2,
              borderColor: Colors.primaryColor,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Sizes.fixPadding * 1.5,
            }}
          >
           
            <MaterialCommunityIcons
              name="question-mark-circle-outline"
              size={40}
              color={Colors.primaryColor}
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
                setshowApproveDialogue(false);
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
                handleApprove();
                setshowApproveDialogue(false);
                // handle delete logic here
              }}
              style={{
                ...styles.yesButtonStyle,
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
                <Text style={styles.connectorTypeText}>{trimmedName}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
    function loadingDialog() {
      return (
        <Overlay isVisible={isLoading} overlayStyle={[styles.loaderDialogStyle,{}]}>
          <ActivityIndicator size={50} color={Colors.primaryColor} style={{ alignSelf: "center" }} />
          <Text style={{ marginTop: Sizes.fixPadding, textAlign: "center", ...Fonts.blackColor16Regular }}>
            Please wait...
          </Text>
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
    fontWeight:"700"
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

  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 10,
  },

  approveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  approveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },

  /*  Dialog Styles */
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: "85%",
    padding: 0.0,
    elevation: 0,
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
  /*End of  Dialog Styles */
});

export default StationDetailToVerify;
