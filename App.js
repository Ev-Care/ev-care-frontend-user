import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import 'react-native-gesture-handler';

import LoadingScreen from "./components/loadingScreen"
import SplashScreen from "./screens/splashScreen";
import OnboardingScreen from "./screens/onboarding/onboardingScreen";
import SigninScreen from "./screens/auth/signinScreen";
import RegisterScreen from "./screens/auth/registerScreen";
import VerificationScreen from "./screens/auth/verificationScreen";
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import AllChargingStationsScreen from "./screens/allChargingStations/allChargingStationsScreen";

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ ...TransitionPresets.DefaultTransition }} 
        />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen
          name="BottomTabBar"
          component={BottomTabBarScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyApp;
