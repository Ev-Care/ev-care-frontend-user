import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CompleteDetailProgressBar from "../uiComponents/CompleteDetailProgressBar";
const VendorAccountDetailsForm = () => {
  const navigation = useNavigation();
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [confirmAccountNo, setConfirmAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleSubmit = () => {
    // if (accountNo !== confirmAccountNo) {
    //   Alert.alert("Error", "Account No. and Confirm Account No. do not match.");
    //   return;
    // }
    // Alert.alert("Success", "Account details submitted successfully!");
    navigation.navigate("PendingApprovalScreen");
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Account Details</Text>
      </View>
      <CompleteDetailProgressBar completedSteps={5} />
      {/* Form Inputs */}
       
      <TextInput
        style={styles.input}
        placeholder="Enter Account holder Name here"
        value={accountHolder}
        onChangeText={setAccountHolder}
      />
      <TextInput
        style={styles.input}
        placeholder="Account No."
        keyboardType="numeric"
        value={accountNo}
        onChangeText={setAccountNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Account No."
        keyboardType="numeric"
        secureTextEntry
        value={confirmAccountNo}
        onChangeText={setConfirmAccountNo}
      />
      <TextInput
        style={styles.input}
        placeholder="IFSC Code"
        value={ifsc}
        onChangeText={setIfsc}
      />
      <TextInput
        style={styles.input}
        placeholder="UPI ID"
        value={upiId}
        onChangeText={setUpiId}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VendorAccountDetailsForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
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
    padding: 5,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
    flex: 1,
  },
//   label: {
//     fontSize: 16,
//     color: "#F4721E",
//     marginBottom: 5,
//   },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#101942",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
