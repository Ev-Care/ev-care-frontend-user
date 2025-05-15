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
  Modal,
  ActivityIndicator,
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
import { useDispatch, useSelector } from "react-redux";
import imageURL from "../../../constants/baseURL";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import { openHourFormatter } from "../../../utils/globalMethods";
import { deleteStation } from "../../vendor/services/crudFunction";
import {
  deleteStationByAdmin,
  fetchAllStations,
} from "../services/crudFunctions";
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

const StationDetailPage = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showDeleteDialogue, setshowDeleteDialogue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();

  const station = route?.params?.item;

  console.log("station in detail page = ", JSON.stringify(station, 2, null));

  if (!station) {
    return <Text>Loading...</Text>; // Handle when station is not available
  }

  const connectorIcons = {
    "CCS-2": "ev-plug-ccs2",
    CHAdeMO: "ev-plug-chademo",
    "Type-2": "ev-plug-type2",
    Wall: "ev-plug-type1",
    "GBT:": "ev-plug-type2",
  };

  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
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

  const handleDelete = async () => {
    setIsLoading(true);
    console.log("handleDelete Called");

    try {
      const deleteResponse = await dispatch(deleteStationByAdmin(station?.id));
      if (deleteStationByAdmin.fulfilled.match(deleteResponse)) {
        const stationResponse = await dispatch(fetchAllStations());
        if (fetchAllStations.fulfilled.match(stationResponse)) {
          console.log("station updated");
          await dispatch(
            showSnackbar({
              message: "Station deleted successfully.",
              type: "success",
            })
          );
          navigation.pop();
        } else if (fetchAllStations.rejected.match(stationResponse)) {
          console.log("Failed to fetch updated stations.");
          await dispatch(
            showSnackbar({
              message: errorMessage || "Failed to update station list.",
              type: "error",
            })
          );
        }
      } else if (deleteStationByAdmin.rejected.match(deleteResponse)) {
        await dispatch(
          showSnackbar({
            message: errorMessage || "Failed to delete station.",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error deleting station:", error);
      await dispatch(
        showSnackbar({
          message: errorMessage || "An error occurred while deleting.",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
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
      {deleteDialogue()}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" color={Colors.blackColor} size={26} />
          </TouchableOpacity>
        </View>
      </Modal>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </View>
  );

  function header() {
    if (!station) {
      return <Text>Loading...</Text>;
    }

    const imageUrl = station?.station_images
      ? { uri: imageURL.baseURL + station.station_images }
      : require("../../../../assets/images/nullStation.png");

    return (
      <View style={styles.header}>
        <View style={styles.communityBadgeAndBack}>
          <View
            style={{
              backgroundColor: Colors.primaryColor,
              borderRadius: 20,
              padding: 6,
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
            }}
          >
            <MaterialIcons
              name="arrow-back"
              color={Colors.whiteColor}
              size={26}
              onPress={() => navigation.pop()}
            />
          </View>

          <View style={styles.communityBadge}>
            <Text style={styles.communityText}>{station?.access_type}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.mapBackground}
          onPress={() => {
            if (
              station?.station_images &&
              station?.station_images.trim() !== ""
            ) {
              showFullImage(imageURL.baseURL + station.station_images);
            }
          }}
        >
          <Image source={imageUrl} style={styles.mapBackground} />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <Text style={styles.stationName}>
            {trimName(50, station?.station_name)}
          </Text>
          {station?.user?.vendor_type === "individual" ? (
            <>
              <Text style={styles.stationAddress}>
                Vendor Name : {station?.user?.owner_legal_name}
              </Text>
              <Text style={styles.stationAddress}>
                Contact Number : {station?.user?.mobile_number}
              </Text>
            </>
          ) : station?.user?.vendor_type === "organization" ? (
            <>
              <Text style={styles.stationAddress}>
                Organization Name: {station?.user?.business_name}
              </Text>
              <Text style={styles.stationAddress}>
                Contact Number : {station?.user?.mobile_number}
              </Text>
            </>
          ) : (
            <Text style={styles.stationAddress}>
              {trimName(50, station?.address)}
            </Text>
          )}
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
                <Text style={styles.newText}>
                  {String(station?.status).toUpperCase()}
                  {/* {station.status === "Active"
                    ? "VERIFIED"
                    : station.status === "Planned"
                    ? "PENDING"
                    : ""} */}
                </Text>
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
            setshowDeleteDialogue(true);
          }}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Delete</Text>
        </TouchableOpacity>
        {/* onPress={() => navigation.navigate("UpdateStation")} */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("UpdateStationPage", { station })}
        >
          <Text style={styles.submitButtonText}>Update</Text>
        </TouchableOpacity>
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
              <Text style={[styles.chargerSpecText]}>
                Power:⚡{charger?.max_power_kw || "Unknown Power"} kW
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
                <Text
                  style={[
                    styles.connectorTypeText,
                    { fontWeight: "700", fontSize: 12 },
                  ]}
                >
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {},
  mapBackground: {
    width: "100%",
    height: 200,
  },
  overlay: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgb(255, 255, 255)", // Light purple with opacity
  },
  communityBadgeAndBack: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 26,
    paddingLeft: 15,
    paddingRight: 25,
    // backgroundColor: "cyan",
    width: "100%",
    zIndex: 9999,
  },

  communityBadge: {
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
    borderTopWidth: 0.5,
    borderTopColor: "#E0E0E0",
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
    fontWeight: "700",
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
    marginLeft: 10,
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
    padding: 6,
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

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  closeText: {
    color: "#000",
    fontWeight: "bold",
  },
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
});

export default StationDetailPage;
