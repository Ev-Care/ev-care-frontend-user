import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import { Fonts, Sizes, Colors, commonStyles } from "../../../constants/styles";
import { TabView, TabBar } from "react-native-tab-view";
import { Overlay } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ongoingBookingsList = [
  {
    id: "1",
    chargingStationImage: require("../../../../assets/images/chargingStations/charging_station4.png"),
    chargingStationName: "BYD Charging Point",
    chargingStationAddress: "Near shell petrol station",
    bookingDay: "SUN",
    bookingTime: "08:30 PM",
  },
  {
    id: "2",
    chargingStationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    chargingStationName: "VIDA Station V1",
    chargingStationAddress: "Near opera street",
    bookingDay: "TUE",
    bookingTime: "11:30 AM",
  },
];

const historyBookingsList = [
  {
    id: "1",
    chargingStationImage: require("../../../../assets/images/chargingStations/charging_station4.png"),
    chargingStationName: "BYD Charging Point",
    chargingStationAddress: "Near shell petrol station",
    bookingDate: "10 Aug 2023 ",
    bookingTime: " 11:45 AM",
  },
  {
    id: "2",
    chargingStationImage: require("../../../../assets/images/chargingStations/charging_station5.png"),
    chargingStationName: "VIDA Station V1",
    chargingStationAddress: "Near opera street",
    bookingDate: "05 Aug 2023",
    bookingTime: "04:15 PM",
  },
  {
    id: "3",
    chargingStationImage: require("../../../../assets/images/chargingStations/charging_station1.png"),
    chargingStationName: "TATA EStation",
    chargingStationAddress: "Near orange business hub",
    bookingDate: "10 Aug 2023 ",
    bookingTime: " 11:45 AM",
  },
  {
    id: "4",
    chargingStationImage: require("../../../../assets/images/chargingStations/charging_station2.png"),
    chargingStationName: "HP Charging Station",
    chargingStationAddress: "Near ananta business park",
    bookingDate: "05 Aug 2023",
    bookingTime: "04:15 PM",
  },
];

