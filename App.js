import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import "react-native-gesture-handler";
import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/loadingScreen";
import SplashScreen from "./screens/splashScreen";
import OnboardingScreen from "./screens/onboarding/onboardingScreen";
import SigninScreen from "./screens/auth/signinScreen";
import RegisterScreen from "./screens/auth/registerScreen";
import VerificationScreen from "./screens/auth/verificationScreen";
import { AdminStack } from "./roleStack/adminStack";
import { UserStack } from "./roleStack/userStack";
import { VendorStack } from "./roleStack/vendorStack";


LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

function MyApp() {
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      setIsAuthenticated(false); 
      setUserType(null);
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {!isAuthenticated ? (
          // Non-registered users will see these screens
          <>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ ...TransitionPresets.DefaultTransition }}
            />
             <Stack.Screen name="Loading" component={ LoadingScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Signin">
              {(props) => <SigninScreen {...props} setUserType={setUserType} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
          </>
        ) : userType === "user" ? (
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

export default MyApp;
