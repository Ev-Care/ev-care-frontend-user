import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import CompleteDetailProgressBar from "../../../components/vendorComponents/CompleteDetailProgressBar";
import { Colors } from "../../../constants/styles";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthError,
  selectToken,
  selectUser,
} from "../../auth/services/selector";
import { postSingleFile } from "../../auth/services/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";

export const setupImagePicker = (file) => {
  // console.log("inside setup image");
  const fileExtension = file.split(".").pop().toLowerCase(); // Get the file extension
  const supportedFormats = ["jpg", "jpeg", "png"]; // Supported formats

  if (!supportedFormats.includes(fileExtension)) {
    throw new Error(
      "Unsupported file format. Please upload a JPG or PNG image."
    );
  }
  // console.log("File extension passed:", fileExtension);
  const mimeType = `image/${fileExtension}`; // Dynamically set MIME type
  const fileName = `avatar.${fileExtension}`; // Dynamically set file name

  // Prepare the form data for the API call
  const formData = new FormData();
  formData.append("file", {
    uri: file,
    name: fileName,
    type: mimeType,
  });

  return formData;
};

const VendorDetailForm = () => {
  const navigation = useNavigation();
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [coordinate, setCoordinate] = useState(null);
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [imageloading, setImageLoading] = useState(false);
  const accessToken = useSelector(selectToken); // Get access token from Redux store
  const [avatarUri, setAvatarUri] = useState(null); // State to hold the image URI
  const dispatch = useDispatch(); // Get the dispatch function
  const user = useSelector(selectUser);
  const authErrorMessage = useSelector(selectAuthError);
  const [isCheckBoxClicked, setCheckBoxClicked] = useState(false);
  const userKey = user?.user_key; // Get the user key from the Redux store
  const [panTimer, setPanTimer] = useState(null);
  const [aadharTimer, setAadharTimer] = useState(null);
  const [gstTimer, setGstTimer] = useState(null);
  let vendorDetail = {};

  console.log("hi");
  const handleSubmit = async () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[A-Z0-9]{1}[A-Z0-9]{1}$/;

    // Check for required fields
    if (
      !avatarUri ||
      !businessName ||
      !address ||
      !aadharNumber ||
      !panNumber
    ) {
      if (isCheckBoxClicked && !gstNumber) {
        await dispatch(
          showSnackbar({
            message: "Enter GST Number If You Have Or UnCheck The Box",
            type: "error",
          })
        );
      } else {
        await dispatch(
          showSnackbar({ message: "All fields are required!", type: "error" })
        );
      }
      return;
    }

    // Validate Aadhaar number
    if (aadharNumber.length !== 12 || !/^\d+$/.test(aadharNumber)) {
      await dispatch(
        showSnackbar({ message: "Invalid Aadhaar number.", type: "error" })
      );
      return;
    }

    // Validate PAN number
    if (!panRegex.test(panNumber)) {
      await dispatch(
        showSnackbar({ message: "Invalid PAN number", type: "error" })
      );
      return;
    }

    // Validate GST number
    if (isCheckBoxClicked && (!gstNumber || !gstRegex.test(gstNumber))) {
      await dispatch(
        showSnackbar({ message: "Invalid GST number.", type: "error" })
      );
      return;
    }

    // Proceed with vendor detail creation
    let vendorDetail = {
      business_name: businessName,
      pan_no: panNumber,
      tan_no: gstNumber,
      adhar_no: aadharNumber,
      address: address,
      avatar: avatarUri,
      adhar_front_pic: null,
      adhar_back_pic: null,
      pan_pic: null,
      gstin_number: gstNumber,
      gstin_image: null,
    };

    // Navigate based on checkbox selection
    if (isCheckBoxClicked) {
      navigation.navigate("UploadGst", { vendorDetail, isCheckBoxClicked });
    } else {
      navigation.navigate("UploadAadhar", { vendorDetail, isCheckBoxClicked });
    }
  };

  const selectOnMap = () => {
    navigation.push("PickLocation", {
      addressFor: "stationAddress",
      setAddress: (newAddress) => setAddress(newAddress),
      setCoordinate: (newCoordinate) => setCoordinate(newCoordinate),
    });
  };

  const handleImagePick = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        await dispatch(
          showSnackbar({
            message: "Camera permissions are required to upload an image.",
            type: "error",
          })
        );

        // Alert.alert(
        //   "Permission Denied",
        //   "Camera roll permissions are required to upload an image."
        // );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Ensure this is correctly accessed
        allowsEditing: true,
        quality: 0.2,
      });

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        await new Promise((resolve) => setTimeout(resolve, 200));
        const file = setupImagePicker(selectedImageUri);

        setImageLoading(true);
        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );

        if (
          response?.payload?.code === 200 ||
          response?.payload?.code === 201
        ) {
          setAvatar(selectedImageUri);
          setAvatarUri(response?.payload?.data?.filePathUrl); // Set the avatar URI to the response path
          console.log("Image URI set successfully:", avatarUri);
          setImageLoading(false);
        } else {
          // console.error("Image upload failed:", response.data);
          setImageLoading(false);
          await dispatch(
            showSnackbar({
              message: authErrorMessage || "File Should be less than 5 MB",
              type: "error",
            })
          );

          // Alert.alert("Error", "File Should be less than 5 MB");
        }
      }
    } catch (error) {
      setImageLoading(false);
      console.error("Error in handleImagePick:", error);
      await dispatch(
        showSnackbar({
          message: authErrorMessage || "An unexpected error occurred.",
          type: "error",
        })
      );

      // Alert.alert("Error", error.message || "An unexpected error occurred.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Vendor Details</Text>
      </View>

      <CompleteDetailProgressBar completedSteps={0} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          Upload Your Photo
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <Text style={styles.photoDescription}>
          It will Appear At Your Profile Page.
        </Text>
        <TouchableOpacity style={styles.photoUpload} onPress={handleImagePick}>
          {imageloading ? (
            <ActivityIndicator size={40} color="#ccc" />
          ) : avatar ? (
            <Image source={{ uri: avatar }} style={styles.previewImage} />
          ) : (
            <Icon name="camera-plus-outline" size={40} color="#ccc" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Bussiness Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Business name"
        placeholderTextColor="gray"
        value={businessName}
        onChangeText={(text) => {
          if (text.length > 100) {
            dispatch(
              showSnackbar({
                message: "Business name cannot exceed 50 characters",
                type: "error",
              })
            );
            return;
          }
          setBusinessName(text);
        }}
        // maxLength={50}
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

      <Text style={styles.label}>Aadhaar Number</Text>
      {/* import {Alert} from 'react-native'; // Make sure this is imported */}

      <TextInput
        style={styles.input}
        placeholder="Enter Aadhaar number"
        placeholderTextColor="gray"
        keyboardType="number-pad"
        value={aadharNumber}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, ""); // Allow only numbers

          if (numericText.length > 12) {
            dispatch(
              showSnackbar({
                message: "Aadhaar number cannot exceed 12 digits",
                type: "error",
              })
            );
            return;
          }

          setAadharNumber(numericText);

          if (aadharTimer) {
            clearTimeout(aadharTimer);
          }

          const timer = setTimeout(() => {
            if (numericText.length !== 12) {
              dispatch(
                showSnackbar({
                  message: "Aadhaar number must be exactly 12 digits",
                  type: "error",
                })
              );
            }
          }, 500); // After 500ms of no typing

          setAadharTimer(timer);
        }}
        maxLength={12}
      />

      <Text style={styles.label}>PAN Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PAN number"
        placeholderTextColor="gray"
        value={panNumber}
        onChangeText={(text) => {
          const upperText = text.toUpperCase();
          const validText = upperText.replace(/[^A-Z0-9]/g, ""); // Only letters and numbers

          if (validText.length > 10) {
            dispatch(
              showSnackbar({
                message: "PAN number cannot exceed 10 characters",
                type: "error",
              })
            );
            return; // Don't update if more than 10 characters
          }

          setPanNumber(validText); // Update normally

          if (panTimer) {
            clearTimeout(panTimer);
          }

          // Set a timer: if user stops typing for 500ms, validate
          const timer = setTimeout(() => {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
            if (!panRegex.test(validText)) {
              dispatch(
                showSnackbar({
                  message: "Invalid PAN format. Example: ABCDE1234F",
                  type: "error",
                })
              );
            }
          }, 500);

          setPanTimer(timer);
        }}
        maxLength={10}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isCheckBoxClicked}
          onValueChange={setCheckBoxClicked}
          color={isCheckBoxClicked ? Colors.primaryColor : undefined}
        />
        <Text style={[styles.checkboxLabel, { color: Colors.primaryColor }]}>
          Do You Have GST Number ?
        </Text>
      </View>

      {isCheckBoxClicked && (
        <>
          <Text style={styles.label}>GST Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter GST number"
            placeholderTextColor="gray"
            value={gstNumber}
            maxLength={15}
            onChangeText={(text) => {
              const upperText = text.toUpperCase();
              const validText = upperText.replace(/[^A-Z0-9]/g, ""); // Only A-Z and 0-9

              setGstNumber(validText); // Update normally

              if (gstTimer) {
                clearTimeout(gstTimer); // Clear existing timer
              }

              // Set a new timer: validate after 500ms pause
              const timer = setTimeout(() => {
                if (validText.length !== 15) {
                  dispatch(
                    showSnackbar({
                      message: "GST number must be exactly 15 characters.",
                      type: "error",
                    })
                  );
                  return;
                }

                const gstRegex =
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
                if (!gstRegex.test(validText)) {
                  dispatch(
                    showSnackbar({
                      message: "Invalid GST Number.",
                      type: "error",
                    })
                  );
                }
              }, 500);

              setGstTimer(timer);
            }}
          />
        </>
      )}

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Home/Street/Locality, City, State, Pincode"
        placeholderTextColor="gray"
        multiline
        value={address}
        onChangeText={(text) => {
          if (text.length > 100) {
            dispatch(
              showSnackbar({
                message: "Address cannot exceed 100 characters",
                type: "error",
              })
            );
            return;
          }
          setAddress(text);
        }}
        // maxLength={100}
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
    height: 45,
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
    backgroundColor: Colors.primaryColor,
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
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: 12,
  },
  optional: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#888",
  },
  photoDescription: {
    fontSize: 10,
    color: "#666",
    marginBottom: 12,
  },
  photoUpload: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
});
