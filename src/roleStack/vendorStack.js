import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import Instruction from "../screens/vendor/CompleteProfileDetail/Instruction";
import UploadAadhar from "../screens/vendor/CompleteProfileDetail/UploadAadhar";
import UploadPAN from "../screens/vendor/CompleteProfileDetail/UploadPAN";
import UploadTAN from "../screens/vendor/CompleteProfileDetail/UploadTAN";
import VendorDetailForm from "../screens/vendor/CompleteProfileDetail/vendorDetailForm";
import PickLocationScreen from "../screens/user/pickLocation/pickLocationScreen";
import VendorAccountDetailsForm from "../screens/vendor/CompleteProfileDetail/vendorAccountDetail";
import PendingApprovalScreen from "../screens/vendor/CompleteProfileDetail/pendingApprovalScreen";
import VendorBottomTabBar from "../components/vendorComponents/vendorBottomTabBar";
import AddStations from "../screens/vendor/pages/addStations/addStations";
import VendorHome from "../screens/vendor/pages/vendorHome/vendorHome";
import AllStations from "../screens/vendor/pages/allStations/allStations";
import StationManagement from "../screens/vendor/pages/stationManagement/stationManagement";
import EditProfileScreen from "../screens/user/editProfile/editProfileScreen";
import TermsAndConditionsScreen from "../screens/user/termsAndConditions/termsAndConditionsScreen";
import FaqScreen from "../screens/user/faq/faqScreen";
import PrivacyPolicyScreen from "../screens/user/privacyPolicy/privacyPolicyScreen";
import HelpScreen from "../screens/user/help/helpScreen";
import VendorProfile from "../screens/vendor/pages/vendorProfile/vendorProfile";
import PreviewPage from "../screens/vendor/pages/previewPage/previewPage";
import { useSelector } from "react-redux";
import { selectProfileStatus, selectUser } from "../screens/auth/services/selector"; // Ensure correct import
import { selectloader } from "../screens/auth/services/selector"; // Ensure correct import
import UpdateStation from "../screens/vendor/pages/updateStation/UpdateStation";

// import VendorProfile from "../screens/vendor/pages/vendorProfile/vendorProfile";
const Stack = createStackNavigator();

export function VendorStack() {
  // const [isApproved, setApproved] = useState(null);
  const user = useSelector(selectUser); // Get user data
  // console.log("user in vendor stack", user);
  console.log("user role in vendor stack", user?.role.toLowerCase());

  useEffect(() => {

  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user && user.role.toLowerCase() === "vendor" && (user.pan_no === null || user.tan_no === null || user.adhar_no === null) ? (
        <>
        {console.log("inside vendor stack")}
          <Stack.Screen name="Instruction" component={Instruction} />
          <Stack.Screen name="UploadAadhar" component={UploadAadhar} />
          <Stack.Screen name="UploadPAN" component={UploadPAN} />
          <Stack.Screen name="UploadTAN" component={UploadTAN} />
      
          <Stack.Screen name="VendorDetailForm" component={VendorDetailForm} />
          <Stack.Screen name="PickLocation" component={PickLocationScreen} />
          <Stack.Screen name="VendorAccountDetailsForm" component={VendorAccountDetailsForm} />
          <Stack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
        </>
      ) : (
        <>
        {user && user.role.toLowerCase() === "vendor" && (user.pan_no !== null && user.tan_no !== null && user.adhar_no !== null)}
          <Stack.Screen name="VendorBottomTabBar" component={VendorBottomTabBar} />
          <Stack.Screen name="VendorHome" component={VendorHome} />
          <Stack.Screen name="AllStations" component={AllStations} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
          <Stack.Screen name="FaqScreen" component={FaqScreen} />
          <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
          <Stack.Screen name="HelpScreen" component={HelpScreen} />
          <Stack.Screen name="VendorProfile" component={VendorProfile} />
          <Stack.Screen name="PickLocation" component={PickLocationScreen} />
          <Stack.Screen name="PreviewPage" component={PreviewPage} />
          <Stack.Screen name="StationManagement" component={StationManagement} />
          <Stack.Screen name="UpdateStation" component={UpdateStation} />
        </>
      )}
    </Stack.Navigator>
  );
}
