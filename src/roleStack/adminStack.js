import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminDashboard from "../adminDashboard/AdminDashboard";

const Stack = createStackNavigator();

export function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );
}
