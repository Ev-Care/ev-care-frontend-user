import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import "react-native-gesture-handler";
import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store/store";

// Screens
import LoadingScreen from "./screens/loadingScreen";
import SecondSplashScreen from "./screens/secondSplashScreen";
import FirstSplashScreen from "./screens/firstSplashScreen";
import OnboardingScreen from "./screens/onboardingScreen";
import SigninScreen from "./screens/auth/signinScreen";
import RegisterScreen from "./screens/auth/registerScreen";
import VerificationScreen from "./screens/auth/verificationScreen";

// Role-based stacks
import { AdminStack } from "./roleStack/adminStack";
import { UserStack } from "./roleStack/userStack";
import { VendorStack } from "./roleStack/vendorStack";

// import { selectUser } from "./screens/auth/services/selector";
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

function AppNavigator() {
  const [userType, setUserType] = useState("user");
  // const user = useSelector(selectUser);
  


  // useEffect(() => {
  //   if (user) {
  //     console.log("User logged in: ", user.name, " role: ", user.role);
  //     setUserType(user.role); // Update role when user logs in
  //   }
  // }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {!userType ? (
          // Non-registered users see these screens
          <>
            <Stack.Screen
              name="FirstSplashScreen"
              component={FirstSplashScreen}
              options={{ ...TransitionPresets.DefaultTransition }}
            />
            <Stack.Screen
              name="SecondSplashScreen"
              component={SecondSplashScreen}
              options={{ ...TransitionPresets.DefaultTransition }}
            />
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Signin" component={SigninScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Verification">
              {(props) => <VerificationScreen {...props} setUserType={setUserType} />}
            </Stack.Screen>
          </>
        ) : userType=== "user" ? (
          <Stack.Screen name="UserStack" component={UserStack} />
        ) : userType === "admin" ? (
          <Stack.Screen name="AdminStack" component={AdminStack} />
        ) : userType === "vendor" ? (
          <Stack.Screen name="VendorStack" component={VendorStack} />
        ) : (
          <Stack.Screen name="Loading" component={LoadingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function MyApp() {
  return (
    // <Provider store={store}>
      <AppNavigator />
    // </Provider>
  );
}
