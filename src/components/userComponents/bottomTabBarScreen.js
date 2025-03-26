import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import { View, StyleSheet, Text, BackHandler, Platform } from "react-native";
import HomeScreen from "../../screens/user/home/homeScreen";
import ProfileScreen from "../../screens/user/profile/profileScreen";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import EnrouteScreen from "../../screens/user/enroute/enrouteScreen";
import FavoriteScreen from "../../screens/user/favorite/favoriteScreen";
import BookingScreen from "../../screens/user/booking/bookingScreen";
import ChargingStationsOnMapScreen from "../../screens/user/chargingStationsOnMap/chargingStationsOnMapScreen";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const BottomTabBarScreen = ({ navigation }) => {
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      navigation.addListener("gestureEnd", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
        navigation.removeListener("gestureEnd", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primaryColor,
          tabBarInactiveTintColor: Colors.lightGrayColor,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarIconStyle: { alignSelf: "center" }, 
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="home"
                    size={26}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="home"
                  size={26}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
        <Tab.Screen
          name="Enroute"
          component={EnrouteScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <FontAwesome5
                    name="route"
                    size={22}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <FontAwesome5
                  name="route"
                  size={22}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
        {/* <Tab.Screen
          name="Booking"
          component={BookingScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="receipt-long"
                    size={24}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="receipt-long"
                  size={24}
                  color={Colors.primaryColor}
                />
              ),
          }}
        /> */}
          <Tab.Screen
          name="Map"
          component={ChargingStationsOnMapScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="location-on"
                    size={24}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="location-on"
                  size={24}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
        <Tab.Screen
          name="Favorite"
          component={FavoriteScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="favorite"
                    size={24}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="favorite"
                  size={24}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="person"
                    size={25}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="person"
                  size={25}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default BottomTabBarScreen;

const styles = StyleSheet.create({
  exitInfoWrapStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTabCircleStyle: {
    width: 45.0,
    height: 45.0,
    borderRadius: 25.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarStyle: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderTopColor: Colors.extraLightGrayColor,
    borderTopWidth: 1.0,
    height: Platform.OS == "ios" ? 100.0 : 70.0,
    paddingTop:10,
   paddingBottom: Platform.OS === "ios" ? 20 : 10, // 👈 Helps with centering
  },
});
