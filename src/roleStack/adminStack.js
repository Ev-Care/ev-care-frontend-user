import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminBottomTabBar from "../components/adminComponents/adminBottomTabBar";
import AdminHome from "../screens/admin/adminHome/AdminHomePage";
import AdminProfilePage from "../screens/admin/adminProfile/AdminProfile";
import ViewAllStationsPage from "../screens/admin/viewAllStations/ViewAllStationsPage";
import ViewAllUserPage from "../screens/admin/viewAllUsers/ViewAllUsersPage";
import AllPendingVendors from "../screens/admin/verifyVendors/AllPendingVendors";
import AllPendingStations from "../screens/admin/verifyStations/AllPendingStations";
import StationDetailToVerify from "../screens/admin/verifyStations/StationDetailToVerify";
import StationDetailPage from "../screens/admin/viewAllStations/StationDetailPage";
import UpdateUser from "../screens/admin/viewAllUsers/UpdateUser";
import VerifyVendorProfile from "../screens/admin/verifyVendors/VerifyVendorProfile";


const Stack = createStackNavigator();

export function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="AdminBottomTabBar" component={AdminBottomTabBar} />
      <Stack.Screen name="AdminHome" component={AdminHome} />
      <Stack.Screen name="AdminProfilePage" component={AdminProfilePage} />
      <Stack.Screen name="ViewAllStationsPage" component={ViewAllStationsPage} />
      <Stack.Screen name="ViewAllUserPage" component={ViewAllUserPage} />
      <Stack.Screen name="AllPendingVendors" component={AllPendingVendors} />
      <Stack.Screen name="AllPendingStations" component={AllPendingStations} />
      <Stack.Screen name="StationDetailToVerify" component={StationDetailToVerify} />
      <Stack.Screen name="StationDetailPage" component={StationDetailPage} />
      <Stack.Screen name="UpdateUser" component={UpdateUser} />
      <Stack.Screen name="VerifyVendorProfile" component={VerifyVendorProfile} />
     
    </Stack.Navigator>
  );
}