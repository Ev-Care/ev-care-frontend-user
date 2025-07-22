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
       useFocusEffect(
  useCallback(() => {
    const backHandlerSub = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const gestureListener = navigation.addListener("gestureEnd", backAction);

    return () => {
      backHandlerSub.remove(); // ← proper unsubscription
      gestureListener();       // ← remove navigation listener
    };
  }, [backAction])
);
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
          tabBarShowLabel: true, 
          tabBarLabelStyle: {
            fontSize: 10, 
            marginTop: 4, 
            fontWeight: '400', 
          },
          tabBarIconStyle: { alignSelf: "center" }, 
          tabBarStyle: styles.tabBarStyle,
        }}
      >
        <Tab.Screen
          name="Home"
          component={AdminHome}
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
            tabBarLabel: 'Home', 
          }}
        />
        <Tab.Screen
          name="stations"
          component={ViewAllStationsPage}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="ev-station"
                    size={22}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="ev-station"
                  size={22}
                  color={Colors.primaryColor}
                />
              ),
            tabBarLabel: 'stations',
          }}
        />
        <Tab.Screen
          name="users"
          component={ViewAllUserPage}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="people"
                    size={24}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="people"
                  size={24}
                  color={Colors.primaryColor}
                />
              ),
            tabBarLabel: 'users', 
          }}
        />
        <Tab.Screen
          name="Profile"
          component={AdminProfilePage}
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
            tabBarLabel: 'Profile', 
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

export default AdminBottomTabBar;


const styles = StyleSheet.create({
  exitInfoWrapStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTabCircleStyle: {
    width: 35.0,
    height: 35.0,
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
   paddingBottom: Platform.OS === "ios" ? 20 : 10, 
  },
});
