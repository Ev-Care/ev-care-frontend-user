import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import Instruction from "../screens/vendor/CompleteProfileDetail/Instruction";
import UploadAadhar from "../screens/vendor/CompleteProfileDetail/UploadAadhar";
import UploadPAN from "../screens/vendor/CompleteProfileDetail/UploadPAN";
import UploadTAN from "../screens/vendor/CompleteProfileDetail/UploadTAN";
import UploadStationImage from "../screens/vendor/CompleteProfileDetail/UploadStationImage";
import VendorDetailForm from "../screens/vendor/CompleteProfileDetail/vendorDetailForm";
import PickLocationScreen from "../screens/user/pickLocation/pickLocationScreen";
import VendorAccountDetailsForm from "../screens/vendor/CompleteProfileDetail/vendorAccountDetail";
import PendingApprovalScreen from "../screens/vendor/CompleteProfileDetail/pendingApprovalScreen";
import VendorBottomTabBar from "../components/vendorComponents/vendorBottomTabBar";
import AddStations from "../screens/vendor/pages/addStations/addStations";
import VendorHome from "../screens/vendor/pages/vendorHome/vendorHome";
import AllStations from "../screens/vendor/pages/allStations/allStations";
import StationDetail from "../screens/vendor/pages/stationDetail.js/stationDetail";
import EditProfileScreen from "../screens/user/editProfile/editProfileScreen";
import TermsAndConditionsScreen from "../screens/user/termsAndConditions/termsAndConditionsScreen";
import FaqScreen from "../screens/user/faq/faqScreen";
import PrivacyPolicyScreen from "../screens/user/privacyPolicy/privacyPolicyScreen";
import HelpScreen from "../screens/user/help/helpScreen";
import VendorProfile from "../screens/vendor/pages/vendorProfile/vendorProfile";


// import VendorProfile from "../screens/vendor/pages/vendorProfile/vendorProfile";

const Stack = createStackNavigator();

export function VendorStack() {
  const [isApproved, setApproved] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     
        
          <Stack.Screen name="Instruction" component={Instruction} />
          <Stack.Screen name="UploadAadhar" component={UploadAadhar} />
          <Stack.Screen name="UploadPAN" component={UploadPAN} />
          <Stack.Screen name="UploadTAN" component={UploadTAN} />
          <Stack.Screen name="UploadStationImage" component={UploadStationImage} />
          <Stack.Screen name="VendorDetailForm" component={VendorDetailForm} />
          <Stack.Screen name="PickLocation" component={PickLocationScreen} />
          <Stack.Screen name="VendorAccountDetailsForm" component={VendorAccountDetailsForm} />
          {/* <Stack.Screen name="PendingApprovalScreen">
              {(props) => (
                <PendingApprovalScreen {...props} setApproved={setApproved} />
              )}
            </Stack.Screen> */}
          <Stack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
        <Stack.Screen name="VendorBottomTabBar" component={VendorBottomTabBar} />
         <Stack.Screen name="VendorHome" component={VendorHome} />
        <Stack.Screen name="AllStations" component={AllStations} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
        <Stack.Screen name="FaqScreen" component={FaqScreen} />
        <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="VendorProfile" component={VendorProfile} />
         
      
    </Stack.Navigator>
  );
}
