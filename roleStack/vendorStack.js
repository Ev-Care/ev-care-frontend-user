import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Instruction from "../vendorDashboard/CompleteProfileDetail/Instruction";
import UploadAadhar from "../vendorDashboard/CompleteProfileDetail/UploadAadhar";
import UploadPAN from "../vendorDashboard/CompleteProfileDetail/UploadPAN";
import UploadTAN from "../vendorDashboard/CompleteProfileDetail/UploadTAN";
import UploadStationImage from "../vendorDashboard/CompleteProfileDetail/UploadStationImage";
import VendorDetailForm from "../vendorDashboard/CompleteProfileDetail/vendorDetailForm";
import PickLocationScreen from "../screens/pickLocation/pickLocationScreen";
import VendorAccountDetailsForm from "../vendorDashboard/CompleteProfileDetail/vendorAccountDetail";
import PendingApprovalScreen from "../vendorDashboard/CompleteProfileDetail/pendingApprovalScreen";
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
