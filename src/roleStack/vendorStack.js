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
// import VendorProfile from "../screens/vendor/pages/vendorProfile/vendorProfile";

const Stack = createStackNavigator();

export function VendorStack() {
  const [isApproved, setApproved] = useState(true);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isApproved ? (
        <>
          <Stack.Screen name="Instruction" component={Instruction} />
          <Stack.Screen name="UploadAadhar" component={UploadAadhar} />
          <Stack.Screen name="UploadPAN" component={UploadPAN} />
          <Stack.Screen name="UploadTAN" component={UploadTAN} />
          <Stack.Screen name="UploadStationImage" component={UploadStationImage} />
          <Stack.Screen name="VendorDetailForm" component={VendorDetailForm} />
          <Stack.Screen name="PickLocation" component={PickLocationScreen} />
          <Stack.Screen name="VendorAccountDetailsForm" component={VendorAccountDetailsForm} />
          <Stack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
        </>
      ) : ( <>
        <Stack.Screen name="VendorBottomTabBar" component={VendorBottomTabBar} />
         {/* <Stack.Screen name="AddStations" component={AddStations} /> */}
        <Stack.Screen name="AllStations" component={AllStations} />
        <Stack.Screen name="StationDetail" component={StationDetail} />
         </>
      )}
    </Stack.Navigator>
  );
}
