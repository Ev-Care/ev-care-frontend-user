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
import CreateUser from "../screens/admin/createUser/CreateUser";
import ViewAllIssuesPage from "../screens/admin/supportIssues/AllSupportIssues";
import EditAdminProfile from "../screens/admin/adminProfile/EditProfileAdmin";
import PrivacyPolicyScreen from "../screens/user/privacyPolicy/privacyPolicyScreen";
import TermsAndConditionsScreen from "../screens/user/termsAndConditions/termsAndConditionsScreen";
import SupportIssuesDetail from "../screens/admin/supportIssues/SupportIssuesDetail";

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
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="ViewAllIssuesPage" component={ViewAllIssuesPage} />
      <Stack.Screen name="EditAdminProfile" component={EditAdminProfile} />
      <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="SupportIssuesDetail" component={SupportIssuesDetail} />
     
    </Stack.Navigator>
  );
}