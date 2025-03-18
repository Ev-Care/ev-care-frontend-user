import { FlatList, Text, View, Image } from "react-native";
import React from "react";
import { Colors, commonStyles, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import rating from "../../components/rating";

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
  {
    id: "4",
    reviewerImage: require("../../assets/images/users/user1.png"),
    reviewerName: "Andrew Anderson",
    rating: 5.0,
    review: dummyText,
  },
  {
    id: "5",
    reviewerImage: require("../../assets/images/users/user2.png"),
    reviewerName: "Peter Jones",
    rating: 4.0,
    review: dummyText,
  },
  {
    id: "6",
    reviewerImage: require("../../assets/images/users/user3.png"),
    reviewerName: "Emily Wood",
    rating: 3.0,
    review: dummyText,
  },
];

const AllReviewScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {reviewsInfo()}
      </View>
    </View>
  );

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
      <FlatList
        data={reviewsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Review
        </Text>
      </View>
    );
  }
};

export default AllReviewScreen;
