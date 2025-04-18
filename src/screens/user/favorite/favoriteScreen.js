import {
  StyleSheet,
  Text,
  View,
  Platform,
  Linking,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState,useRef  } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  screenWidth,
  commonStyles,
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
// import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SwipeListView } from "react-native-swipe-list-view";
import { Snackbar } from "react-native-paper";
import { useSelector } from "react-redux";
import { selectFavoriteStations, selectStations } from "../service/selector";
import imageURL from "../../../constants/baseURL";
import { RefreshControl } from 'react-native';


const FavoriteScreen = ({navigation}) => {
  const [showSnackBar, setShowSnackBar] = useState(false);
 const stations = useSelector(selectStations);
 const favStations = useSelector(selectFavoriteStations);
 const [listData, setListData] = useState([...favStations]);
  const [refreshing, setRefreshing] = useState(false);
console.log("stations in favorite",stations.length);

 const formatDistance = (distance) => {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(1).replace(/\.0$/, '') + 'k km';
  } else if (distance % 1 !== 0) {
    return distance.toFixed(1) + ' km';
  } else {
    return distance + ' km';
  }
};

const openGoogleMaps = (latitude,longitude) => {
  const url = Platform.select({
    ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
  });
  Linking.openURL(url);
};
const handleRefresh = () => {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false);
    console.log("Refresh completed!");
  }, 2000); 
}
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {listData?.length === 0 ? noItemsInfo() : favoriteItems()}
      </View>
      {snackBar()}
    </View>
  );

  function noItemsInfo() {
    return (
      <View style={styles.noItemsInfoWrapStyle}>
        <Image
          source={require("../../../../assets/images/icons/heart_broken.png")}
          style={{ width: 100.0, height: 100.0, resizeMode: "contain" }}
        />
        <Text
          style={{
            ...Fonts.grayColor18Medium,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Your favorite list is empty..!
        </Text>
      </View>
    );
  }

  function favoriteItems() {
    const closeRow = (rowMap, rowKey) => {
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    };

    const renderHiddenItem = (data, rowMap) => (
      <View style={{ alignItems: "center", flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.backDeleteContinerStyle }}
          onPress={() => deleteRow(rowMap, data.item.key)}
        >
          <View style={styles.deleteIconWrapper}>
            <MaterialIcons name="delete" size={22} color={Colors.whiteColor} />
          </View>
        </TouchableOpacity>
      </View>
    );

    const deleteRow = (rowMap, rowKey) => {
      closeRow(rowMap, rowKey);
      const newData = [...listData];
      const prevIndex = listData.findIndex((item) => item.key === rowKey);
      newData.splice(prevIndex, 1);
      setShowSnackBar(true);
      setListData(newData);
    };

    const renderItem = (data) => (
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("ChargingStationDetail",{item:data.item});
          }}
          style={styles.enrouteChargingStationWrapStyle}
        >
           <Image
  source={
    data.item.station_images
    ? { uri: imageURL.baseURL + data.item.station_images }
      : { uri: "https://plus.unsplash.com/premium_photo-1715639312136-56a01f236440?q=80&w=2057&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  }
  style={styles.enrouteChargingStationImage}
/>
          <View style={styles.enrouteStationOpenCloseWrapper}>
          <Text
       style={[
     styles.statusClosed,
    {
      color: data.item.status === "Inactive" ? "#FF5722" : "white",
    },
  ]}
>
  {data.item.status === "Inactive" ? "Closed" : "Open"}
</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ margin: Sizes.fixPadding }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
                {data.item.station_name}
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                {data.item.address}
              </Text>
              <View
                style={{
                  marginTop: Sizes.fixPadding,
                  ...commonStyles.rowAlignCenter,
                }}
              >
                <View style={{ ...commonStyles.rowAlignCenter }}>
                  <Text style={{ ...Fonts.blackColor18Medium }}>
                   3.5
                  </Text>
                  <MaterialIcons
                    name="star"
                    color={Colors.yellowColor}
                    size={20}
                  />
                </View>
                <View
                  style={{
                    marginLeft: Sizes.fixPadding * 2.0,
                    ...commonStyles.rowAlignCenter,
                    flex: 1,
                  }}
                >
                  <View style={styles.primaryColorDot} />
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: Sizes.fixPadding,
                      ...Fonts.grayColor14Medium,
                      flex: 1,
                    }}
                  >
                    {data.item.chargers.length} Charging Points
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                ...commonStyles.rowAlignCenter,
                paddingLeft: Sizes.fixPadding,
                marginTop: Sizes.fixPadding,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor16Medium,
                  flex: 1,
                  marginRight: Sizes.fixPadding - 5.0,
                }}
              >
                {formatDistance(data.item.distance_km)}
              </Text>
               <TouchableOpacity onPress={()=>openGoogleMaps(data.item.coordinates.latitude,data.item.coordinates.longitude)} style={styles.getDirectionButton}>
               
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                  Get Direction
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={{ flex: 1 }}>
        <SwipeListView
         refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9Bd35A', '#689F38']}  // for Android
            tintColor="#689F38"              // for iOS
          />
        }
          data={listData}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-66}
          useNativeDriver={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
        />
      </View>
    );
  }

  function snackBar() {
    return (
      <Snackbar
        style={styles.snackBarStyle}
        elevation={0}
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Charging station remove from favorite
        </Text>
      </Snackbar>
    );
  }

  function header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor20SemiBold,
          margin: Sizes.fixPadding * 2.0,
          // marginTop:50,
        }}
      >
        Favorite
      </Text>
    );
  }
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  noItemsInfoWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIconWrapper: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: Colors.redColor,
    alignItems: "center",
    justifyContent: "center",
  },
  backDeleteContinerStyle: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    width: 66,
    paddingRight: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    marginBottom: Sizes.fixPadding + 5.0,
  },
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  enrouteChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  enrouteChargingStationImage: {
    width: screenWidth / 3.2,
    height: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  enrouteStationOpenCloseWrapper: {
    position: "absolute",
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  primaryColorDot: {
    width: 10.0,
    height: 10.0,
    borderRadius: 5.0,
    backgroundColor: Colors.primaryColor,
  },
  snackBarStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
