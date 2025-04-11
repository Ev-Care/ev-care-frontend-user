import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CompleteDetailProgressBar from "../../../components/vendorComponents/CompleteDetailProgressBar";
import {Colors} from "../../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const VendorDetailForm = () => {
  const navigation = useNavigation();
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [tanNumber, setTanNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
  
  let vendorDetail = {};
  const handleSubmit = () => {
    if (!businessName || !address || !aadharNumber || !panNumber || !tanNumber) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
  
    // Fill the vendor detail object
    vendorDetail = {
      businessName,
      address,
      aadharNumber,
      panNumber,
      tanNumber,
      avatar,
    };
    // console.log(" Vendor Detail at page 1:", vendorDetail);
    navigation.navigate("UploadAadhar", { vendorDetail });
  };

  const selectOnMap = () => {
    navigation.push("PickLocation", {
      addressFor: "stationAddress",
      setAddress: (newAddress) => setAddress(newAddress),
    });
  };
  const handleImagePick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Vendor Details</Text>
      </View>

      <CompleteDetailProgressBar completedSteps={0} />


             <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Upload Your Photo <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <Text style={styles.photoDescription}>
              It will Appear At Your Profile Page.
            </Text>
            <TouchableOpacity style={styles.photoUpload} onPress={handleImagePick}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.previewImage} />
              ) : (
                <Icon name="camera-plus-outline" size={40} color="#ccc" />
              )}
            </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Business name"
        placeholderTextColor="gray"
        value={businessName}
        onChangeText={setBusinessName}
      />

      {/* <Text style={styles.label}>Public Contact Number</Text> */}
      {/* <TextInput
        style={styles.input}
        placeholder="Enter public contact"
        placeholderTextColor="gray"
        keyboardType="phone-pad"
        value={publicContact}
        onChangeText={setPublicContact}
      /> */}

      {/* <Text style={styles.label}>Aadhaar Number</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Enter Aadhaar number"
        placeholderTextColor="gray"
        keyboardType="number-pad"
        value={aadharNumber}
        onChangeText={setAadharNumber}
      />

      {/* <Text style={styles.label}>PAN Number</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Enter PAN number"
        placeholderTextColor="gray"
        value={panNumber}
        onChangeText={setPanNumber}
      />

      {/* <Text style={styles.label}>TAN Number</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Enter TAN number"
        placeholderTextColor="gray"
        value={tanNumber}
        onChangeText={setTanNumber}
      />

      {/* <Text style={styles.label}>Address</Text> */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Home/Street/Locality, City, State, Pincode"
        placeholderTextColor="gray"
        multiline
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>OR</Text>
      <TouchableOpacity style={styles.mapButton} onPress={selectOnMap}>
        <Text style={styles.mapButtonText}>Select on Map</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Next</Text>
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
    fontWeight: "500",
    color: "black",
    textAlign: "center",
    flex: 1,
    marginRight: 30,
  },
  label: {
    fontSize: 14,
    color: "#F4721E",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
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
    fontSize: 14,
  },
  submitButton: {
    backgroundColor:Colors.primaryColor,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color:Colors.primaryColor,
    marginBottom: 12,
  },
  optional: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#888',
  },
  photoDescription: {
    fontSize: 10,
    color: '#666',
    marginBottom: 12,
  },
  photoUpload: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});