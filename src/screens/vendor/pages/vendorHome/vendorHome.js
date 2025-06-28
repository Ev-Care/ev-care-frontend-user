import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../../constants/styles";
import MyStatusBar from "../../../../components/myStatusBar";
import { useNavigation } from "@react-navigation/native";
import { selectUser } from "../../../auth/services/selector";
import { useSelector, useDispatch } from "react-redux";
import {
  selectStation,
  selectVendorError,
  selectVendorStation,
} from "../../services/selector";
import {
  fetchStations,
  updateAllStationStatus,
} from "../../services/crudFunction";
import { selectStations } from "../../../user/service/selector";
import { RefreshControl } from "react-native";
import { handleRefreshStations } from "../../services/handleRefresh";
import { showSnackbar } from "../../../../redux/snackbar/snackbarSlice";
import * as Location from "expo-location";
import { updateUserCoordinate } from "../../../../redux/store/userSlice";
// Colors
const COLORS = {
  primary: "#101942",
  secondary: "#FF8C00", // Orange
  gray: "#F5F5F7",
  darkGray: "#9E9E9E",
  white: "#FFFFFF",
  black: "#000000",
  green: "#00FF00",
};

const VendorHome = () => {
  const navigation = useNavigation();
   const [currentLocation, setCurrentLocation] = useState(null);
    // const [refreshing, setRefreshing] = useState(false);
  const stations = useSelector(selectVendorStation);
  const [isLive, setIsLive] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const errorMessage = useSelector(selectVendorError);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (stations && stations.length > 0) {
      const anyActiveStation = stations.some(
        (station) => station.status === "Active"
      );

      setIsLive(anyActiveStation);
      // console.log("useEffect called");
      // console.log("anyActiveStation called", anyActiveStation);
    }
  }, [stations]);

  useEffect(() => {
    // console.log("useEffect called");
    const fetchData = async () => {
      if (user?.id) {
        if (stations) {
          // console.log("station = ", stations);
        }
        // console.log("Dispatching fetchStations for user ID:", user?.id);
        const response = await dispatch(fetchStations(user?.id));
        if (fetchStations.fulfilled.match(response)) {
          // await dispatch(showSnackbar({ message: "Station fetched Successfully." }));
        } else if (fetchStations.rejected.match(response)) {
          await dispatch(
            showSnackbar({ message: errorMessage || "Station not found." })
          );
        }
      } else {
        // console.log("User ID is not available");
        // console.log(useSelector(selectStation));
      }
    };

    fetchData();

    return () => {
      // console.log("Cleaning up VendorHome...");
    };
  }, [dispatch]);

  // Get current time to display appropriate greeting

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const toggleStation = async () => {
    // Optimistically update the local state first for a smooth effect
    setIsLive((prev) => !prev);
    setIsLoading(true);

    try {

      const newStatus = isLive ? "inactive" : "active";

      const statusResponse = await dispatch(
        updateAllStationStatus({
          statusType: "station",
          status: newStatus,
        })
      );

      // Handle the response from the server
      if (updateAllStationStatus.fulfilled.match(statusResponse)) {
        await dispatch(
          showSnackbar({ message: "Station status updated successfully." })
        );
      } else if (updateAllStationStatus.rejected.match(statusResponse)) {
        await dispatch(
          showSnackbar({
            message: errorMessage || "Failed to update station status.",
          })
        );
      }

      // Fetch the updated stations after updating the status
      const stationResponse = await dispatch(fetchStations(user?.id));
      if (fetchStations.fulfilled.match(stationResponse)) {
        // Handle success response (optional)
      } else if (fetchStations.rejected.match(stationResponse)) {
        await dispatch(
          showSnackbar({ message: errorMessage || "Failed to fetch stations." })
        );
      }
    } catch (error) {
      console.error("Error updating station status:", error);
      // Revert state if error occurs
      setIsLive((prev) => !prev);
      await dispatch(
        showSnackbar({
          message: errorMessage || "Failed to update station status.",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const feature = [
    {
      id: 1,
      name: "Manage Stations",
      date: "May 30, 2022",
      progress: 75,
      icon: "ev-station",
      color: COLORS.primary,
      textColor: COLORS.white,
      description: "toggle below button to Enable Desable Availability",
    },
  ];
  function getFirstName(fullName) {
    if (!fullName) return "";
    return fullName.trim().split(" ")[0];
  }
  const handleRefresh = async () => {
    await handleRefreshStations(
      dispatch,
      user?.id,
      setRefreshing,
      errorMessage
    );
  };

  useEffect(() => {
    let subscription = null;

    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          dispatch(
            showSnackbar({
              message: "Permission to access location was denied.",
              type: "error",
            })
          );
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // minimum time (ms) between updates
            distanceInterval: 50, // minimum distance (m) between updates
          },
          async (loc) => {
            // <-- important: make this function async
            const coords = loc.coords;
             console.log("Location updated:", coords);
            setCurrentLocation(coords);
            // console.log({ currentLocation });

            dispatch(updateUserCoordinate(coords)); // Update user coordinates

            // 1. Fetch stations
            const locationResponse = await dispatch(
              fetchStationsByLocation({ radius, coords })
            );
            if (fetchStationsByLocation.fulfilled.match(locationResponse)) {
              // dispatch(showSnackbar({ message: 'Charging stations found.', type: "success" }));
            } else if (
              fetchStationsByLocation.rejected.match(locationResponse)
            ) {
              dispatch(
                showSnackbar({
                  message: errorMessage || "Failed to fetch stations.",
                  type: "error",
                })
              );
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


  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9Bd35A", "#101942"]} // Android spinner colors
            tintColor="#101942" // iOS spinner color
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
           {user?.vendor_type ==="organization"?(<Text style={styles.greeting}>
              Hi {getFirstName(user?.business_name)} !
            </Text>):
             (<Text style={styles.greeting}>
              Hi {getFirstName(user?.name)} !
            </Text>)}
            <Text style={styles.subGreeting}>{getGreeting()}</Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            {/* <Feather name="bell" size={24} color={COLORS.black} /> */}
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        {/* <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.darkGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.darkGray}
          />
        </View> */}
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome to EV Care!</Text>
            <Text style={styles.welcomeSubtitle}>
              Add your charging stations, manage bookings, and grow your
              business.
            </Text>
          </View>

          <Image
            source={require("../../../../../assets/icon.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Manage Stations</Text>
          <TouchableOpacity>
            {/* <Text style={styles.viewAllText}>view all</Text> manageStationCard */}
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          {manageStationCard()}
          {helpNSupportCard()}
        </View>
        {/* <View style={styles.featuresContainer}>
          {bookingHistoryCard()}
          {viewBookingsCard()}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );

  function manageStationCard() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AllStations")}
        style={[styles.featureCard, { backgroundColor: COLORS.primary }]}
      >
        <View style={styles.featureCardHeader}>
          <Text style={[styles.noOfStations, { color: COLORS.white }]}>
            {stations?.length} Stations
          </Text>
          <TouchableOpacity>
            {/* <Feather name="more-vertical" size={18} color={COLORS.white} /> */}
          </TouchableOpacity>
        </View>

        <View style={styles.featureIconContainer}>
          <MaterialCommunityIcons
            name="ev-station" // Make sure this icon exists in MaterialCommunityIcons
            size={24}
            color={COLORS.primary} // Wrap in {}
          />
        </View>

        <Text style={[styles.featureName, { color: COLORS.white }]}>
          Manage Stations
        </Text>
        <Text style={{ fontSize: 10, color: COLORS.white, marginTop: 5 ,textAlign:"justify" }}>
          Update Station and Manage Port Availability in Real-time.
        </Text>

        {/* <View style={styles.availabilityContainer}>
          <Text style={[styles.featureDescription, { color: COLORS.white }]}>
            {isLive ? "Live" : "Offline"}
          </Text>
          <Switch
            value={isLive}
            onValueChange={toggleStation}
            trackColor={{ false: COLORS.secondary, true: COLORS.green }}
            thumbColor={COLORS.white}
          />
        </View> */}
      </TouchableOpacity>
    );
  }
  function viewBookingsCard() {
    return (
      <View style={[styles.featureCard, { backgroundColor: COLORS.primary }]}>
        <View style={styles.featureCardHeader}>
          <Text style={[styles.noOfStations, { color: COLORS.white }]}>
            19 Bookings
          </Text>
          <TouchableOpacity>
            <Feather name="more-vertical" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.featureIconContainer}>
          <MaterialCommunityIcons
            name="order-bool-ascending"
            size={24}
            color={COLORS.primary}
          />
        </View>

        <Text style={[styles.featureName, { color: COLORS.white }]}>
          Current Bookings
        </Text>
        <Text style={{ fontSize: 10, color: COLORS.white, marginTop: 5 ,textAlign:"justify" }}>
          View, modify, and track all your station booking requests with ease
          and accuracy
        </Text>
      </View>
    );
  }
  function bookingHistoryCard() {
    return (
      <View style={[styles.featureCard, { backgroundColor: COLORS.white }]}>
        <View style={styles.featureCardHeader}>
          <Text style={[styles.noOfStations, { color: COLORS.black }]}>
            17 Bookings
          </Text>
          <TouchableOpacity>
            <Feather name="more-vertical" size={18} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.featureIconContainer}>
          <MaterialCommunityIcons
            name="order-bool-ascending-variant"
            size={24}
            color={COLORS.primary}
          />
        </View>

        <Text style={[styles.featureName, { color: COLORS.darkGray }]}>
          Bookings History
        </Text>
        <Text style={{ fontSize: 10, color: COLORS.darkGray, marginTop: 5 ,textAlign:"justify" }}>
          Access detailed records of past EV station bookings, charging
          sessions, and payments..
        </Text>
      </View>
    );
  }
  function helpNSupportCard() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("HelpScreen")}
        style={[styles.featureCard, { backgroundColor: COLORS.white }]}
      >
        <View style={styles.featureCardHeader}>
          <Text style={[styles.noOfStations, { color: COLORS.black }]}>
            24x7 Support
          </Text>
          <TouchableOpacity>
            {/* <Feather name="more-vertical" size={18} color={COLORS.black} /> */}
          </TouchableOpacity>
        </View>

        <View style={styles.featureIconContainer}>
          <MaterialCommunityIcons
            name="chat-question"
            size={24}
            color={COLORS.primary}
          />
        </View>

        <Text style={[styles.featureName, { color: COLORS.darkGray }]}>
          Help & Support
        </Text>
        <Text style={{ fontSize: 10, color: COLORS.darkGray, marginTop: 5 ,textAlign:"justify"}}>
          Get 24x7 assistance for all your queries with our dedicated support
          team, ensuring seamless station management.
        </Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bodyBackColor,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  // searchContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: COLORS.gray,
  //   borderRadius: 12,
  //   paddingHorizontal: 15,
  //   paddingVertical: 8,
  //   marginHorizontal: 20,
  //   marginTop: 20,
  // },
  // searchInput: {
  //   flex: 1,
  //   marginLeft: 10,
  //   fontSize: 16,
  //   color: COLORS.black,
  // },
  welcomeCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    borderRadius:12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  featuresContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  featureCard: {
    width: "45%",
    borderRadius: 16,
    padding: 15,
    margin: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noOfStations: {
    fontSize: 12,
    fontWeight: "500",
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  featureName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },

  availabilityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: COLORS.primary, // Assuming your screen background is already primary
    borderRadius: 10,
  },
  featureDescription: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VendorHome;
