import { MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "@rneui/themed";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import imageURL from "../../../constants/baseURL";
import { Colors, Fonts, Sizes, commonStyles } from "../../../constants/styles";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import {
  approveVendorProfile,
  fetchStationsByUserId,
  getAllPendingUsers,
} from "../services/crudFunctions";
import { default as Icon } from "react-native-vector-icons/MaterialIcons";
import { RefreshControl } from "react-native-gesture-handler";
import { fetchStations } from "../../vendor/services/crudFunction";
const { width } = Dimensions.get("window");


const UserDetailScreen = ({ route, navigation }) => {
  const scrollViewRef = useRef(null);
  const { user } = route?.params; // Get the user data from route params
  const [name, setName] = useState(user?.owner_legal_name || "Not found");
  const [email, setEmail] = useState(user?.email || "Not found");
  const [mobNumber, setMobNumber] = useState(
    user?.mobile_number || "Not found"
  );
  const [businessName, setBusinessName] = useState(
    user?.business_name || "Not found"
  );
  const [aadharNumber, setAadharNumber] = useState(
    user?.adhar_no || "Not found"
  );
  const [panNumber, setPanNumber] = useState(user?.pan_no || "Not found");
  const [status, setStatus] = useState(user?.status || "Not found");
  const [gstNumber, setGstNumber] = useState(user?.gstin_number || "Not found");
  const [vehicleCompany, setVehicleCompany] = useState(
    user?.vehicle_manufacturer || "Not found"
  );
  const [vehicleModel, setVehicleModel] = useState(
    user?.vehicle_model || "Not found"
  );
  const [vehicleNumber, setVehicleNumber] = useState(
    user?.vehicle_registration_number || "Not found"
  );

  const [aadhaarFrontImage, setAadhaarFrontImage] = useState(
    user?.adhar_front_pic
  );
  const [aadhaarBackImage, setAadhaarBackImage] = useState(
    user?.adhar_back_pic
  );
  const [panImage, setPanImage] = useState(user?.pan_pic);
  const [gstImage, setGstImage] = useState(user?.gstin_image);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [showDeleteDialogue, setshowDeleteDialogue] = useState(false);
  const [showApproveDialogue, setshowApproveDialogue] = useState(false);
  const [imageloading, setImageLoading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const dispatch = useDispatch();
 
  const [stations, setStations] = useState([]);

useEffect(() => {
  console.log("Station changed = ", stations);
}, [stations]);


useEffect(() => {
  const fetchData = async () => {
    if (user?.role === "user") {
      return;
    }
    try {
      setIsLoading(true);
      const response = await dispatch(fetchStationsByUserId(user?.id));
      console.log("response in user detail", response?.payload);
      setStations(response?.payload?.data?.chargingStations);
    } catch (error) {
      dispatch(
        showSnackbar({ message: error.message || 'Failed to fetch stations', type: 'error' })
      );
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [user]);



  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleRefresh = async () => {

  }
  const handleReject = async () => {

  };
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (activeTab !== index) {
      setActiveTab(index);
    }
  };
  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
  };

  const trimText = (text, limit) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  const renderTextData = (key, value) => (
    <View
      style={{
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 14, textAlign: "left" }}>
        {key}:
      </Text>
      <Text style={{ fontSize: 14, textAlign: "right" }}>{value}</Text>
    </View>
  );

  const renderImageBox = (label, localURI) => {
    if ((!localURI || localURI === "") && label !== "avatar") return null;
    //  console.log("local uri",localURI);
    return (
      <TouchableOpacity
        onPress={() => showFullImage(imageURL.baseURL + localURI)}
        style={{ alignItems: "center", marginBottom: 20 }}
      >
        <View
          style={[
            styles.imageBox,
            { borderRadius: label === "avatar" ? 50 : 12 },
          ]}
        >
          {imageloading === label ? (
            <ActivityIndicator size={40} color="#ccc" />
          ) : localURI ? (
            <Image
              source={{ uri: imageURL.baseURL + localURI }}
              style={[
                styles.imageStyle,
                { borderRadius: label === "avatar" ? 50 : 12 },
              ]}
            />
          ) : (
            <MaterialIcons name="image-not-supported" size={50} color="#bbb" />
          )}
        </View>
        {label !== "avatar" && <Text style={styles.imageLabel}>{label}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: 16 }]}>
          {user?.role === "user" ? "User" : "Vendor"} Detail Page
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {user?.role === "user" ? (
        userDetail?.()
      ) : (
        <>
          {navigationTab?.()}
          {SwipeableContent?.()}
        </>
      )}

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
      {/* Full Image Modal */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
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
        {userDetail()}
        {stationDetail()}
      </ScrollView>
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
            {user?.role === "user" ? "User" : "Vendor"} Detail
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
            Stations
          </Text>
          {activeTab === 1 && <View style={styles.activeTabIndicator} />}
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
            Are you sure you want to delete?
          </Text>

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
                handleReject();
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

  function userDetail() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainerAvatar}>
          {renderImageBox("avatar", avatar, setAvatar)}
        </View>
        {renderTextData("Full Name", name)}
        {renderTextData("Mobile Number", mobNumber)}
        {renderTextData("Email", email)}
        {renderTextData("Status", status)}
        {user?.role === "user" && (
          <>
            {renderTextData("Vehicle Company", vehicleCompany)}
            {renderTextData("Vehicle Model", vehicleModel)}
            {renderTextData("Vehicle Number", vehicleNumber)}
          </>
        )}
        {user?.role === "vendor" && (
          <>
            {renderTextData("Registered As", user?.vendor_type)}
            {renderTextData("Business Name", businessName)}
            {renderTextData("Aadhar Number", aadharNumber)}
            {renderTextData("PAN Number", panNumber)}
            {renderTextData("GST Number", gstNumber)}
            <View style={styles.imageContainer}>
              {renderImageBox("Aadhaar front", aadhaarFrontImage)}
              {renderImageBox("Aadhaar Back", aadhaarBackImage)}
              {renderImageBox("PAN", panImage)}
              {renderImageBox("GST", gstImage)}
            </View>
          </>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              setshowDeleteDialogue(true);
            }}
            style={[
              styles.actionButton,
              { backgroundColor: Colors.darOrangeColor },
            ]}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateUser", { user })}
            style={[
              styles.actionButton,
              { backgroundColor: Colors.primaryColor },
            ]}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>

        {deleteDialogue()}

      </ScrollView>
    );
  }
  function stationDetail() {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9Bd35A', '#101942']}
            tintColor="#101942"
          />
        }
      >
        {stations?.length > 0 ? (
          stations.map((station) => (
            <TouchableOpacity
              onPress={() =>
                navigation?.navigate("StationDetailPage", { item: station })
              }
              key={station.id}
              style={styles.card}
            >
              {station?.station_images ? (
                <Image
                  // source={{ uri: imageURL.baseURL + station?.station_images }}
                  source={{ uri: imageURL.baseURL + station?.station_images }}
                  style={styles.stationImage}
                />
              ) : (
                <View
                  style={[
                    styles.stationImage,
                    { alignItems: "center", justifyContent: "center" },
                  ]}
                >
                  <MaterialIcons name="ev-station" size={50} color="#8f8f8f" />
                </View>
              )}

              <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.stationName}>
                    {trimText(station?.station_name, 25)}
                  </Text>
                </View>
                <Text style={styles.statusText}>
                  Status:{" "}
                  <Text
                    style={{
                                          color: station?.status == "Active"
                                            ? Colors.lightGreenColor
                                            : station?.status == "Inactive"
                                              ? Colors.darOrangeColor : station?.status == "Rejected"
                                                ? Colors.redColor : station?.status == "Planned"
                                                  ? Colors.yellowColor : Colors.primaryColor,
                                        }}
                  >
                    {station?.status }
                  </Text>
                </Text>
                <Text style={styles.text}>
                  Chargers: {station?.chargers?.length || 0}
                </Text>
                <Text style={styles.addressText}>
                  {trimText(station?.address, 100)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No stations available.
          </Text>
        )}
      </ScrollView>
    );
  }


};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 50,
    width,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bodyBackColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0eb",
    elevation: 5,
  },

  imageContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,

    flexWrap: "wrap",
  },
  imageContainerAvatar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 20,
    flexWrap: "wrap",
  },
  imageBox: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#aaa",

    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f9f9f9",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  imageLabel: {
    textAlign: "center",
    marginTop: 6,
    color: "#444",
    fontSize: 14,
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
    borderRadius: 8,
  },
  closeText: {
    color: "#000",
    fontWeight: "bold",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primaryColor,
  },
  tabText: {
    fontSize: 14,
    color: Colors.grayColor,
  },
  activeTabText: {
    color: Colors.primaryColor,
    fontWeight: "bold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primaryColor,
  },
  tabContent: {
    width,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  stationImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e2e2e2 ',
    backgroundColor: '#f5f5f5'
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: Colors.primary,
  },
  addressText: {
    fontSize: 10,
    color: Colors.grayColor,
  },

});

export default UserDetailScreen;
