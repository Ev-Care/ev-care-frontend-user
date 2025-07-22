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
import VendorHome from "../../screens/vendor/pages/vendorHome/vendorHome";
import AddStations from "../../screens/vendor/pages/addStations/addStations";
import VendorProfile from "../../screens/vendor/pages/vendorProfile/vendorProfile";
import AllStations from "../../screens/vendor/pages/allStations/allStations";
const Tab = createBottomTabNavigator();

const VendorBottomTabBar = ({ navigation }) => {
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
          component={VendorHome}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="home"
                size={26}
                color={focused ? Colors.primaryColor : Colors.grayColor}
              />
            ),
            tabBarLabel: 'Home', 
          }}
        />
       <Tab.Screen
          name="Stations"
          component={AllStations}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="ev-station"
                size={26}
                color={focused ? Colors.primaryColor : Colors.grayColor}
              />
            ),
            tabBarLabel: 'Stations', 
          }}
        />

        <Tab.Screen
          name="Profile"
          component={VendorProfile}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="person"
                size={26}
                color={focused ? Colors.primaryColor : Colors.grayColor}
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

export default VendorBottomTabBar;


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
