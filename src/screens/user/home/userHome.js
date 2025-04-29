// HomePage.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Animated,
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../auth/services/selector";
import * as Location from "expo-location";
import {
  fetchStationsByLocation,
  getAllFavoriteStations,
} from "../service/crudFunction";
import { selectStations, selectStationsError, selectStationsLoading, selectUserLoading } from "../service/selector";
import { RefreshControl } from "react-native";
import imageURL from "../../../constants/baseURL";
import {
  handleRefreshStations,
  handleRefreshStationsByLocation,
} from "../service/handleRefresh";
import { updateUserCoordinate } from "../../../redux/store/userSlice";
import { Overlay } from "@rneui/themed";
import { openHourFormatter, formatDistance, getChargerLabel } from "../../../utils/globalMethods";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";


const COLORS = {
  primary: "#101942",
  secondary: "#FF8C00",
  accent: "#FF4D94",
  light: "#F5F7FA",
  dark: "#333333",
  white: "#FFFFFF",
  gray: "#8A94A6",
};

const UserHome = ({ navigation }) => {
  const [count, setCount] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);
  const user = useSelector(selectUser);
  const [radius, setRadius] = useState(30000);
  const [refreshing, setRefreshing] = useState(false);
  const isLoading = useSelector(selectStationsLoading || selectUserLoading);
  const stations = useSelector(selectStations);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const [currentLocation, setCurrentLocation] = useState(null);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const errorMessage = useSelector(selectStationsError);
  const dispatch = useDispatch();

  useEffect(() => {
    let subscription = null;
  
    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          dispatch(showSnackbar({ message: 'Permission to access location was denied.', type: "error" }));
          return;
        }
  
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // minimum time (ms) between updates
            distanceInterval: 50, // minimum distance (m) between updates
          },
          async (loc) => {   // <-- important: make this function async
            const coords = loc.coords;
            setCurrentLocation(coords);
            console.log({ currentLocation });
  
            dispatch(updateUserCoordinate(coords)); // Update user coordinates
  
            // 1. Fetch stations
            const locationResponse = await dispatch(fetchStationsByLocation({ radius, coords }));
            if (fetchStationsByLocation.fulfilled.match(locationResponse)) {
              // dispatch(showSnackbar({ message: 'Charging stations found.', type: "success" }));
             
            } else if (fetchStationsByLocation.rejected.match(locationResponse)) {
              dispatch(showSnackbar({ message: errorMessage || "Failed to fetch stations.", type: "error" }));
            }
  
           
          }
        );
      } catch (err) {
        console.error("Error watching location:", err);
      }
    };
  
    startLocationUpdates();
  
    return () => {
      if (subscription) subscription.remove();
    };
  }, [refreshing]);
  

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // 1. Get location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        dispatch(showSnackbar({ message: 'Permission to access location was denied.', type: "error" }))
        return;
      }
      // 2. Get current location
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = location.coords;
      setCurrentLocation(coords);

      // 3. Update coordinates in Redux
      dispatch(updateUserCoordinate(coords));

      // 4. Fetch stations based on new location
      const locationResponse = await dispatch(fetchStationsByLocation({ radius, coords }));

      if (fetchStationsByLocation.fulfilled.match(locationResponse)) {
        // dispatch(showSnackbar({ message: 'Charging stations found.', type: "success" }));
      } else if (fetchStationsByLocation.rejected.match(locationResponse)) {
        dispatch(showSnackbar({ message: errorMessage || "Failed to fetch stations.", type: "error" }));
      }
     
    } catch (error) {
      console.error("Error during refresh:", error);
      dispatch(showSnackbar({ message: "Error refreshing data.", type: "error" }));
    } finally {
      setRefreshing(false);
    }
  };

  const openGoogleMaps = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  const animatedHeaderStyle = {
    paddingBottom: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [70, 20],
      extrapolate: "clamp",
    }),
    borderBottomLeftRadius: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 30],
      extrapolate: "clamp",
    }),
    borderBottomRightRadius: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 30],
      extrapolate: "clamp",
    }),
  };

  function getFirstName(fullName) {
    if (!fullName) return "";
    return fullName?.trim()?.split(" ")[0] ?? ""; // optional chaining here
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AnimatedLinearGradient
        colors={["#101942", "#1C2A5A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, animatedHeaderStyle]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}></Text>
          <TouchableOpacity>
            {/* <Icon name="bell" size={24} color={COLORS.white} /> */}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.push("Search")}
          style={styles.searchBox}
        >
          <MaterialIcons name="search" color={Colors.grayColor} size={24} />
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.grayColor18Medium,
              flex: 1,
              marginLeft: Sizes.fixPadding,
            }}
          >
            Search for charging station
          </Text>
        </TouchableOpacity>
      </AnimatedLinearGradient>

      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9Bd35A", "#101942"]} // Android spinner colors
            tintColor="#101942" // iOS spinner color
          />
        }
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hi {getFirstName(user?.name)} !</Text>
          <Text style={styles.subGreeting}>{getGreeting()}</Text>
        </View>

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome to EV Care!</Text>
            <Text style={styles.welcomeSubtitle}>
              EV Care helps you discover the closest charging spots on your
              route, and always on time
            </Text>
          </View>

          <Image
            source={require("../../../../assets/images/vendorWelcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.featureContainer}>
            <LinearGradient
              colors={["#101942", "#1C2A5A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.push("AllChargingStations", { setRefreshing })
                }
                style={styles.featureCardTouchOpacity}
              >
                <View>
                  <Text style={styles.featureCardTitle}>
                    Nearest Charging Stations
                  </Text>
                  <Text style={styles.featureText}>
                    View Nearest Charging Stations from Your Current Location
                  </Text>
                </View>
                <View style={styles.featureIcons}>
                  <Icon
                    name="map-marker-distance"
                    size={14}
                    color={COLORS.white}
                  />
                  <Text style={styles.featureText}>
                    {stations?.length > 0
                      ? `${stations[0].distance_km} km`
                      : "N/A"}
                  </Text>
                  <Text style={styles.featureText}>(From here)</Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={["#FF8C00", "#FFB347"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <TouchableOpacity
                onPress={() => navigation.push("Help")}
                style={styles.featureCardTouchOpacity}
              >
                <View>
                  <Text style={styles.featureCardTitle}>
                    24x7 Help & Support
                  </Text>
                  <Text style={styles.featureText}>
                    Get 24 x 7 assistance for all your queries with our
                    dedicated support team, ensuring seamless station
                    management.
                  </Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Explore more</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.push("FavoriteScreen");
            }}
            style={styles.exploreCard}
          >
            <View style={styles.exploreInfo}>
              <View style={styles.exploreCardContainer}>
                <Text style={styles.exploreCardText}>Favorites</Text>
                <Text style={styles.exploreCardDescription}>
                  View Your Favorite Stations
                </Text>
              </View>
            </View>
            <View style={styles.exploreCardIcon}>
              <Icon name="heart" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          {recentStationsInfo()}
        </View>
        <View style={{ height: 20 }} />
      </Animated.ScrollView>
      {loadingDialog()}
    </SafeAreaView>
  );

  function loadingDialog() {
    return (
      <Overlay isVisible={isLoading} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator
          size={50}
          color={Colors.primaryColor}
          style={{ alignSelf: "center" }}
        />
        <Text
          style={{
            marginTop: Sizes.fixPadding,
            textAlign: "center",
            ...Fonts.blackColor16Regular,
          }}
        >
          Please wait...
        </Text>
      </Overlay>
    );
  }
  function recentStationsInfo() {
    if (!stations || stations.length === 0) {
      return (
        <Text
          style={{ textAlign: "center", marginVertical: 10, color: "gray" }}
        >
          No stations found.
        </Text>
      );
    }

    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          navigation.push("ChargingStationDetail", { item });
        }}
        style={styles.enrouteChargingStationWrapStyle}
      >
        <Image
          source={
            item?.station_images
              ? { uri: imageURL.baseURL + item?.station_images }
              : require("../../../../assets/images/chargingStations/charging_station3.png")
          }
          style={styles.enrouteChargingStationImage}
        />

        <View style={styles.enrouteStationOpenCloseWrapper}>
          <Text
            style={[
              styles.statusClosed,
              { color: item?.status === "Inactive" ? "#FF5722" : "white" },
            ]}
          >
            {item?.status === "Inactive" ? "Closed" : "Open"}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ margin: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              {item?.station_name ?? "Unnamed Station"}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item?.address ?? "Address not available"}
            </Text>
           
            <View
              style={{
                marginTop: Sizes.fixPadding,
                ...commonStyles.rowAlignCenter,
              }}
            >
              <View style={{ ...commonStyles.rowAlignCenter }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                  {openHourFormatter(item?.open_hours_opening_time, item?.open_hours_closing_time)} 
                </Text>
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
                {getChargerLabel(item?.chargers?.length ?? 0)}
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
              {formatDistance(item?.distance_km)}
            </Text>

            <TouchableOpacity
              onPress={() =>
                openGoogleMaps(
                  item?.coordinates?.latitude ?? 0,
                  item?.coordinates?.longitude ?? 0
                )
              }
              style={styles.getDirectionButton}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={stations}
        keyExtractor={(item) => `${item?.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 40,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    // marginTop: 5,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.dark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    flexDirection: "row",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 16,
    marginBottom: 5,
    // marginTop: 3,
    padding: 20,
    shadowColor: COLORS.black,

    elevation: 3,
  },
  welcomeTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 5,
    lineHeight: 20,
  },
  welcomeImage: {
    width: 100,
    height: 100,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
  },
  featureContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureCard: {
    ...commonStyles.shadow,
    width: "48%",
    borderRadius: 15,
  },
  featureCardTouchOpacity: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 15,
    height: 150,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  featureIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 10,
    color: COLORS.white,
    marginLeft: 4,
  },

  exploreCard: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exploreInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  exploreCardContainer: {
    marginLeft: 10,
  },
  exploreCardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  exploreCardDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  exploreCardIcon: {
    backgroundColor: "rgb(134, 1, 1)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  enrouteChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",

    marginBottom: Sizes.fixPadding * 2.0,
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
});
export default UserHome;
