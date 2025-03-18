import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  BackHandler,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState, useCallback, createRef } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const onboardingScreenList = [
  {
    id: "1",
    onboardingImage: require("../../assets/images/onboarding/onboarding1.png"),
    onboardingTitle: "Find nearby charging station",
    onboardingDescription:
      "Lorem ipsum dolor sit amet consectetur. Lectus vulputate pretium phasellus elementum quam pellentesque urna velit.",
  },
  {
    id: "2",
    onboardingImage: require("../../assets/images/onboarding/onboarding2.png"),
    onboardingTitle: "Get direction",
    onboardingDescription:
      "Lorem ipsum dolor sit amet consectetur. Lectus vulputate pretium phasellus elementum quam pellentesque urna velit.",
  },
  {
    id: "3",
    onboardingImage: require("../../assets/images/onboarding/onboarding3.png"),
    onboardingTitle: "Plug and start charging",
    onboardingDescription:
      "Lorem ipsum dolor sit amet consectetur. Lectus vulputate pretium phasellus elementum quam pellentesque urna velit.",
  },
];

const OnboardingScreen = ({ navigation }) => {
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
  const listRef = createRef();
  const [currentScreen, setCurrentScreen] = useState(0);

  const scrollToIndex = ({ index }) => {
    listRef.current.scrollToIndex({ animated: true, index: index });
    setCurrentScreen(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {onboardingScreenContent()}
        {indicators()}
        {nextArrowButton()}
      </View>
      {exitInfo()}
    </View>
  );

  function nextArrowButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          currentScreen == 2
            ? navigation.push("Signin")
            : scrollToIndex({ index: currentScreen + 1 });
        }}
        style={styles.nextArrowWrapper}
      >
        <MaterialIcons
          name="arrow-forward"
          color={Colors.whiteColor}
          size={30}
        />
      </TouchableOpacity>
    );
  }

  function indicators() {
    return (
      <View style={{ ...styles.indicatorWrapStyle }}>
        {onboardingScreenList.map((item, index) => {
          return (
            <View
              key={`${item.id}`}
              style={{
                ...styles.indicatorStyle,
                ...(currentScreen === index
                  ? { backgroundColor: Colors.primaryColor }
                  : { backgroundColor: "#D9D9D9" }),
              }}
            />
          );
        })}
      </View>
    );
  }

  function onboardingScreenContent() {
    const renderItem = ({ item }) => {
      return (
        <View style={styles.pageContent}>
          <Image
            source={item.onboardingImage}
            style={{
              width: screenWidth - 100.0,
              height: screenWidth - 100.0,
              resizeMode: "contain",
            }}
          />
          <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
            <Text
              style={{ textAlign: "center", ...Fonts.blackColor20SemiBold }}
            >
              {item.onboardingTitle}
            </Text>
            <Text
              style={{
                textAlign: "center",
                ...Fonts.grayColor16Regular,
                marginTop: Sizes.fixPadding * 2.0,
              }}
            >
              {item.onboardingDescription}
            </Text>
          </View>
        </View>
      );
    };
    return (
      <FlatList
        ref={listRef}
        data={onboardingScreenList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        horizontal
        scrollEventThrottle={32}
        pagingEnabled
        onMomentumScrollEnd={onScrollEnd}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  function onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentScreen(pageNum);
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitWrapper}>
        <Text
          style={{
            paddingTop: Sizes.fixPadding - 8.0,
            lineHeight: 15.0,
            ...Fonts.whiteColor14Medium,
          }}
        >
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  exitWrapper: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorStyle: {
    marginHorizontal: Sizes.fixPadding - 7.0,
    width: 15.0,
    height: 15.0,
    borderRadius: 7.5,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
  },
  indicatorWrapStyle: {
    margin: Sizes.fixPadding * 3.0,
    justifyContent: "center",
    ...commonStyles.rowAlignCenter,
  },
  nextArrowWrapper: {
    width: 50.0,
    height: 50.0,
    borderRadius: 25.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 15.0,
    right: 20.0,
  },
  pageContent: {
    flex: 1,
    width: screenWidth,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
