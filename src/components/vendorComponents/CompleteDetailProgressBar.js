import { View, Text, StyleSheet } from "react-native";
import React from "react";

const CompleteDetailProgressBar = ({ completedSteps, totalSteps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < completedSteps;
          return (
            <View key={index} style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  { backgroundColor: isCompleted ? "#101942" : "#B0B0B0" },
                ]}
              >
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              {index < totalSteps - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      width: totalSteps==4?55:95,
                      backgroundColor:
                        index < completedSteps - 1 ? "#101942" : "#B0B0B0",
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CompleteDetailProgressBar;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: "white",
    fontWeight: "bold",
  },
  line: {
   
    height: 4,
    marginHorizontal: 4,
  },
});