const BookingScreen = ({ navigation, route }) => {
  const [ongoingBookings, setongoingBookings] = useState(ongoingBookingsList);
  const [selectedOngoingBookingId, setselectedOngoingBookingId] = useState();
  const [showCancelBookingDialog, setshowCancelBookingDialog] = useState(false);

  useEffect(() => {
    if (route.params?.item) {
      changeOngoingBooking({ id: route.params.item.id });
    }
  }, [route.params?.item]);

  const OngoingBookings = ({ navigation, data }) => {
    return (
      <View style={{ flex: 1 }}>
        {data.length == 0 ? noBookingInfo() : bookingsInfo()}
        {cancelBookingDialog()}
      </View>
    );

    function noBookingInfo() {
      return (
        <View style={styles.noDataWrapper}>
          <Image
            source={require("../../../../assets/images/icons/no_booking.png")}
            style={{ width: 100.0, height: 100.0, resizeMode: "contain" }}
          />
          <Text
            style={{
              ...Fonts.grayColor18Medium,
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            You have no booking yet..!
          </Text>
        </View>
      );
    }

    function bookingsInfo() {
      const renderItem = ({ item }) => (
        <View style={styles.bookingInfoWrapStyle}>
          <Image
            source={item.chargingStationImage}
            style={{
              width: 100.0,
              height: "100%",
              borderRadius: Sizes.fixPadding,
            }}
          />
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding * 1.5 }}>
            <Text numberOfLines={1} style={{ ...Fonts.primaryColor16Medium }}>
              {item.bookingDay} - {item.bookingTime}
            </Text>
            <View style={{ marginVertical: Sizes.fixPadding + 5.0 }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
                {item.chargingStationName}
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                {item.chargingStationAddress}
              </Text>
            </View>
            <View style={{ ...commonStyles.rowAlignCenter }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.push("BookingDetail", {
                    detailFor: "ongoing",
                    item: item,
                  });
                }}
                style={{
                  ...styles.datailAndCancelButtonStyle,
                  backgroundColor: Colors.primaryColor,
                  marginRight: Sizes.fixPadding,
                }}
              >
                <Text numberOfLines={1} style={{ ...Fonts.whiteColor14Medium }}>
                  View Detail
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setselectedOngoingBookingId(item.id);
                  setshowCancelBookingDialog(true);
                }}
                style={{
                  ...styles.datailAndCancelButtonStyle,
                  backgroundColor: Colors.whiteColor,
                  marginLeft: Sizes.fixPadding,
                }}
              >
                <Text numberOfLines={1} style={{ ...Fonts.blackColor14Medium }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
      return (
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    function cancelBookingDialog() {
      return (
        <Overlay
          isVisible={showCancelBookingDialog}
          onBackdropPress={() => setshowCancelBookingDialog(false)}
          overlayStyle={styles.dialogStyle}
        >
          <View>
            <View style={styles.dialogClearIconWrapper}>
              <MaterialIcons
                name="clear"
                size={40.0}
                color={Colors.whiteColor}
              />
            </View>
            <Text style={styles.dialogCancelTextStyle}>
              Are you sure want to cancel your charging slot?
            </Text>
            <View
              style={{
                ...commonStyles.rowAlignCenter,
                marginTop: Sizes.fixPadding,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setshowCancelBookingDialog(false);
                }}
                style={{
                  ...styles.noButtonStyle,
                  ...styles.dialogYesNoButtonStyle,
                }}
              >
                <Text style={{ ...Fonts.blackColor16Medium }}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setshowCancelBookingDialog(false);
                  changeOngoingBooking({ id: selectedOngoingBookingId });
                }}
                style={{
                  ...styles.yesButtonStyle,
                  ...styles.dialogYesNoButtonStyle,
                }}
              >
                <Text style={{ ...Fonts.whiteColor16Medium }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Overlay>
      );
    }
  };

  const HistoryBookigs = ({ navigation }) => {
    return <View style={{ flex: 1 }}>{historyBookingsInfo()}</View>;

    function historyBookingsInfo() {
      const renderItem = ({ item }) => (
        <View style={styles.bookingInfoWrapStyle}>
          <Image
            source={item.chargingStationImage}
            style={{
              width: 100.0,
              height: "100%",
              borderRadius: Sizes.fixPadding,
            }}
          />
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding * 1.5 }}>
            <Text numberOfLines={1} style={{ ...Fonts.primaryColor16Medium }}>
              {item.bookingDate} - {item.bookingTime}
            </Text>
            <View style={{ marginVertical: Sizes.fixPadding + 5.0 }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
                {item.chargingStationName}
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                {item.chargingStationAddress}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("BookingDetail", {
                  detailFor: "history",
                  item: item,
                });
              }}
              style={{ ...styles.historyViewDetailButtonStyle }}
            >
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor14Medium }}>
                View Detail
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
      return (
        <FlatList
          data={historyBookingsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
        />
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {tabView()}
      </View>
    </View>
  );

  function changeOngoingBooking({ id }) {
    const copyData = ongoingBookings;
    const newData = copyData.filter((i) => i.id !== id);
    setongoingBookings(newData);
  }

  function tabView() {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: "first", title: "Ongoing booking" },
      { key: "second", title: "Booking history" },
    ]);

    const renderScene = ({ route, jumpTo }) => {
      switch (route.key) {
        case "first":
          return (
            <OngoingBookings navigation={navigation} data={ongoingBookings} />
          );
        case "second":
          return <HistoryBookigs navigation={navigation} />;
      }
    };

    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              indicatorStyle={styles.tabIndicatorStyle}
              style={styles.tabBarStyle}
              renderLabel={({ route, focused }) => (
                <Text
                  numberOfLines={1}
                  style={{
                    color: "rgb(49, 49, 49)", 
                    lineHeight: 20.0,
                    paddingTop: Sizes.fixPadding - 5.0,
                    ...Fonts.blackColor18Medium, 
                  }}
                >
                  {route.title}
                </Text>
              )}
              pressColor={Colors.extraLightGrayColor}
            />
          );
        }}
      />
    );
  }

  function header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor20SemiBold,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        My Bookings
      </Text>
    );
  }
};

export default BookingScreen;

const styles = StyleSheet.create({
  tabBarStyle: {
    elevation: 0.0,
    backgroundColor: Colors.bodyBackColor,
    marginTop: -(Sizes.fixPadding - 5.0),
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 2.0,
  },
  tabIndicatorStyle: {
    elevation: 0.0,
    height: 2.0,
    backgroundColor: Colors.primaryColor,
  },
  datailAndCancelButtonStyle: {
    flex: 1,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    ...commonStyles.shadow,
    padding: Sizes.fixPadding - 2.0,
  },
  bookingInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginTop: Sizes.fixPadding - 5.0,
    flexDirection: "row",
    padding: Sizes.fixPadding * 2.0,
  },
  noDataWrapper: {
    flex: 1,
    margin: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogClearIconWrapper: {
    alignSelf: "center",
    width: 50.0,
    height: 50.0,
    borderRadius: 25.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C30707",
    marginTop: Sizes.fixPadding * 2.0,
  },
  dialogYesNoButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
    padding: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  noButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  yesButtonStyle: {
    borderTopColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
  dialogCancelTextStyle: {
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    textAlign: "center",
    ...Fonts.blackColor18Medium,
  },
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: "85%",
    padding: 0.0,
    elevation: 0,
  },
  historyViewDetailButtonStyle: {
    flex: 1,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    ...commonStyles.shadow,
    alignSelf: "flex-end",
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding - 2.0,
  },
});
