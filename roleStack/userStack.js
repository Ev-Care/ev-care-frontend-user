import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

// Bottom Tab & Core Screens
import BottomTabBarScreen from "../components/bottomTabBarScreen";
import AllChargingStationsScreen from "../screens/allChargingStations/allChargingStationsScreen";
import ChargingStationsOnMapScreen from "../screens/chargingStationsOnMap/chargingStationsOnMapScreen";
import ChargingStationDetailScreen from "../screens/chargingStationDetail/chargingStationDetailScreen";

// Booking & Navigation Screens
import BookSlotScreen from "../screens/bookSlot/bookSlotScreen";
import ConfirmDetailScreen from "../screens/confirmDetail/confirmDetailScreen";
import BookingSuccessScreen from "../screens/bookingSuccess/bookingSuccessScreen";
import BookingDetailScreen from "../screens/bookingDetail/bookingDetailScreen";
import PickLocationScreen from "../screens/pickLocation/pickLocationScreen";
import EnrouteChargingStationsScreen from "../screens/enrouteChargingStations/enrouteChargingStationsScreen";
import DirectionScreen from "../screens/direction/directionScreen";
import EnrouteScreen from "../screens/enroute/enrouteScreen";

// User Profile & Notifications
import EditProfileScreen from "../screens/editProfile/editProfileScreen";
import NotificationScreen from "../screens/notifications/notificationsScreen";

// Filter & Search
import FilterScreen from "../screens/filter/filterScreen";
import SearchScreen from "../screens/search/searchScreen";

// Reviews & Info
import AllReviewScreen from "../screens/allReview/allReviewScreen";
import TermsAndConditionsScreen from "../screens/termsAndConditions/termsAndConditionsScreen";
import FaqScreen from "../screens/faq/faqScreen";
import PrivacyPolicyScreen from "../screens/privacyPolicy/privacyPolicyScreen";
import HelpScreen from "../screens/help/helpScreen";
import UnderDevelopment from "../screens/underDev";

const Stack = createStackNavigator();

export function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
  
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
    </Stack.Navigator>
  );
}
