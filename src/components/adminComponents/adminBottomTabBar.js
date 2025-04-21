import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  BackHandler,
  Text,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AdminHome from "../../screens/admin/adminHome/AdminHomePage";
import AdminProfilePage from "../../screens/admin/adminProfile/AdminProfile";

import ViewAllUserPage from "../../screens/admin/viewAllUsers/ViewAllUsersPage";
import ViewAllStationsPage from "../../screens/admin/viewAllStations/ViewAllStationsPage";

const Tab = createBottomTabNavigator();
const AdminBottomTabBar = ({ navigation }) => {
  const [backClickCount, setBackClickCount] = useState(0);

  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount === 1 ? BackHandler.exitApp() : _spring();
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
    }, [backClickCount])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

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
          name="AdminHome"
          component={AdminHome}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="home"
                size={26}
                color={focused ? Colors.primaryColor : Colors.grayColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ViewAllStationsPage"
          component={ViewAllStationsPage}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="ev-station"
                size={26}
                color={focused ? Colors.primaryColor : Colors.grayColor}
              />
            ),
          }}
        />
      
        <Tab.Screen
          name="ViewAllUserPage"
          component={ViewAllUserPage}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="people-outline"
                size={26}
                color={focused ? Colors.primaryColor : Colors.grayColor}
              />
            ),
          }}
        />

        <Tab.Screen
          name="AdminProfilePage"
          component={AdminProfilePage}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="person"
                size={26}
                color={focused ? Colors.primaryColor : Colors.grayColor}
              />
            ),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </>
  );

  function exitInfo() {
    return backClickCount === 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default AdminBottomTabBar;

const styles = StyleSheet.create({
  floatingButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    shadowColor: Colors.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  tabBarStyle: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderTopColor: Colors.extraLightGrayColor,
    borderTopWidth: 1.0,
    height: Platform.OS === "ios" ? 100.0 : 70.0,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  exitInfoWrapStyle: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
});
