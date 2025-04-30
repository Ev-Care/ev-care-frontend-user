import {
  StyleSheet,
  Text,
  View,
  Platform,
  Linking,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  screenWidth,
  commonStyles,
} from "../../../constants/styles";
import MyStatusBar from "../../../components/myStatusBar";
// import { useNavigation } from "@react-navigation/native";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SwipeListView } from "react-native-swipe-list-view";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { selectFavoriteStations, selectStations, selectStationsError, selectStationsLoading } from "../service/selector";
import imageURL from "../../../constants/baseURL";
import {
  default as Icon,
  default as MaterialIcons,
} from "react-native-vector-icons/MaterialIcons";
import {
  unFavoriteStation,
  getAllFavoriteStations,
} from "../service/crudFunction";
import { selectUser } from "../../auth/services/selector";
import { openHourFormatter, formatDistance, getChargerLabel } from "../../../utils/globalMethods";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";

const FavoriteScreen = ({ navigation }) => {
  const [showSnackBar, setShowSnackBar] = useState(false);
  const stations = useSelector(selectStations);
  const user = useSelector(selectUser);
  const favStations = useSelector(selectFavoriteStations);
  const isLoading = useSelector(selectStationsLoading);
  const dispatch = useDispatch();
  const [listData, setListData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const errorMessage = useSelector(selectStationsError);

  useEffect(() => {
    const fetchFavoritesAndFilter = async () => {
      const favResponse = await dispatch(getAllFavoriteStations({ user_key: user?.user_key }));

      if (getAllFavoriteStations.fulfilled.match(favResponse)) {
        // dispatch(showSnackbar({ message: 'Favorite stations found.', type: "success" }));
      } else if (getAllFavoriteStations.rejected.match(favResponse)) {
        dispatch(showSnackbar({ message: errorMessage || "Failed to fetch favorite stations.", type: "error" }));
      }

      if (stations && favStations) {
        const filtered = favStations
          .map((fav) => stations.find((station) => station.id == fav.station.id))
          .filter(Boolean);

        setListData(filtered);
      }
    };

    fetchFavoritesAndFilter();
  }, [user?.user_key, dispatch]);

  // console.log("stations in  stations fav screen", stations.length);
  // console.log("stations in fav stations fav screen", favStations.length);
  //   console.log("stations in listData fav screen", listData.length);

  const handleRefresh = async () => {

    const favResponse = await dispatch(getAllFavoriteStations({ user_key: user?.user_key }));

    if (getAllFavoriteStations.fulfilled.match(favResponse)) {
      // dispatch(showSnackbar({ message: 'Favorite stations found.', type: "success" }));
    } else if (getAllFavoriteStations.rejected.match(favResponse)) {
      dispatch(showSnackbar({ message: errorMessage || "Failed to fetch favorite stations.", type: "error" }));
    }
    if (stations && favStations) {
      const filtered = favStations
        .map((fav) => stations.find((station) => station.id == fav.station.id))
        .filter(Boolean);

      setListData(filtered);
    }
  };

  const openGoogleMaps = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
          n  </View>
         ) : (
        <View style={{ flex: 1 }}>
          {header()}
          {favoriteItems()}
        </View>
      )}
      {snackBar()}
    </View>
  );

 

  function favoriteItems() {
    
function noItemsInfo() {
      return (
        <View style={[styles.noItemsInfoWrapStyle,{ paddingVertical:"60%",}]}>
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
    const closeRow = (rowMap, rowKey) => {
      if (rowMap?.[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    };

    const renderHiddenItem = (data, rowMap) => (
      <View style={{ alignItems: "center", flex: 1 }}>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.backDeleteContinerStyle }}
          onPress={() => deleteRow(rowMap, data?.item?.id)}
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
      const prevIndex = listData.findIndex((item) => item?.key === rowKey);
      if (prevIndex !== -1) {
        newData.splice(prevIndex, 1);
        setShowSnackBar(true);
        setListData(newData);
      }
      dispatch(unFavoriteStation({ stationId: rowKey, userId: user.id }));
      dispatch(getAllFavoriteStations({ user_key: user?.user_key }));
    };

    const renderItem = (data) => (
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("ChargingStationDetail", { item: data?.item });
          }}
          style={styles.enrouteChargingStationWrapStyle}
        >
          <Image
            source={
              data?.item?.station_images
                ? { uri: imageURL.baseURL + data.item.station_images }
                : {
                  uri: "https://plus.unsplash.com/premium_photo-1715639312136-56a01f236440?q=80&w=2057&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }
            }
            style={styles.enrouteChargingStationImage}
          />
          <View style={styles.enrouteStationOpenCloseWrapper}>
            <Text
              style={[
                styles.statusClosed,
                {
                  color:
                    data?.item?.status === "Inactive" ? "#FF5722" : "white",
                },
              ]}
            >
              {data?.item?.status === "Inactive" ? "Closed" : "Open"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ margin: Sizes.fixPadding }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
                {data?.item?.station_name}
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                {data?.item?.address}
              </Text>


                <View
                           style={{
                             marginTop: Sizes.fixPadding,
                            ...commonStyles.rowSpaceBetween,
                            
                           }}
                         >
                           {/* Left Section */}
                           <View style={{    ...commonStyles.rowAlignCenter }}>
                             <Text style={{ ...Fonts.blackColor16Medium }}>
                               {openHourFormatter(
                                 data?.item?.open_hours_opening_time,
                                 data?.item?.open_hours_closing_time
                               )}
                             </Text>
                           </View>
             
                           {/* Right Section */}
                           <View style={{  ...commonStyles.rowAlignCenter }}>
                             <View style={styles.primaryColorDot} />
                             <Text
                               numberOfLines={1}
                               style={{
                                 marginLeft: Sizes.fixPadding,
                                 ...Fonts.grayColor14Medium,
                                 maxWidth: 150, // optional: limit text to prevent overflow
                               }}
                              >
                               {getChargerLabel( data?.item?.chargers?.length ?? 0)}
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
                {formatDistance(data?.item?.distance_km)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  openGoogleMaps(
                    data?.item?.coordinates?.latitude,
                    data?.item?.coordinates?.longitude
                  )
                }
                style={styles.getDirectionButton}
              >
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
        <View style={{ flex: 1 }}>
      <SwipeListView
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-66}
        useNativeDriver={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
        ListEmptyComponent={noItemsInfo} // for no fav stations
      />
    </View>
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
          Charging station removed from favorite
        </Text>
      </Snackbar>
    );
  }

  function header() {
    return (
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Favorite Stations</Text>
        <View style={{ width: 24 }} />
      </View>
    );
  }
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  noItemsInfoWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
    flex: 1,
    alignItems: "center",
  absolute:"true",
 
    justifyContent: "center",
  },

  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bodyBackColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0eb",
    elevation: 5
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
