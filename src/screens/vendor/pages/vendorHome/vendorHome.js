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
import { selectStation } from "../../services/selector";
import { fetchStations } from "../../services/crudFunction";
import { selectStations } from "../../../user/service/selector";
import { RefreshControl } from 'react-native';
import { handleRefreshStations } from "../../services/handleRefresh";
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

const VendorHome =  () => {
  const navigation = useNavigation();
  const [isLive, setIsLive] = useState(true);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // console.log("useEffect called");
    const fetchData = async () => {
      if (user?.id) {
        console.log("Dispatching fetchStations for user ID:", user?.id);
        await dispatch(fetchStations(user?.id));
      } else {
        console.log("User ID is not available");
        console.log(useSelector(selectStation));

      }
    };
  
    fetchData();
  
    return () => {
      console.log("Cleaning up VendorHome...");
    };
  }, [user, dispatch]);


  // Get current time to display appropriate greeting
  
  
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const stations = useSelector(selectStation);
  
  

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
  const handleRefresh = async() => {
    await handleRefreshStations(dispatch, user?.id, setRefreshing);
    }
    
  

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      <ScrollView showsVerticalScrollIndicator={false}
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#9Bd35A', '#101942']}  // Android spinner colors
          tintColor= "#101942"            // iOS spinner color
        />
      }
      
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
      Hi {getFirstName(user?.business_name)} {" "}!
       </Text>
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
            source={require("../../../../../assets/images/vendorWelcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Manage App</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate("AllStations")} style={[styles.featureCard, { backgroundColor: COLORS.primary }]}>
        <View style={styles.featureCardHeader}>
          <Text style={[styles.noOfStations, { color: COLORS.white }]}>
            {stations?.length} Stations
          </Text>
          <TouchableOpacity>
            <Feather name="more-vertical" size={18} color={COLORS.white} />
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
        <Text style={{ fontSize: 10, color: COLORS.white, marginTop: 5 }}>
          Click to Manage Stations & Ports Availability in Real-Time
        </Text>

        <View style={styles.availabilityContainer}>
          <Text style={[styles.featureDescription, { color: COLORS.white }]}>
            {isLive ? "Live" : "Offline"}
          </Text>
          <Switch
            value={isLive}
            onValueChange={() => setIsLive(!isLive)}
            trackColor={{ false: COLORS.secondary, true: COLORS.green }}
            thumbColor={COLORS.white}
          />
        </View>
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
        <Text style={{ fontSize: 10, color: COLORS.white, marginTop: 5 }}>
          View, modify, and track all your station booking requests with ease and accuracy
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
        <Text style={{ fontSize: 10, color: COLORS.darkGray, marginTop: 5 }}>
          Access detailed records of past EV station bookings, charging
          sessions, and payments..
        </Text>
      </View>
    );
  }
  function helpNSupportCard() {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("HelpScreen")} style={[styles.featureCard, { backgroundColor: COLORS.white }]}>
        <View style={styles.featureCardHeader}>
          <Text style={[styles.noOfStations, { color: COLORS.black }]}>
            24x7 Support
          </Text>
          <TouchableOpacity>
            <Feather name="more-vertical" size={18} color={COLORS.black} />
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
        <Text style={{ fontSize: 10, color: COLORS.darkGray, marginTop: 5 }}>
          Get 24 x 7 assistance for all your queries with our dedicated support team, ensuring seamless station management.
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
