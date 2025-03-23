import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PendingApprovalScreen = () => {  
  const navigation = useNavigation();  

  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/images/completed.png")} style={styles.image} />
      <Text style={styles.title}>Document Submitted </Text>
      <Text style={styles.subtitle}>Kindly wait for approval from the admin.{"\n"}This usually takes 2-3 business days.</Text>
     

      {/* <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Kindly wait for approval")}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default PendingApprovalScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: 150, height: 150, resizeMode: "contain", marginBottom: 40 },
  title: { fontSize: 30, fontWeight: "bold", color: "black", textAlign: "center" },
  subtitle: { fontSize: 14, color: "grey", textAlign: "center", marginVertical: 10 },
  button: { width: "100%", backgroundColor: "#F4721E", paddingVertical: 10, borderRadius: 8, alignItems: "center", marginVertical: 30 },
  buttonText: { fontSize: 16, color: "white", fontWeight: "bold" },
  goBackText: { fontSize: 15, color: "#F4721E", textAlign: "center" },
});
