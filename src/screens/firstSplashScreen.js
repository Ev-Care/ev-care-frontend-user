import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Fonts } from "../constants/styles";

const FirstSplashScreen = ({ navigation }) => {
  const iconPosition = useSharedValue(0); // Horizontal movement
  const iconScale = useSharedValue(1); // Icon shrinking
  const textOpacity = useSharedValue(0.2); // Initial visibility
  const textScale = useSharedValue(0); // Initial text scale (0 = invisible)

  useEffect(() => {
    setTimeout(() => {
      iconPosition.value = withTiming(-20, { duration: 800 }); // Move left
      iconScale.value = withTiming(0.7, { duration: 700 }); // Shrink icon
      textOpacity.value = withTiming(1, { duration: 1000 }); // Fade in text
      textScale.value = withTiming(1, { duration: 1000 }); // Scale up text
    },0);

    setTimeout(() => {
      navigation.replace("SecondSplashScreen");
    }, 3500);
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
          source={require("../../assets/icon.png")}
          style={[styles.icon, iconAnimatedStyle]}
        />
        <Animated.Text style={[styles.text, textAnimatedStyle]}>Care</Animated.Text>
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
    alignItems: "center",
  },
  icon: {
    width: 220, 
    height: 220,
    resizeMode: "contain",
  },
  text: {
    ...Fonts.whiteColor38SemiBold,
    fontSize: 48,
  },
});

export default FirstSplashScreen;
