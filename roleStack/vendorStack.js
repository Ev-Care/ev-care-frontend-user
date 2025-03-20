import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VendorDashboard from "../vendorDashboard/VendorDashboard";

const Stack = createStackNavigator();

export function VendorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VendorDashboard" component={VendorDashboard} />
    </Stack.Navigator>
  );
}
