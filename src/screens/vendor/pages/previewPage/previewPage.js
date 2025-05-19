import { Overlay } from "@rneui/themed";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { openHourFormatter } from "../../../../utils/globalMethods";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { Colors, Fonts, Sizes } from "../../../../constants/styles";
import {
  addStation,
  fetchStations,
  updateStation,
} from "../../services/crudFunction";
import {
  selectVendorError,
  selectVendorLoading,
  selectVendorStation,
} from "../../services/selector";
import { showSnackbar } from "../../../../redux/snackbar/snackbarSlice";
import imageURL from "../../../../constants/baseURL";
import { postSingleFile } from "../../../auth/services/crudFunction";
import { setupImagePicker } from "../../CompleteProfileDetail/vendorDetailForm";
import { selectToken } from "../../../auth/services/selector";
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

const PreviewPage = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef(null);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { stationData, type, stationImage, clearForm } = route?.params || {};
  const isLoading = useSelector(selectVendorLoading);
  const errorMessage = useSelector(selectVendorError);
  const stations = useSelector(selectVendorStation);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(stationImage || "");
  const authToken = useSelector(selectToken);
  const station = stations.find(
    (station) => station.id === stationData.station_id
  );

  useEffect(() => {
    console.log(
      "Transformed station data preview:",
      JSON.stringify(stationData, null, 2)
    );
  }, [stationData]);

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

  useEffect(() => {
    if (mapRef.current && stationData?.coordinates) {
      const { latitude, longitude } = stationData?.coordinates || {};
      mapRef.current.animateCamera({
        center: {
          latitude: latitude || 0,
          longitude: longitude || 0,
        },
        zoom: 15,
      });
    }
  }, [stationData?.coordinates]);

  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      console.log("station data", stationData);
      if (type === "add") {
        const addStationresponse = await dispatch(addStation(stationData));
        if (addStation.fulfilled.match(addStationresponse)) {
          const stationResponse = await dispatch(
            fetchStations(stationData?.owner_id)
          );
          if (fetchStations.fulfilled.match(stationResponse)) {
            // await dispatch(showSnackbar({ message: "Station fetched Successfully.", type:'success' }));
            await dispatch(
              showSnackbar({ message: "New station added.", type: "success" })
            );
            if (typeof clearForm === "function") {
              clearForm();
            }
            // navigation.pop();
            navigation.navigate("VendorBottomTabBar");
          } else if (fetchStations.rejected.match(stationResponse)) {
            await dispatch(
              showSnackbar({
                message: errorMessage || "Failed to fetch station.",
                type: "error",
              })
            );
          }
        } else if (addStation.rejected.match(addStationresponse)) {
          await dispatch(
            showSnackbar({
              message: errorMessage || "Failed to add station.",
              type: "error",
            })
          );
        }
      } else {
        const updateStationResponse = await dispatch(
          updateStation(stationData)
        );
        if (updateStation.fulfilled.match(updateStationResponse)) {
          const stationResponse = await dispatch(
            fetchStations(stationData?.owner_id)
          );
          if (fetchStations.fulfilled.match(stationResponse)) {
            console.log("station updated");

            await dispatch(
              showSnackbar({
                message: "Station updated Successfully.",
                type: "success",
              })
            );

            navigation.pop(2);
            // navigation.navigate("StationManagement", { station })
          } else if (fetchStations.rejected.match(stationResponse)) {
            console.log("station update failed");
            await dispatch(
              showSnackbar({
                message: errorMessage || "Failed to fetch station.",
                type: "error",
              })
            );
          }
        } else if (updateStation.rejected.match(updateStationResponse)) {
          await dispatch(
            showSnackbar({
              message: errorMessage || "Failed to update station.",
              type: "error",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error adding station:", error);
      await dispatch(
        showSnackbar({
          message:
            errorMessage || "Something went wrong. Please try again later.",
          type: "error",
        })
      );
    }
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollViewRef?.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (event) => {
    const scrollPosition = event?.nativeEvent?.contentOffset?.x ?? 0;
    const index = Math.round(scrollPosition / width);
    if (activeTab !== index) {
      setActiveTab(index);
    }
  };

  function trimName(threshold, str) {
    if (!str) return "";
    if (str?.length <= threshold) {
      return str;
    }
    return str?.substring(0, threshold) + ".....";
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {header?.()}
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
      </View>

      {/* Swipeable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Charger Tab */}
        {chargerTab?.()}
        {/* Details Tab */}
        {detailTab?.()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() => {
            navigation?.pop();
          }}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {fullViewImage?.()}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </View>
  );

  function fullViewImage() {
    return (
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: imageURL.baseURL + selectedImage }}
            style={styles.fullImage}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" color={Colors.blackColor} size={26} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
  function chargerTab() {
    return (
      <ScrollView style={styles.tabContent}>
        {stationData?.chargers?.map((charger, index) => (
          <View key={index} style={styles.chargerCard}>
            <Text style={styles.chargerTitle}>
              {charger?.name || `Charger ${index + 1}`}
            </Text>
            <View style={styles.chargerSpecs}>
              <Text style={styles.chargerSpecText}>
                Type: {charger?.charger_type || "Unknown Type"}
              </Text>
              <Text style={styles.chargerSpecText}>|</Text>
              <Text style={styles.chargerSpecText}>
                Power:⚡{charger?.max_power_kw || "Unknown Power"} KW
              </Text>
            </View>

            {/* Connector Type */}
            <View style={styles.connector}>
              <Text style={styles.connectorTitle}>
                {charger?.connector_type || "Unknown Connector"}
              </Text>
              <View style={styles.connectorType}>
                <Icon
                  name={
                    charger?.connector_type
                      ? connectorIcons?.[charger?.connector_type] ||
                        "ev-plug-type1"
                      : "ev-plug-type1"
                  }
                  size={20}
                  color={COLORS.primary}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  function header() {
    if (!stationData) {
      return <Text>Loading...</Text>;
    }
    //  console.log("station image in preview page upper",stationImage);
    const imageUrl = stationImage
      ? { uri: imageURL.baseURL + stationImage }
      : require("../../../../../assets/images/nullStation.png");
    // console.log("station image in preview page lower",imageUrl);
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
            <Text style={styles.communityText}>{stationData?.access_type}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.mapBackground}
          onPress={() => {
            if (stationImage && stationImage.trim() !== "") {
              showFullImage(stationImage);
            }
          }}
        >
          <Image source={imageUrl} style={styles.mapBackground} />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <Text style={styles.stationName}>
            {trimName(50, stationData?.station_name)}
          </Text>
          <Text style={styles.stationAddress}>
            {trimName(50, stationData?.address)}
          </Text>
          <View
            style={[{ flexDirection: "row", justifyContent: "space-between" }]}
          >
            <View style={styles.statusContainer}>
              <Text style={styles.statusTime}>
                Open Hours :{" "}
                {openHourFormatter(
                  stationData?.open_hours_opening_time,
                  stationData?.open_hours_closing_time
                )}
              </Text>
              {stationData.status&& <View style={styles.newBadge}>
               <Text style={styles.newText}>
                  {stationData.status === "Active"
                    ? "VERIFIED"
                    : stationData.status}
                </Text>
              </View>}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // This will be used to show the error dialog in future
  function errorDialog() {
    return (
      <Overlay isVisible={isError} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator
          size={50}
          color={Colors.primaryColor}
          style={{ alignSelf: "center" }}
        />
        <Text
          style={{
            marginTop: 16,
            textAlign: "center",
            color: Colors.red,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {errorMessage || "An error occurred. Please try again."}
        </Text>
      </Overlay>
    );
  }

  function detailTab() {
    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: stationData?.coordinates?.latitude || 0,
              longitude: stationData?.coordinates?.longitude || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: stationData?.coordinates?.latitude || 0,
                longitude: stationData?.coordinates?.longitude || 0,
              }}
              title={stationData?.station_name}
              description={stationData?.address}
            />
          </MapView>
        </View>

        <Text style={styles.sectionTitle}>Address</Text>
        <View style={styles.landmarkContainer}>
          <Text style={styles.landmarkTitle}>{stationData?.address}</Text>
        </View>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {stationData?.amenities?.split(",").map((amenityName, index) => {
            const trimmedName = amenityName?.trim();
            const iconName = amenityMap?.[trimmedName] || "help-circle";

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
  openHour: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  statusTime: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight:"700"
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
    minWidth: 60,
    minHeight: 60,
    borderRadius: 8,
    padding: 6,
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
});

export default PreviewPage;
