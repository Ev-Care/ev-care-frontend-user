import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { logoutUser } from "../../../redux/store/userSlice";
import { selectUser } from "../../auth/services/selector";
import { useSelector, useDispatch } from "react-redux";
const Instruction = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/instruction.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Complete Your{"\n"}Details</Text>
      <Text style={styles.subtitle}>
        Kindly fill in all the required details to proceed.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("VendorDetailForm")}
      >
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => dispatch(logoutUser())}>
        <Text style={styles.goBackText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Instruction;

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
