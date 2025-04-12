import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {Colors} from "../../../constants/styles";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import CompleteDetailProgressBar from "../../../components/vendorComponents/CompleteDetailProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../auth/services/selector";
import { postSingleFile } from "../../auth/services/crudFunction";
import { setupImagePicker } from "./vendorDetailForm";
const UploadPAN = ({route,navigation}) => {
  // const navigation = useNavigation();
  const [frontImage, setFrontImage] = useState(null);
  const [frontImageUri, setFrontImageUri] = useState(null);
  const {  VendorDetailAtAadharPage } = route.params || {};
  const dispatch = useDispatch(); // Get the dispatch function
  const accessToken = useSelector(selectToken); // Get access token from Redux store

  // Function to pick an image
  
   const pickImage = async (source, type) => {
    let permissionResult;

    if (source === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      alert("Permission is required!");
      return;
    }

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const file = await setupImagePicker(imageUri);
    
      const response = await dispatch(
        postSingleFile({ file: file, accessToken: accessToken })
      );
      if (response?.payload.code === 200 || response?.payload.code === 201) {
        
        if (type === "front") {
          setFrontImage(imageUri);
          setFrontImageUri(response?.payload?.data?.filePathUrl);
          console.log(" Image URI set successfully:",frontImageUri);
        } 
      } else {
        // console.error("Image upload failed:", response.data);
        Alert.alert("Error", "Failed to upload image. Please try again.");
      }

     
    }
  };

  // Handle Submit
  const handleSubmit = () => {
   
    if (!frontImageUri) {
      Alert.alert("Error", "Please upload the image.");
      return;
    }
   
    if (! VendorDetailAtAadharPage) {
      console.warn("vendorDetail not passed at pan Page!");
      return null;
    }
    let VendorDetailAtPanPage = {
      ... VendorDetailAtAadharPage,
      pan_pic: frontImageUri,
   
    };
    // console.log("Updated Vendor Detail at page 3:", VendorDetailAtPanPage );
    navigation.navigate("UploadTAN", { VendorDetailAtPanPage });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* AppBar */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Upload PAN</Text>
        </View>

        {/* Progress Bar */}
        <CompleteDetailProgressBar completedSteps={2} />

        {/* Upload Front Side */}
        <View style={styles.uploadBox}>
          {frontImage ? (
            <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.uploadText}>Upload Front Side</Text>
          )}
        </View>

        {/* Buttons for Front Side */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.outlinedButton}
            onPress={() => pickImage("camera", "front")}
          >
            <MaterialIcons name="photo-camera" size={20} color="#F4721E" />
            <Text style={styles.buttonText}> Take Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => pickImage("gallery", "front")}
          >
            <MaterialIcons name="photo-library" size={20} color="#F4721E" />
            <Text style={styles.buttonText}> Upload from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UploadPAN;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
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
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
    flex: 1,
  },
  uploadBox: {
    width: "90%",
    height: 160,
    borderWidth: 2,
    borderColor: "#F4721E",
    borderRadius: 8,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    overflow: "hidden",
  },
  uploadText: {
    color: "black",
    fontSize: 14,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  outlinedButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#F4721E",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    color: "#F4721E",
  },
  submitButton: {
    width: "100%",
    backgroundColor: Colors.primaryColor,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
});
