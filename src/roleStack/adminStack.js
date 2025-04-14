import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminBottomTabBar from "../components/adminComponents/adminBottomTabBar";
import AdminHome from "../screens/admin/adminHome/AdminHomePage";
import AdminProfilePage from "../screens/admin/adminProfile/AdminProfile";
import ViewAllStationsPage from "../screens/admin/viewAllStations/ViewAllStationsPage";
import ViewAllUserPage from "../screens/admin/viewAllUsers/ViewAllUsersPage";


const Stack = createStackNavigator();

export function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="AdminBottomTabBar" component={AdminBottomTabBar} />
      <Stack.Screen name="AdminHome" component={AdminHome} />
      <Stack.Screen name="AdminProfilePage" component={AdminProfilePage} />
      <Stack.Screen name="ViewAllStationsPage" component={ViewAllStationsPage} />
      <Stack.Screen name="ViewAllUserPage" component={ViewAllUserPage} />
    </Stack.Navigator>
  );
}
