import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import {
  Colors,
  Sizes,
  Fonts,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import CollapsibleToolbar from "react-native-collapsible-toolbar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import rating from "../../components/rating";

import { Snackbar } from "react-native-paper";

const aminitiesList = [
  {
    id: "1",
    aminityImage: require("../../assets/images/aminities/aminity1.png"),
    aminity: "Washroom",
  },
  {
    id: "2",
    aminityImage: require("../../assets/images/aminities/aminity2.png"),
    aminity: "Sitting area",
  },
  {
    id: "3",
    aminityImage: require("../../assets/images/aminities/aminity3.png"),
    aminity: "FREE Wifi",
  },
  {
    id: "4",
    aminityImage: require("../../assets/images/aminities/aminity4.png"),
    aminity: "Food",
  },
  {
    id: "5",
    aminityImage: require("../../assets/images/aminities/aminity5.png"),
    aminity: "Pharmacy",
  },
];

const connectionsList = [
  {
    id: "1",
    connectionTypeImage: require("../../assets/images/connectionTypes/connection_type1.png"),
    connectionType: "CCS",
    capacity: "55 kW",
    amountPerWalt: "($0.05/kW)",
    takenSlot: 0,
    totalSlot: 3,
  },
  {
    id: "2",
    connectionTypeImage: require("../../assets/images/connectionTypes/connection_type2.png"),
    connectionType: "CCS2",
    capacity: "55 kW",
    amountPerWalt: "($0.05/kW)",
    takenSlot: 2,
    totalSlot: 5,
  },
  {
    id: "3",
    connectionTypeImage: require("../../assets/images/connectionTypes/connection_type3.png"),
    connectionType: "Mennekes",
    capacity: "34 kW",
    amountPerWalt: "($0.02/kW)",
    takenSlot: 6,
    totalSlot: 6,
  },
];

const dummyText =
  "Lorem ipsum dolor sit amet consectetur. Vitae luctusmassa viverra eget pulvinar. Vestibulum ac cras estplatea natoque nec. Sed sed gravida platea viverra vel ac.Eu placerat sit lacus tellus. Faucibus et id a eros volutpatinterdum in tincidunt viverra.";

const reviewsList = [
  {
    id: "1",
    reviewerImage: require("../../assets/images/users/user1.png"),
    reviewerName: "Andrew Anderson",
    rating: 5.0,
    review: dummyText,
  },
  {
    id: "2",
    reviewerImage: require("../../assets/images/users/user2.png"),
    reviewerName: "Peter Jones",
    rating: 4.0,
    review: dummyText,
  },
  {
    id: "3",
    reviewerImage: require("../../assets/images/users/user3.png"),
    reviewerName: "Emily Wood",
    rating: 3.0,
    review: dummyText,
  },
];

const ChargingStationDetailScreen = ({ navigation }) => {
  const [inFavorite, setinFavorite] = useState(false);
  const [showSnackBar, setshowSnackBar] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <CollapsibleToolbar
          renderContent={pageView}
          renderNavBar={header}
          renderToolBar={collapsibleImage}
          collapsedNavBarBackgroundColor={Colors.primaryColor}
          toolBarHeight={320}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 5.0 }}
        />
      </View>
      {bookSlotAndGetDirectionButton()}
      {snackBarInfo()}
    </View>
  );

  function bookSlotAndGetDirectionButton() {
    return (
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.push("BookSlot");
          }}
          style={{
            ...styles.bookSlotAndGetDirectionButtonStyle,
            backgroundColor: Colors.bodyBackColor,
            borderTopColor: Colors.extraLightGrayColor,
          }}
        >
          <Text numberOfLines={1} style={{ ...Fonts.primaryColor18Medium }}>
            Book Slot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            navigation.push("Direction");
          }}
          style={{
            ...styles.bookSlotAndGetDirectionButtonStyle,
            backgroundColor: Colors.primaryColor,
            borderTopColor: Colors.primaryColor,
          }}
        >
          <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Medium }}>
            Get Direction
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function snackBarInfo() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.lightBlackColor }}
        visible={showSnackBar}
        onDismiss={() => setshowSnackBar(false)}
        elevation={0}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          {inFavorite ? "Added to favorite" : "Removed from favorite"}
        </Text>
      </Snackbar>
    );
  }

  function collapsibleImage() {
    return (
      <ImageBackground
        source={require("../../assets/images/chargingStations/charging_station6.png")}
        style={{ width: "100%", height: 320 }}
      >
        <LinearGradient
          colors={["rgba(217, 217, 217, 0)", "rgba(0, 0, 0, 0.85)"]}
          style={{ width: "100%", height: "100%", justifyContent: "flex-end" }}
        >
          <View
            style={{
              ...commonStyles.rowSpaceBetween,
              alignItems: "flex-end",
              margin: Sizes.fixPadding * 2.0,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor20SemiBold }}>
                Tesla charging station
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  marginVertical: Sizes.fixPadding - 5.0,
                  ...Fonts.grayColor14Medium,
                }}
              >
                A537, Colombo trade centre
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                Open: 06:00 AM to 11:00 PM
              </Text>
            </View>
            <MaterialIcons
              name={inFavorite ? "favorite" : "favorite-border"}
              color={Colors.whiteColor}
              size={35}
              onPress={() => {
                setinFavorite(!inFavorite);
                setshowSnackBar(true);
              }}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowSpaceBetween,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Platform.OS == "ios" ? 0 : Sizes.fixPadding,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.whiteColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <View style={styles.ratingWrapper}>
          <Text
            style={{
              ...Fonts.whiteColor18SemiBold,
              marginRight: Sizes.fixPadding - 8.0,
            }}
          >
            4.5
          </Text>
          <MaterialIcons name="star" color={Colors.yellowColor} size={20} />
        </View>
      </View>
    );
  }

  function pageView() {
    return (
      <View style={{ flex: 1 }}>
        {aminitiesInfo()}
        {connectionsInfo()}
        {reviewsInfo()}
      </View>
    );
  }

  function reviewsInfo() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={item.reviewerImage}
            style={{
              width: 60.0,
              height: 60.0,
              borderRadius: Sizes.fixPadding,
            }}
          />
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              {item.reviewerName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {rating({ rating: item.rating })}
            </View>
          </View>
        </View>
        <Text
          style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}
        >
          {item.review}
        </Text>
      </View>
    );
    return (
      <View style={{ marginTop: Sizes.fixPadding - 5.0 }}>
        <View style={styles.reviewHeaderWrapper}>
          <Text
            numberOfLines={1}
            style={{ ...Fonts.blackColor20SemiBold, flex: 1 }}
          >
            Reviews
          </Text>
          <Text
            onPress={() => {
              navigation.push("AllReview");
            }}
            style={{ ...Fonts.primaryColor16Medium }}
          >
            See all
          </Text>
        </View>
        <FlatList
          data={reviewsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function connectionsInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.connectionsWrapper}>
        <View
          style={{
            alignItems: "center",
            marginHorizontal: Sizes.fixPadding,
            marginVertical: Sizes.fixPadding * 1.5,
          }}
        >
          <Image
            source={item.connectionTypeImage}
            style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
          />
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor18SemiBold,
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            {item.connectionType}
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            {item.capacity}
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            {item.amountPerWalt}
          </Text>
        </View>
        <View style={styles.connectionAvailableSlotWrapper}>
          <Text numberOfLines={1} style={{ ...Fonts.whiteColor14Medium }}>
            {item.takenSlot}/{item.totalSlot} Taken
          </Text>
        </View>
      </View>
    );
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          Connections available
        </Text>
        <FlatList
          data={connectionsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
        />
      </View>
    );
  }

  function aminitiesInfo() {
    const renderItem = ({ item }) => (
      <View style={{ alignItems: "center" }}>
        <View style={styles.aminitiesCircleWrapper}>
          <Image
            source={item.aminityImage}
            style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
          />
        </View>
        <Text style={{ ...Fonts.grayColor14Regular }}>{item.aminity}</Text>
      </View>
    );
    return (
      <View style={{ marginVertical: Sizes.fixPadding * 1.5 }}>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          Ameities
        </Text>
        <FlatList
          data={aminitiesList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
        />
      </View>
    );
  }
};

export default ChargingStationDetailScreen;

const styles = StyleSheet.create({
  ratingWrapper: {
    ...commonStyles.rowAlignCenter,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 5.0,
  },
  aminitiesCircleWrapper: {
    width: 70.0,
    height: 70.0,
    borderRadius: 35.0,
    backgroundColor: Colors.bodyBackColor,
    alignItems: "center",
    justifyContent: "center",
    ...commonStyles.shadow,
    margin: Sizes.fixPadding,
  },
  connectionsWrapper: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    width: screenWidth / 3.75,
    margin: Sizes.fixPadding,
  },
  connectionAvailableSlotWrapper: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    borderBottomLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 8.0,
  },
  reviewHeaderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 1.5,
  },
  bookSlotAndGetDirectionButtonStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding * 1.2,
    borderTopWidth: 1.0,
  },
  bottomButtonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
  },
});
