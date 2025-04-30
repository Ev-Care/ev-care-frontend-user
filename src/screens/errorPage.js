import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet,Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getLocationPermission } from "../utils/globalMethods";

const ErrorPage = ({setHasLocationPermission}) => {
  const navigation = useNavigation();
 
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/error.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Unable to  fetch Your{"\n"}Location</Text>
      <Text style={styles.subtitle}>
      We are unable to fetch your location. Kindly grant us permission to access it.
      If you have denied it previously, please go to your phone settings and enable location access.
   </Text>


      <TouchableOpacity
        style={styles.button}
         onPress={async () => {
            const granted = await getLocationPermission();
            if (granted) {
            setHasLocationPermission(true);
            } else {
                Alert.alert("Error", "Something went wrong while checking location permission.",);
            }
          }}
          
      >
        <Text style={styles.buttonText}>Enable Location</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ErrorPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: { width: 150, height: 150, resizeMode: "contain", marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "grey",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#F4721E",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: { fontSize: 14, color: "white", fontWeight: "bold" },
  goBackText: { fontSize: 14, color: "#F4721E", textAlign: "center" },
});
