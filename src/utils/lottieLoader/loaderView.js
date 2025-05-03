import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";


const DottedLoader = () => {
  return (
    <View
      style={{
        // width: 30,
        height: 30,
        flex: 1,
        alignSelf: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LottieView
        source={require("./animatedLoader1.json")}
        autoPlay
        loop
        style={{
          width: 40,
          height: 40,
          position: "absolute",
          top: -5,
          left: 0,
        }}
      />
    </View>
  );
};

export default DottedLoader;
