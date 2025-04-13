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
import  store  from "./redux/store/store";
import { selectUser, selectProfileStatus } from "./screens/auth/services/selector"; // Ensure correct import

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

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

function AppNavigator() {
  const [userType, setUserType] = useState(null);
  const user = useSelector( selectUser); // Get user data
  const profileStatus = useSelector(selectProfileStatus);

  useEffect(() => {

    // if (user && user.role) { 
      if (true) { 
     
        // setUserType(user.role.toLowerCase());
        setUserType("admin");
    } else {
        setUserType(null);
    }
}, [user]);


  // Function to handle role-based navigation
  const renderRoleStack = () => {
    console.log("User role in renderRoleStack:", userType);
    switch (userType) {
      case "user":
        return <Stack.Screen name="UserStack" component={UserStack} />;
      case "admin":
        return <Stack.Screen name="AdminStack" component={AdminStack} />;
      case "vendor":
        return <Stack.Screen name="VendorStack" component={VendorStack} />;
      default:
        return <Stack.Screen name="Loading" component={LoadingScreen} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {!userType ? (
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
            <Stack.Screen name="Signin"  component={SigninScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Verification">
              {(props) => (
                <VerificationScreen {...props} setUserType={setUserType} />
              )}
            </Stack.Screen>
          </>
        ) : (
          renderRoleStack()
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function MyApp() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
