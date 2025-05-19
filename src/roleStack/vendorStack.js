import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import Instruction from "../screens/vendor/CompleteProfileDetail/Instruction";

// import UploadTAN from "../screens/vendor/CompleteProfileDetail/UploadTAN";
import VendorDetailForm from "../screens/vendor/CompleteProfileDetail/vendorDetailForm";
import PickLocationScreen from "../screens/user/pickLocation/pickLocationScreen";
import PendingApprovalScreen from "../screens/vendor/CompleteProfileDetail/pendingApprovalScreen";
import VendorBottomTabBar from "../components/vendorComponents/vendorBottomTabBar";
import AddStations from "../screens/vendor/pages/addStations/addStations";
import VendorHome from "../screens/vendor/pages/vendorHome/vendorHome";
import AllStations from "../screens/vendor/pages/allStations/allStations";
import StationManagement from "../screens/vendor/pages/stationManagement/stationManagement";

import TermsAndConditionsScreen from "../screens/user/termsAndConditions/termsAndConditionsScreen";
import FaqScreen from "../screens/user/faq/faqScreen";
import PrivacyPolicyScreen from "../screens/user/privacyPolicy/privacyPolicyScreen";
import HelpScreen from "../screens/user/help/helpScreen";
import VendorProfile from "../screens/vendor/pages/vendorProfile/vendorProfile";
import PreviewPage from "../screens/vendor/pages/previewPage/previewPage";
import { useSelector } from "react-redux";
import {
  selectProfileStatus,
  selectUser,
} from "../screens/auth/services/selector"; // Ensure correct import
import { selectloader } from "../screens/auth/services/selector"; // Ensure correct import
import UpdateStation from "../screens/vendor/pages/updateStation/UpdateStation";
import EditProfileVendor from "../screens/vendor/pages/vendorProfile/EditProfileVendor";
import ChangePassword from "../components/commonComponents/changePassword";
import BlockedUserScreen from "../screens/errorPages/blockedUserScreen";


const Stack = createStackNavigator();


export function VendorStack() {
  const user = useSelector(selectUser);
  const status = user?.status;
  const role = user?.role?.toLowerCase();

  if (!user) {
    return null;
  }

  const isVendor = role === "vendor";
  const isActive = status === "Active";
  const isNew = status === "New";
  const isCompleted = status === "Completed";
  const isKYCIncomplete = !user?.pan_no;
  const isKYCComplete = !!user?.pan_no;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isVendor && isKYCIncomplete && isNew && (
        <>
          <Stack.Screen name="Instruction" component={Instruction} />
          <Stack.Screen name="VendorDetailForm" component={VendorDetailForm} />
          <Stack.Screen name="PickLocation" component={PickLocationScreen} />
        </>
      )}

      {isVendor && isCompleted && (
        <>
          <Stack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
          <Stack.Screen name="HelpScreen" component={HelpScreen} />
        </>
      )}

      {isVendor && isActive && isKYCComplete && (
        <>
          <Stack.Screen name="VendorBottomTabBar" component={VendorBottomTabBar} />
          <Stack.Screen name="VendorHome" component={VendorHome} />
          <Stack.Screen name="AllStations" component={AllStations} />
          <Stack.Screen name="EditProfileVendor" component={EditProfileVendor} />
          <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
          <Stack.Screen name="FaqScreen" component={FaqScreen} />
          <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
          <Stack.Screen name="HelpScreen" component={HelpScreen} />
          <Stack.Screen name="VendorProfile" component={VendorProfile} />
          <Stack.Screen name="PickLocation" component={PickLocationScreen} />
          <Stack.Screen name="PreviewPage" component={PreviewPage} />
          <Stack.Screen name="StationManagement" component={StationManagement} />
          <Stack.Screen name="UpdateStation" component={UpdateStation} />
          <Stack.Screen name="AddStations" component={AddStations} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </>
      )}

      {/* ELSE Block for blocked or unrecognized status */}
      {isVendor && !(isNew || isCompleted || isActive) && (
        <>
          <Stack.Screen name="BlockedUserScreen" component={BlockedUserScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
