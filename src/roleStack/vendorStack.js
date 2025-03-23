import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Instruction from "../screens/vendor/CompleteProfileDetail/Instruction";
import UploadAadhar from "../screens/vendor/CompleteProfileDetail/UploadAadhar";
import UploadPAN from "../screens/vendor/CompleteProfileDetail/UploadPAN";
import UploadTAN from "../screens/vendor/CompleteProfileDetail/UploadTAN";
import UploadStationImage from "../screens/vendor/CompleteProfileDetail/UploadStationImage";
import VendorDetailForm from "../screens/vendor/CompleteProfileDetail/vendorDetailForm";
import PickLocationScreen from "../screens/user/pickLocation/pickLocationScreen";
import VendorAccountDetailsForm from "../screens/vendor/CompleteProfileDetail/vendorAccountDetail";
import PendingApprovalScreen from "../screens/vendor/CompleteProfileDetail/pendingApprovalScreen";
const Stack = createStackNavigator();

export function VendorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Instruction" component={ Instruction} />
      <Stack.Screen name="UploadAadhar" component={UploadAadhar} />
      <Stack.Screen name="UploadPAN" component={UploadPAN} />
      <Stack.Screen name="UploadTAN" component={UploadTAN} />
      <Stack.Screen name="UploadStationImage" component={ UploadStationImage} />
      <Stack.Screen name="VendorDetailForm" component={VendorDetailForm} />
      <Stack.Screen name="PickLocation" component={PickLocationScreen} />
      <Stack.Screen name="VendorAccountDetailsForm" component={VendorAccountDetailsForm} />
      <Stack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
    </Stack.Navigator>
  );
}
