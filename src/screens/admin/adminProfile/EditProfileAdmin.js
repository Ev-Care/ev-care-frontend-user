import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Sizes,
  Fonts,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import RNModal from "react-native-modal";
import { Overlay } from "@rneui/themed";
import imageURL from "../../../constants/baseURL";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
import { postSingleFile } from "../../auth/services/crudFunction";
import { patchUpdateUserProfile } from "../../user/service/crudFunction";
import { default as Icon } from "react-native-vector-icons/MaterialIcons";
import { setupImagePicker } from "../../vendor/CompleteProfileDetail/vendorDetailForm";
import {
  selectAuthError,
  selectToken,
  selectUser,
} from "../../auth/services/selector";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
const EditAdminProfile = ({ route, navigation }) => {
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectToken);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "Not found");
  const [email, setEmail] = useState(user?.email || "Not found");
  const [mobNumber, setMobNumber] = useState(
    user?.mobile_number || "Not found"
  );
  const [businessName, setBusinessName] = useState(
    user?.business_name || "Not found"
  );
  const [aadharNumber, setAadharNumber] = useState(
    user?.adhar_no || "Not found"
  );
  const [panNumber, setPanNumber] = useState(user?.pan_no || "Not found");
  const [gstNumber, setGstNumber] = useState(user?.gstin_number);
  //   image start
  // const [aadhaarFrontImage, setAadhaarFrontImage] = useState(null);
  // const [aadhaarBackImage, setAadhaarBackImage] = useState(null);
  // const [panImage, setPanImage] = useState(null);
  // const [gstImage, setGstImage] = useState(null);
  // const [avatar, setAvatar] = useState(null);
  //   image uri
  const [aadhaarFrontImageURI, setAadhaarFrontImageURI] = useState(
    user?.adhar_front_pic
  );
  const [aadhaarBackImageURI, setAadhaarBackImageURI] = useState(
    user?.adhar_back_pic
  );
  const [panImageURI, setPanImageURI] = useState(user?.pan_pic);
  const [gstImageURI, setGstImageURI] = useState(user?.gstin_image);
  const [avatarURI, setAvatarURI] = useState(user?.avatar);
  //   image end
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentImageSetter, setCurrentImageSetter] = useState(null);
  const [currentImageLabel, setCurrentImageLabel] = useState(null);
  const [showDialogue, setshowDialogue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageloading, setImageLoading] = useState("");
  const errorMessage = useSelector(selectAuthError);
  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updatedData = {
        owner_legal_name: name,
        email: email,
        avatar: avatarURI,
        role: user?.role,
        user_key: user?.user_key,
      };
  
      console.log("Updated Data:", updatedData);
  
      const response = await dispatch(patchUpdateUserProfile(updatedData));
  
      if (patchUpdateUserProfile.fulfilled.match(response)) {
        await dispatch(
          showSnackbar({
            message: "Profile Updated Successfully.",
            type: "success",
          })
        );
      } else if (patchUpdateUserProfile.rejected.match(response)) {
        await dispatch(
          showSnackbar({
            message: errorMessage || "Failed to Update",
            type: "error",
          })
        );
      }
  
      console.log("Response from update profile:", response.payload);
  
    } finally {
      setIsLoading(false); 
    }
  };
  

  const openGallery = async (setter, label) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.1,
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
        quality: 0.1,
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

  const removeImage = (setter) => {
    setter(null);
    setBottomSheetVisible(false);
  };

  const renderInput = (label, value, setter, placeholder) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
        {label}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
      />
    </View>
  );

  const renderNonEditableInput = (label, value, setter, placeholder) =>
    value ? (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
          {label}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#E0E0E0" }]}
          value={value}
          onChangeText={setter}
          placeholder={placeholder}
          editable={false}
        />
      </View>
    ) : null;

    const renderImageBox = (label, setter, apiRespUri) => {
        if (!apiRespUri && label !== "avatar") return null;
      
        return (
          <TouchableOpacity
            onPress={() => {
              if (apiRespUri) {
                showFullImage(imageURL.baseURL + apiRespUri);
              }
            }}
            style={{ alignItems: "center", marginBottom: 20 }}
          >
            <View
              style={[
                styles.imageBox,
                { borderRadius: label === "avatar" ? 50 : 12 },
              ]}
            >
              {imageloading === label ? (
                <ActivityIndicator size={40} color="#ccc" />
              ) : apiRespUri ? (
                <Image
                  source={{ uri: imageURL.baseURL + apiRespUri }}
                  style={[
                    styles.imageStyle,
                    { borderRadius: label === "avatar" ? 50 : 12 },
                  ]}
                />
              ) : (
                <MaterialIcons name="image-not-supported" size={50} color="#bbb" />
              )}
      
              {label === "avatar" && (
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
              )}
            </View>
            {label !== "avatar" && <Text style={styles.imageLabel}>{label}</Text>}
          </TouchableOpacity>
        );
      };
      
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
       <View style={styles.appBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.title,{fontSize:16}]}>Edit Profile</Text>
              <View style={{ width: 24 }} />
            </View>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.imageContainerAvatar}>
          {renderImageBox("avatar", setAvatarURI, avatarURI)}
        </View>
        {renderInput("Full Name", name, setName, "Enter your full name")}
        {renderNonEditableInput(
          "Mobile Number",
          mobNumber,
          setMobNumber,
          "Enter your full name"
        )}
        {renderInput("Email", email, setEmail, "Enter your email")}

        {user?.role === "vendor" && (
          <>
            {renderInput(
              "Business Name",
              businessName,
              setBusinessName,
              "Enter business name"
            )}
            {renderNonEditableInput(
              "Aadhar Number",
              aadharNumber,
              setAadharNumber,
              "Enter Aadhar number"
            )}
            {renderNonEditableInput(
              "PAN Number",
              panNumber,
              setPanNumber,
              "Enter PAN number"
            )}
            {renderNonEditableInput(
              "GST Number",
              gstNumber,
              setGstNumber,
              "Enter GST number"
            )}
            <View style={styles.imageContainer}>
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
              {renderImageBox("PAN", setPanImageURI, panImageURI)}
              {renderImageBox("GST", setGstImageURI, gstImageURI)}
            </View>
          </>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              setshowDialogue(true);
            }}
            style={[
              styles.actionButton,
              { backgroundColor: Colors.primaryColor },
            ]}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>

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
        {UpdateOverlay()}
      </ScrollView>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </View>
  );

  function UpdateOverlay() {
    return (
      <Overlay
        isVisible={showDialogue}
        onBackdropPress={() => setshowDialogue(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View>
          <Text
            style={{
              ...Fonts.blackColor18Medium,
              textAlign: "center",
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginVertical: Sizes.fixPadding * 2.0,
            }}
          >
            Do You Want To Update?
          </Text>

          <View
            style={{
              ...commonStyles.rowAlignCenter,
              marginTop: Sizes.fixPadding,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowDialogue(false);
              }}
              style={{
                ...styles.noButtonStyle,
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.blackColor16Medium }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                handleSubmit();
                setshowDialogue(false);
                // handle delete logic here
              }}
              style={{
                backgroundColor: Colors.primaryColor,
                borderBottomRightRadius: 4,
                ...styles.dialogYesNoButtonStyle,
              }}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,

    flexWrap: "wrap",
  },
  imageContainerAvatar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 20,
    flexWrap: "wrap",
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
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bodyBackColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0eb",
    elevation: 5,
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
  imageLabel: {
    textAlign: "center",
    marginTop: 6,
    color: "#444",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 10,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    // marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  /* delete Dialog Styles */
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: "85%",
    padding: 0.0,
    elevation: 0,
  },

  dialogYesNoButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,

    padding: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  noButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  /*End of delete Dialog Styles */
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 3,
  },
  selectorOption: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: Colors.primaryColor,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
});

export default EditAdminProfile;
