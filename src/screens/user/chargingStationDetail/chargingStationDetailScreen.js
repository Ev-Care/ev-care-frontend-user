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
import { selectFavoriteStations } from "../service/selector";
import imageURL from "../../../constants/baseURL";
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
  const [showRateNowDialog, setshowRateNowDialog] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [rate1, setRate1] = useState(false);
  const [rate2, setRate2] = useState(false);
  const [rate3, setRate3] = useState(false);
  const [rate4, setRate4] = useState(false);
  const [rate5, setRate5] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const favStations = useSelector(selectFavoriteStations);
  const [showSnackBar, setshowSnackBar] = useState(false);
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  
  const station = route?.params?.item;
  
  if (!station) {
    return <Text>Loading...</Text>; // Handle when station is not available
  }

  const [inFavorite, setinFavorite] = useState(favStations.has(station));
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

  const handleAddToFavorite = (stationId) => {
    if (station) {
      dispatch(addToFavorite(station));
      setinFavorite(prev => !prev);
      setshowSnackBar(true);
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
      {/* Rating dialog */}
      {rateNowDialog()}
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
          <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
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
                • {station?.open_hours_opening_time} - {station?.open_hours_closing_time}
              </Text>
              <View style={styles.newBadge}>
                <Text style={styles.newText}>
                  {station?.rating || "4.5"} ⭐
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
  
function navigationTab(){
  return(
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

  )
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
      {/* Reviews Tab */}
      {reviewsTab()}
    </ScrollView>
    )
 }
function buttons(){
  return(
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
    <TouchableOpacity
      onPress={() => {
        setshowRateNowDialog(true);
      }}
      style={styles.rateNowButton}
    >
      <Text style={styles.directionButtonText}>Rate Now</Text>
    </TouchableOpacity>
  </View>
  )
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

          {/* Map over connectors */}
          <View style={styles.connectorContainer}>
            {charger?.connectors?.map((connector, connectorIndex) => (
              <View key={connectorIndex} style={styles.connector}>
                <Text style={styles.connectorTitle}>
                  {connector?.name || `Connector ${connectorIndex + 1}`}
                </Text>
                <View style={styles.connectorType}>
                  <Icon
                    name={
                      connector?.connectorType?.description
                        ? connectorIcons[connector?.connectorType?.description]
                        : "ev-plug-type1"
                    }
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.connectorTypeText}>
                    {connector?.connectorType?.description}
                  </Text>
                </View>
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
  function reviewsTab() {
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
        </View>
        {reviews.map((item) =>
          <View key={item.id}>
            {renderReviewItem({ item })}
          </View>)}
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
  function renderStars(rating) {
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

  function rateNowDialog() {
    return (
      <Overlay
        isVisible={showRateNowDialog}
        onBackdropPress={() => setshowRateNowDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View>
          <Image
            source={require("../../../../assets/images/icons/rating.png")}
            style={styles.ratingImageStyle}
          />
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              textAlign: "center",
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            Rate your charging experience..
          </Text>
          {rating()}

          <TextInput
            value={reviewComment}
            onChangeText={(text) => setReviewComment(text)}
            placeholder="Write your feedback here..."
            placeholderTextColor="#999"
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginTop: Sizes.fixPadding * 1.5,
              marginHorizontal: Sizes.fixPadding * 1.5,
              textAlignVertical: "top",
              minHeight: 80,
              fontSize: 12,
              color: "#333",
            }}
          />

          <View
            style={{
              ...commonStyles.rowAlignCenter,
              marginTop: Sizes.fixPadding,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowRateNowDialog(false);
              }}
              style={{
                ...styles.noButtonStyle,
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.blackColor16Medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowRateNowDialog(false);
                // You can handle reviewComment submission here
              }}
              style={{
                ...styles.yesButtonStyle,
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    );
  }

  function rating() {
    return (
      <View style={{ ...styles.ratingWrapStyle }}>
        <MaterialIcons
          name={rate1 ? "star" : "star-border"}
          size={screenWidth / 12.5}
          color={Colors.primaryColor}
          onPress={() => {
            if (rate1) {
              setRate2(false);
              setRate3(false);
              setRate4(false);
              setRate5(false);
            } else {
              setRate1(true);
            }
          }}
        />
        <MaterialIcons
          name={rate2 ? "star" : "star-border"}
          size={screenWidth / 12.5}
          color={Colors.primaryColor}
          onPress={() => {
            if (rate2) {
              setRate1(true);
              setRate3(false);
              setRate4(false);
              setRate5(false);
            } else {
              setRate2(true);
              setRate1(true);
            }
          }}
        />
        <MaterialIcons
          name={rate3 ? "star" : "star-border"}
          size={screenWidth / 12.5}
          color={Colors.primaryColor}
          onPress={() => {
            if (rate3) {
              setRate4(false);
              setRate5(false);
              setRate2(true);
            } else {
              setRate3(true);
              setRate2(true);
              setRate1(true);
            }
          }}
        />
        <MaterialIcons
          name={rate4 ? "star" : "star-border"}
          size={screenWidth / 12.5}
          color={Colors.primaryColor}
          onPress={() => {
            if (rate4) {
              setRate5(false);
              setRate3(true);
            } else {
              setRate4(true);
              setRate3(true);
              setRate2(true);
              setRate1(true);
            }
          }}
        />
        <MaterialIcons
          name={rate5 ? "star" : "star-border"}
          size={screenWidth / 12.5}
          color={Colors.primaryColor}
          onPress={() => {
            if (rate5) {
              setRate4(true);
            } else {
              setRate5(true);
              setRate4(true);
              setRate3(true);
              setRate2(true);
              setRate1(true);
            }
          }}
        />
      </View>
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
  rateNowButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
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
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
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

export default ChargingStationDetailScreen;
