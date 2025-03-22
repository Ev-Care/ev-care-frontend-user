import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CompleteDetailProgressBar from "../uiComponents/CompleteDetailProgressBar";

const VendorDetailForm = () => {
  const navigation = useNavigation();
  const [vendorName, setVendorName] = useState("");
  const [address, setAddress] = useState("");
  const [publicContact, setPublicContact] = useState("");

  const selectOnMap = () => {
    navigation.push("PickLocation", { addressFor: "vendorAddress" , setAddress:setAddress});
     
    Alert.alert("Selected", "Location has been selected on the map.");
  };

  const handleSubmit = () => {
    // if (!vendorName || !address || !publicContact) {
    //   Alert.alert("Error", "All fields are required!");
    //   return;
    // }
    navigation.navigate("UploadAadhar");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Vendor Details</Text>
      </View>

      {/* Progress Bar */}
      <CompleteDetailProgressBar completedSteps={0} />

      <Text style={styles.label}>Vendor Legal Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter vendor legal name"
        placeholderTextColor="gray"
        value={vendorName}
        onChangeText={setVendorName}
      />

      <Text style={styles.label}>Public Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter public contact"
        placeholderTextColor="gray"
        keyboardType="phone-pad"
        value={publicContact}
        onChangeText={setPublicContact}
      />
       <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Home/Street/Locality, City, State, Pincode"
        placeholderTextColor="gray"
        multiline
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.label}>OR , </Text>
      <TouchableOpacity style={styles.mapButton} onPress={selectOnMap}>
        <Text style={styles.mapButtonText}>Select on Map</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VendorDetailForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginLeft: 10,
    marginRight: 15,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: "#F4721E",
    marginBottom: 5,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
    flex: 1,
    marginRight: 30, // Adjust based on the width of the back button
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  mapButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F4721E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  mapButtonText: {
    color: "#F4721E",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#101942",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
