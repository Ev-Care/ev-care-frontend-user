import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

// Bottom Tab & Core Screens/user
import BottomTabBarScreen from "../components/userComponents/bottomTabBarScreen";
import AllChargingStationsScreen from "../screens/user/allChargingStations/allChargingStationsScreen";
import ChargingStationsOnMapScreen from "../screens/user/chargingStationsOnMap/chargingStationsOnMapScreen";
import ChargingStationDetailScreen from "../screens/user/chargingStationDetail/chargingStationDetailScreen";
// Booking & Navigation Screens/user
import BookSlotScreen from "../screens/user/bookSlot/bookSlotScreen";
import ConfirmDetailScreen from "../screens/user/confirmDetail/confirmDetailScreen";
import BookingSuccessScreen from "../screens/user/bookingSuccess/bookingSuccessScreen";
import BookingDetailScreen from "../screens/user/bookingDetail/bookingDetailScreen";
import PickLocationScreen from "../screens/user/pickLocation/pickLocationScreen";
import EnrouteChargingStationsScreen from "../screens/user/enrouteChargingStations/enrouteChargingStationsScreen";
import DirectionScreen from "../screens/user/direction/directionScreen";
import EnrouteScreen from "../screens/user/enroute/enrouteScreen";
// User Profile & Notifications
import EditProfileScreen from "../screens/user/editProfile/editProfileScreen";
import NotificationScreen from "../screens/user/notifications/notificationsScreen";

// Filter & Search
import FilterScreen from "../screens/user/filter/filterScreen";
import SearchScreen from "../screens/user/search/searchScreen";

// Reviews & Info
import AllReviewScreen from "../screens/user/allReview/allReviewScreen";
import TermsAndConditionsScreen from "../screens/user/termsAndConditions/termsAndConditionsScreen";
import FaqScreen from "../screens/user/faq/faqScreen";
import PrivacyPolicyScreen from "../screens/user/privacyPolicy/privacyPolicyScreen";
import HelpScreen from "../screens/user/help/helpScreen";
import FavoriteScreen from "../screens/user/favorite/favoriteScreen";
import userHome from "../screens/user/home/userHome";

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
      <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
      <Stack.Screen name="userHome" component={userHome} />
    </Stack.Navigator>
  );
}
