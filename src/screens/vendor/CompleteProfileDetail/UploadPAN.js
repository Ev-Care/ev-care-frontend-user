import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import CompleteDetailProgressBar from "../../../components/vendorComponents/CompleteDetailProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthError, selectToken, selectUser } from "../../auth/services/selector";
import { postSingleFile } from "../../auth/services/crudFunction";
import { setupImagePicker } from "./vendorDetailForm";
import { patchUpdateVendorProfile } from "../../auth/services/crudFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";

const UploadPAN = ({ route, navigation }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [frontImageUri, setFrontImageUri] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state
  const { VendorDetailAtAadharPage ,isCheckBoxClicked} = route?.params || {};
  const dispatch = useDispatch(); // Get the dispatch function
  const accessToken = useSelector(selectToken); // Get access token from Redux store
  const user = useSelector(selectUser);
  const [imageloading, setImageLoading] = useState(false); 

  const authErrorMessage = useSelector(selectAuthError);
  // Function to pick an image

  const pickImage = async (source, type) => {
    let permissionResult;
  
    if (source === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  
    if (!permissionResult.granted) {
      dispatch(showSnackbar({ message: 'Permission is required!', type: 'error' }));
      // alert("Permission is required!");
      return;
    }
  
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.2,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.2,
      });
    }
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const file = await setupImagePicker(imageUri);
      setImageLoading(true);
  
      try {
        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );
  
        if (response?.payload.code === 200 || response?.payload.code === 201) {
          if (type === "front") {
            setFrontImage(imageUri);
            setFrontImageUri(response?.payload?.data?.filePathUrl);
            console.log("PAN image uploaded:", response?.payload?.data?.filePathUrl);
          } else if (type === "back") {
            // For future-proofing
          }
        } else {
          dispatch(showSnackbar({ message: authErrorMessage, type: 'error' }));

          // Alert.alert("Error", "File Should be less than 5 MB");
        }
      } catch (error) {
        dispatch(showSnackbar({ message: authErrorMessage || 'Something went wrong while uploading.', type: 'error' }));

        // Alert.alert("Error", "Something went wrong while uploading.");
      } finally {
        setImageLoading(false);
      }
    }
  };
  

  // Handle Submit
  const handleSubmit = async () => {
      console.log("handle submit clicked");
    if (!frontImageUri) {
      dispatch(showSnackbar({ message: 'Please upload the PAN image.', type: 'error' }));

      // Alert.alert("Error", "Please upload the image.");
      return;
    }
    console.log("Updated Vendor Detail at aadhar page", VendorDetailAtAadharPage);
    if (!VendorDetailAtAadharPage) {
      dispatch(showSnackbar({ message: 'VendorDetail not available at PAN Page!', type: 'error' }));

      console.warn("vendorDetail not passed at pan Page!");
      return null;
    }
    const VendorDetailAtPanPage = {
      ...VendorDetailAtAadharPage,
      pan_pic: frontImageUri,
    };
    console.log("Updated Vendor Detail at pan page", VendorDetailAtPanPage);
    try {
  
      const response = await dispatch(patchUpdateVendorProfile({detail:VendorDetailAtPanPage, user_key:user.user_key, accessToken: accessToken})
      ).unwrap();
      
      console.log("code = ",response?.payload?.code);
      if (response?.payload?.code === 200 || response?.payload?.code === 201) {
      
          // await AsyncStorage.setItem("user",user?.user_key);
          // console.log("User data saved successfully:", response.payload.data);
          dispatch(showSnackbar({ message: 'Your details updated successfully.', type: 'success' }));

        // Alert.alert("Success", "details updated successfully.");
      } else {
        console.error("Error saving user data:", authErrorMessage);
        dispatch(showSnackbar({ message: authErrorMessage, type: 'error' }));

        // Alert.alert("Error", "Failed to update vendor details. Please try again.");
      }

      // navigation.navigate("PendingApprovalScreen", { VendorDetailAtTanPage });
    } catch (error) {
      console.error("Vendor detail submission failed:", error);
      dispatch(showSnackbar({ message: authErrorMessage || 'Submission Failed, Please check your details and try again.', type: 'error' }));

      // Alert.alert(
      //   "Submission Failed",
      //   "Please check your details and try again."
      // );
    } finally {
      setLoading(false);
    }
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
        <CompleteDetailProgressBar completedSteps={isCheckBoxClicked?3:2} totalSteps={isCheckBoxClicked?4:3} />

        {/* Upload Front Side */}
        <View style={styles.uploadBox}>
          {imageloading? (
            <ActivityIndicator size={40} color="black" />
          ) : frontImage ? (
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
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {/* <Text style={styles.submitText}>Submit</Text> */}
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ ...Fonts.whiteColor18SemiBold }}>Submit</Text>
          )}
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
