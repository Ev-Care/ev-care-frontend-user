import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";

// Bottom Tab & Core Screens/user
import BottomTabBarScreen from "../components/userComponents/bottomTabBarScreen";
import AllChargingStationsScreen from "../screens/user/allChargingStations/allChargingStationsScreen";
import ChargingStationDetailScreen from "../screens/user/chargingStationDetail/chargingStationDetailScreen";
import ChargingStationsOnMapScreen from "../screens/user/chargingStationsOnMap/chargingStationsOnMapScreen";
// Booking & Navigation Screens/user
import BookingDetailScreen from "../screens/user/bookingDetail/bookingDetailScreen";
import BookingSuccessScreen from "../screens/user/bookingSuccess/bookingSuccessScreen";
import BookSlotScreen from "../screens/user/bookSlot/bookSlotScreen";
import ConfirmDetailScreen from "../screens/user/confirmDetail/confirmDetailScreen";
import DirectionScreen from "../screens/user/direction/directionScreen";
import EnrouteScreen from "../screens/user/enroute/enrouteScreen";
import EnrouteChargingStationsScreen from "../screens/user/enrouteChargingStations/enrouteChargingStationsScreen";
import PickLocationScreen from "../screens/user/pickLocation/pickLocationScreen";
// User Profile & Notifications
import EditProfileScreen from "../screens/user/editProfile/editProfileScreen";
import NotificationScreen from "../screens/user/notifications/notificationsScreen";

// Filter & Search
import FilterScreen from "../screens/user/filter/filterScreen";
import SearchScreen from "../screens/user/search/searchScreen";

// Reviews & Info
import { useSelector } from "react-redux";
import { selectUser } from "../screens/auth/services/selector";
import AllReviewScreen from "../screens/user/allReview/allReviewScreen";
import FaqScreen from "../screens/user/faq/faqScreen";
import FavoriteScreen from "../screens/user/favorite/favoriteScreen";
import HelpScreen from "../screens/user/help/helpScreen";
import userHome from "../screens/user/home/userHome";
import PrivacyPolicyScreen from "../screens/user/privacyPolicy/privacyPolicyScreen";
import TermsAndConditionsScreen from "../screens/user/termsAndConditions/termsAndConditionsScreen";
const Stack = createStackNavigator();
// UserStack component to manage user-related screens and navigation
export function UserStack() {
  const user = useSelector(selectUser); // Get user data

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
        <>
          <Stack.Screen
            name="BottomTabBar"
            component={BottomTabBarScreen}
            options={{ ...TransitionPresets.DefaultTransition }}
          />
          <Stack.Screen name="AllChargingStations" component={AllChargingStationsScreen} />
          <Stack.Screen name="ChargingStationsOnMap" component={ChargingStationsOnMapScreen} />
          <Stack.Screen name="ChargingStationDetail" component={ChargingStationDetailScreen} />
          <Stack.Screen name="BookSlot" component={BookSlotScreen} />
          <Stack.Screen name="ConfirmDetail" component={ConfirmDetailScreen} />
          <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
          <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
          <Stack.Screen name="PickLocation" component={PickLocationScreen} />
          <Stack.Screen name="EnrouteChargingStations" component={EnrouteChargingStationsScreen} />
          <Stack.Screen name="Direction" component={DirectionScreen} />
          <Stack.Screen name="Enroute" component={EnrouteScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="AllReview" component={AllReviewScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
          <Stack.Screen name="Faq" component={FaqScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
          <Stack.Screen name="userHome" component={userHome} />
        </>
     
    </Stack.Navigator>
  );
}
