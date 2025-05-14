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
  Modal,
  ScrollView,
} from "react-native";
import MyStatusBar from "../../../components/myStatusBar";
import { MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";

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
import {
  patchUpdateVendorProfile,
  postSingleFile,
} from "../../auth/services/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import RNModal from "react-native-modal";
import imageURL from "../../../constants/baseURL";

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
  const [businessName, setBusinessName] = useState(null);
  const [address, setAddress] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const [aadharNumber, setAadharNumber] = useState(null);
  const [panNumber, setPanNumber] = useState(null);
  const [gstNumber, setGstNumber] = useState(null);
  const [avatar, setAvatar] = useState(null);

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
  const [businessType, setBusinessType] = useState("individual");
  // for image
  const [aadhaarFrontImageURI, setAadhaarFrontImageURI] = useState(null);
  const [aadhaarBackImageURI, setAadhaarBackImageURI] = useState(null);
  const [panImageURI, setPanImageURI] = useState(null);
  const [gstImageURI, setGstImageURI] = useState(null);
  const [avatarURI, setAvatarURI] = useState(null);
  const [imageloading, setImageLoading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentImageSetter, setCurrentImageSetter] = useState(null);
  const [currentImageLabel, setCurrentImageLabel] = useState(null);
  let vendorDetail = {};

  const handleSubmit = async () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[A-Z0-9]{1}[A-Z0-9]{1}$/;

    // Validate required fields
    if (!avatarURI || !panNumber || !panImageURI || !address) {
      try {
        await dispatch(
          showSnackbar({
            message: "Oops! You must have missed a required field.",
            type: "error",
          })
        );
        return;
      } catch (error) {
        Alert.alert("Oops! You must have missed a required field.");
        return;
      }
    }
      if (businessType==="organization" && !businessName ) {
      try {
        await dispatch(
          showSnackbar({
            message: "Please Enter Organization or Legal Name",
            type: "error",
          })
        );
        return;
      } catch (error) {
        Alert.alert("Oops! You must have missed a required field.");
        return;
      }
    }

    // Validate Aadhaar number for individuals
    if (
      businessType === "individual" &&
      (aadharNumber.length !== 12 || !/^\d+$/.test(aadharNumber))
    ) {
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

    // Validate GST number if applicable
    if (
      (isCheckBoxClicked || businessType === "organization") &&
      (!gstNumber || !gstRegex.test(gstNumber))
    ) {
      await dispatch(
        showSnackbar({ message: "Invalid GST number.", type: "error" })
      );
      return;
    }

    // Prepare base vendor detail object
    let vendorDetail = {
      pan_no: panNumber,
      address: address,
      avatar: avatarURI,
      pan_pic: panImageURI,
    };

    // Add conditional fields
    if (businessType === "individual") {
      vendorDetail = {
        ...vendorDetail,
        vendor_type: businessType,
        adhar_no: aadharNumber,
        adhar_front_pic: aadhaarFrontImageURI,
        adhar_back_pic: aadhaarBackImageURI,
      };

      if (isCheckBoxClicked) {
        vendorDetail = {
          ...vendorDetail,
          gstin_number: gstNumber,
          gstin_image: gstImageURI,
        };
      }
    } else if (businessType === "organization") {
      vendorDetail = {
        ...vendorDetail,
         business_name: businessName,
        vendor_type: businessType,
        gstin_number: gstNumber,
        gstin_image: gstImageURI,
      };
    }

    try {
      setIsLoading(true);

      const response = await dispatch(
        patchUpdateVendorProfile({
          detail: vendorDetail,
          user_key: user.user_key,
          accessToken: accessToken,
        })
      );

      if (patchUpdateVendorProfile.fulfilled.match(response)) {
        dispatch(
          showSnackbar({
            message: "Submitted successfully.",
            type: "success",
          })
        );
      } else if (patchUpdateVendorProfile.rejected.match(response)) {
        const errorMessage =
        response.payload||
          response?.payload?.message || "Submission failed. Please try again.";
        dispatch(showSnackbar({ message: errorMessage, type: "error" }));
      }
    } catch (error) {
      console.error("Error submitting vendor detail:", error);
      dispatch(
        showSnackbar({
          message: error?.message || "Submission failed. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectOnMap = () => {
    navigation.push("PickLocation", {
      addressFor: "stationAddress",
      setAddress: (newAddress) => setAddress(newAddress),
      setCoordinate: (newCoordinate) => setCoordinate(newCoordinate),
    });
  };

  const openGallery = async (setter, label) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.2,
        allowsEditing: true,
        aspect: label === "avatar" ? [1, 1] : undefined,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImageLoading(label);
        const file = await setupImagePicker(imageUri);

        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );

        if (
          response?.payload?.code === 200 ||
          response?.payload?.code === 201
        ) {
          setter(response?.payload?.data?.filePathUrl);
          console.log(
            "Profile Image URI set successfully:",
            response?.payload?.data?.filePathUrl
          );
        } else {
          Alert.alert("Error", "File should be less than 5 MB");
        }
      }
    } catch (error) {
      console.log("Error uploading file:", error);
      Alert.alert("Error", "Upload failed. Please try again.");
    } finally {
      setImageLoading("");
      setBottomSheetVisible(false);
    }
  };

  const openCamera = async (setter, label) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.2,
        allowsEditing: true,
        aspect: label === "avatar" ? [1, 1] : undefined,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImageLoading(label);
        const file = await setupImagePicker(imageUri);

        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );

        if (
          response?.payload?.code === 200 ||
          response?.payload?.code === 201
        ) {
          setter(response?.payload?.data?.filePathUrl);
          console.log(
            "Profile Image URI set successfully:",
            response?.payload?.data?.filePathUrl
          );
        } else {
          Alert.alert("Error", "File should be less than 5 MB");
        }
      }
    } catch (error) {
      console.log("Error uploading file:", error);
      Alert.alert("Error", "Upload failed. Please try again.");
    } finally {
      setImageLoading("");
      setBottomSheetVisible(false);
    }
  };

  const renderImageBox = (label, setter, apiRespUri) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (apiRespUri) {
            showFullImage(imageURL.baseURL + apiRespUri);
          }
        }}
        style={{ alignItems: "center", marginBottom: 20 }}
      >
        <View style={[styles.imageBox, { borderRadius: 12 }]}>
          {imageloading === label ? (
            <ActivityIndicator size={40} color="#ccc" />
          ) : apiRespUri ? (
            <Image
              source={{ uri: imageURL.baseURL + apiRespUri }}
              style={[styles.imageStyle, { borderRadius: 12 }]}
            />
          ) : (
            <MaterialIcons name="image-not-supported" size={50} color="#bbb" />
          )}

          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => {
              setCurrentImageSetter(() => setter);
              setCurrentImageLabel(label);
              setBottomSheetVisible(true);
            }}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {label !== "avatar" && <Text style={styles.imageLabel}>{label}</Text>}
      </TouchableOpacity>
    );
  };
  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
  };
  const removeImage = (setter) => {
    setter(null);
    setBottomSheetVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <MyStatusBar />
      {header()}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarSection}>
          <Text style={styles.sectionLabel}>
            Upload Your Photo <Text style={styles.label}>*</Text>
            {/* <Text style={styles.optional}>(Optional)</Text> */}
          </Text>
          <Text style={styles.photoDescription}>
            It will Appear As Your Profile Page.
          </Text>
          <View style={styles.imageContainer}>
            {renderImageBox("avatar", setAvatarURI, avatarURI)}
          </View>
        </View>
        {businessTypeSection?.()}
        {businessNameSection?.()}

        {aadharSection?.()}

        {panInfo()}
        {gstSection?.()}
        {addressSection?.()}
        {docImageSection?.()}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
        {/* Full Image Modal */}
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Bottom Sheet */}
        <RNModal
          isVisible={isBottomSheetVisible}
          onBackdropPress={() => setBottomSheetVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View style={styles.bottomSheet}>
            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => openCamera(currentImageSetter, currentImageLabel)}
            >
              <Ionicons name="camera" size={22} color="#555" />
              <Text style={styles.sheetOptionText}>Use Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => openGallery(currentImageSetter, currentImageLabel)}
            >
              <Entypo name="image" size={22} color="#555" />
              <Text style={styles.sheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => removeImage(currentImageSetter)}
            >
              <MaterialIcons name="delete" size={22} color="red" />
              <Text style={[styles.sheetOptionText, { color: "red" }]}>
                Remove Image
              </Text>
            </TouchableOpacity>
          </View>
        </RNModal>
      </ScrollView>
    </View>
  );
  function header() {
    return (
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Vendor Detail</Text>
        <View style={{ width: 20 }} />
      </View>
    );
  }
  function panInfo() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Pan Number <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
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
            }, 3000);

            setPanTimer(timer);
          }}
          maxLength={10}
        />
      </>
    );
  }
  function businessNameSection() {
    return (
      <>
        {businessType === "organization" && (
          <>
          <Text style={styles.sectionLabel}>
            Organization or Legal Name <Text style={styles.label}>*</Text>
          </Text>
       
        <TextInput
          style={styles.input}
          placeholder="Enter Organization or Legal Name"
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
        /></> )}
      </>
    );
  }
  function businessTypeSection() {
    return (
      <View style={[styles.section, { marginBottom: 12 }]}>
        <Text style={styles.sectionLabel}>
          Register As <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <View style={styles.TypeContainer}>
          <TouchableOpacity
            style={[
              styles.TypeButton,
              businessType === "individual" && styles.selectedButton,
            ]}
            onPress={() => {
              setBusinessType("individual");
            }}
          >
            <Text
              style={[
                styles.TypebuttonText,
                businessType === "individual" && styles.selectedButtonText,
              ]}
            >
              Individual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.TypeButton,
              businessType === "organization" && styles.selectedButton,
            ]}
            onPress={() => setBusinessType("organization")}
          >
            <Text
              style={[
                styles.TypebuttonText,
                businessType === "organization" && styles.selectedButtonText,
              ]}
            >
              Organization
            </Text>
          </TouchableOpacity>
        </View>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        )}
      </View>
    );
  }
  function aadharSection() {
    return (
      <>
        {businessType === "individual" && (
          <>
            <Text style={styles.sectionLabel}>
              Aadhaar Number <Text style={styles.label}>*</Text>
              {/* <Text style={styles.optional}>(Optional)</Text> */}
            </Text>
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
                }, 3000); // After 500ms of no typing

                setAadharTimer(timer);
              }}
              maxLength={12}
            />
          </>
        )}
      </>
    );
  }
  function gstSection() {
    return (
      <>
        {businessType === "individual" && (
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isCheckBoxClicked}
              onValueChange={setCheckBoxClicked}
              color={isCheckBoxClicked ? Colors.primaryColor : undefined}
            />
            <Text
              style={[styles.checkboxLabel, { color: Colors.primaryColor }]}
            >
              Do You Have GST Number ?
            </Text>
          </View>
        )}

        {(isCheckBoxClicked || businessType === "organization") && (
          <>
            <Text style={styles.sectionLabel}>
              Gst Number <Text style={styles.label}>*</Text>
              {/* <Text style={styles.optional}>(Optional)</Text> */}
            </Text>
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
                }, 3000);

                setGstTimer(timer);
              }}
            />
          </>
        )}
      </>
    );
  }
  function addressSection() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Address <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Home/Street/Locality, City, State, Pincode"
          placeholderTextColor="gray"
          multiline
          value={address}
          onChangeText={(text) => {
            if (text.length > 200) {
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
      </>
    );
  }
  function docImageSection() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Upload These Documents <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <View style={styles.imageContainer}>
          {businessType === "individual" && (
            <>
              {renderImageBox(
                "Aadhaar front",
                setAadhaarFrontImageURI,
                aadhaarFrontImageURI
              )}
              {renderImageBox(
                "Aadhaar Back",
                setAadhaarBackImageURI,
                aadhaarBackImageURI
              )}
            </>
          )}
          {renderImageBox("PAN", setPanImageURI, panImageURI)}

          {(isCheckBoxClicked || businessType === "organization") &&
            renderImageBox("GST", setGstImageURI, gstImageURI)}
        </View>
      </>
    );
  }
};

export default VendorDetailForm;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    padding: 20,
  },

  backButton: {
    marginLeft: 10,
    marginRight: 15,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bodyBackColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0eb",
  },

  label: {
    fontSize: 12,
    color: "#F4721E",
    marginBottom: 5,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'rgba(67, 92, 128, 0.43)', // Optional: semi-transparent overlay
    zIndex: 999,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
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

  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: 5,
  },
  optional: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#888",
  },
  photoDescription: {
    fontSize: 10,
    color: "#666",
    // marginBottom: 12,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 12,
  },
  TypeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  selectedButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedButtonText: {
    color: "white",
  },
  TypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  TypebuttonText: {
    fontSize: 12,
    color: "#555",
  },
  imageContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    gap: 20,
    marginTop: 20,
    flexWrap: "wrap",
  },
  imageBox: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#aaa",

    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f9f9f9",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  editIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: Colors.primaryColor,
    borderRadius: 15,
    padding: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  closeText: {
    color: "#000",
    fontWeight: "bold",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  sheetOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  imageContainerAvatar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 20,
    flexWrap: "wrap",
  },
  imageLabel: {
    textAlign: "center",
    marginTop: 6,
    color: "#444",
    fontSize: 12,
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 10,
  },
});
