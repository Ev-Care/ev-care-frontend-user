import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Fonts } from "../constants/styles";
import LinearGradient from "react-native-linear-gradient";

const FirstSplashScreen = ({ navigation }) => {
  const iconPosition = useSharedValue(0); // Horizontal movement
  const iconScale = useSharedValue(1); // Icon shrinking
  const textOpacity = useSharedValue(0.2); // Initial visibility
  const textScale = useSharedValue(0); // Initial text scale (0 = invisible)
  const [textVisibility, setTextVisibility] = useState(true); // State to control text visibility

  useEffect(() => {
    setTimeout(() => {
      iconPosition.value = withTiming(-10, { duration: 700 }); // Move left
      iconScale.value = withTiming(1, { duration: 700 }); // Shrink icon
      iconScale.value = withTiming(1, { duration: 500 });
      textOpacity.value = withTiming(1, { duration: 1000 }); // Fade in text
      textScale.value = withTiming(1, { duration: 1000 }); // Scale up text
    }, 0);

    setTimeout(() => {
      navigation.navigate("Onboarding");
    }, 4000);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: iconPosition.value }, { scale: iconScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }], // Animating text size
  }));

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Animated.Image
          source={require("../../assets/splashicon.png")}
          style={[styles.icon, { aspectRatio: 1.5 }, iconAnimatedStyle]}
          resizeMode="contain"
        />

        {textVisibility && (
          <Animated.Text style={[styles.text, textAnimatedStyle]}>
            Care
          </Animated.Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101942",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // Align bottom of image & text
    justifyContent: "center",
  },
  icon: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    marginBottom: 0, // if needed to nudge for visual alignment
  },
  gradientTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...Fonts.whiteColor38SemiBold,
    fontSize: 70,
    marginBottom: 4, // Adjust as needed
    color: "#29cafc",
  },
});

export default FirstSplashScreen;
