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
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";
import CompleteDetailProgressBar from "../../../components/vendorComponents/CompleteDetailProgressBar";
import { Colors } from "../../../constants/styles";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../auth/services/selector";
import { postSingleFile } from "../../auth/services/crudFunction";

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
  const [tanNumber, setTanNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [imageloading, setImageLoading] = useState(false);
  const accessToken = useSelector(selectToken); // Get access token from Redux store
  const [avatarUri, setAvatarUri] = useState(null); // State to hold the image URI
  const dispatch = useDispatch(); // Get the dispatch function
  const user = useSelector(selectUser);
  const [isCheckBoxClicked, setCheckBoxClicked] = useState(false);
  const userKey = user?.user_key; // Get the user key from the Redux store

  console.log("User =:", user); // Log the user key for debugging
  let vendorDetail = {};



  const handleSubmit = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;

    if (!avatarUri || !businessName || !address || !aadharNumber || !panNumber || !tanNumber) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (aadharNumber.length !== 12 || !/^\d+$/.test(aadharNumber)) {
      Alert.alert("Error", "Aadhaar number must be number and of 12 digits.");
      return;
    }

    if (!panRegex.test(panNumber)) {
      Alert.alert("Error", "Invalid PAN number format.");
      return;
    }

    if (!tanRegex.test(tanNumber)) {
      Alert.alert("Error", "Invalid TAN number format.");
      return;
    }


    // Fill the vendor detail object
    let vendorDetail = {
      business_name: businessName,
      pan_no: panNumber,
      tan_no: tanNumber,
      adhar_no: aadharNumber,
      address: address,
      avatar: avatarUri,
      adhar_front_pic: null,
      adhar_back_pic: null,
      pan_pic: null,
      tan_pic: null,
    };
    // console.log(" Vendor Detail at page 1:", vendorDetail);
    navigation.navigate("UploadAadhar", { vendorDetail });
  };

  const selectOnMap = () => {
    navigation.push("PickLocation", {
      addressFor: "stationAddress",
      setAddress: (newAddress) => setAddress(newAddress),
      setCoordinate: (newCoordinate) => setCoordinate(newCoordinate)
    });
  };

  const handleImagePick = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera roll permissions are required to upload an image."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Ensure this is correctly accessed
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {

        const selectedImageUri = result.assets[0].uri;

        const file = setupImagePicker(selectedImageUri);

        setImageLoading(true);
        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );

        if (response?.payload?.code === 200 || response?.payload?.code === 201) {
          setAvatar(selectedImageUri);
          setAvatarUri(response?.payload?.data?.filePathUrl); // Set the avatar URI to the response path
          console.log("Image URI set successfully:", avatarUri);
          setImageLoading(false);
        } else {
          // console.error("Image upload failed:", response.data);
          setImageLoading(false);
          Alert.alert("Error", "File Should be less than 5 MB");
        }
      }
    } catch (error) {
      setImageLoading(false);
      console.error("Error in handleImagePick:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred.");
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

      <Text style={styles.label}>Aadhaar Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Aadhaar number"
        placeholderTextColor="gray"
        keyboardType="number-pad"
        value={aadharNumber}
        onChangeText={setAadharNumber}
      />

      <Text style={styles.label}>PAN Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PAN number"
        placeholderTextColor="gray"
        value={panNumber}
        onChangeText={(text) => setPanNumber(text.toUpperCase())}
      />
      
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isCheckBoxClicked}
          onValueChange={setCheckBoxClicked}
          color={isCheckBoxClicked ? Colors.primaryColor : undefined}
        />
        <Text style={[styles.checkboxLabel,{color:Colors.primaryColor}]}>Do You Have GST Number ?</Text>
      </View>

      {isCheckBoxClicked && ( <>
      <Text style={styles.label}>GST Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter GST number"
        placeholderTextColor="gray"
        value={tanNumber}
        onChangeText={(text) => setTanNumber(text.toUpperCase())}
      /> </>)}


      <Text style={styles.label}>Address</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
   
  },

});
