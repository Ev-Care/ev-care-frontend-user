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
import {
  selectAuthError,
  selectToken,
  selectUser,
} from "../../auth/services/selector";
import { useSelector, useDispatch } from "react-redux";
import RNModal from "react-native-modal";
import { default as Icon } from "react-native-vector-icons/MaterialIcons";
import imageURL from "../../../constants/baseURL";
import { postSingleFile } from "../../auth/services/crudFunction";
import { setupImagePicker } from "../../vendor/CompleteProfileDetail/vendorDetailForm";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import { createUser } from "../services/crudFunctions";

const CreateUser = ({ route, navigation }) => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [mobNumber, setMobNumber] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [aadharNumber, setAadharNumber] = useState(null);
  const [panNumber, setPanNumber] = useState(null);
  const [gstNumber, setGstNumber] = useState(null);

  const [aadhaarFrontImage, setAadhaarFrontImage] = useState(null);
  const [aadhaarBackImage, setAadhaarBackImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [gstImage, setGstImage] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentImageSetter, setCurrentImageSetter] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");
  const [imageloading, setImageLoading] = useState("");
  const [businessType, setBusinessType] = useState("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleCompany, setVehicleCompany] = useState(null);
  const [vehicleModel, setVehicleModel] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [securePass, setSecurePass] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);
  const accessToken = useSelector(selectToken);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const dispatch = useDispatch();
  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
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
  const selectOnMap = () => {
    navigation.push("PickLocation", {
      addressFor: "stationAddress",
      setAddress: (newAddress) => setAddress(newAddress),
      setCoordinate: (newCoordinate) => setCoordinate(newCoordinate),
    });
  };
  const removeImage = (setter) => {
    setter(null);
    setBottomSheetVisible(false);
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const aadharRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&.+-]{8,}$/;
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const vehicleNumberRegex = /^[A-Z0-9]{8,11}$/;

    if (!name || !mobNumber || !email) {
      dispatch(
        showSnackbar({
          message: "Name, Mobile Number, and Email are required.",
          type: "error",
        })
      );
      return false;
    }

    if (!nameRegex.test(name)) {
      dispatch(
        showSnackbar({
          message:
            "Invalid full name. Only letters and spaces, at least 3 characters.",
          type: "error",
        })
      );
      return false;
    }
    if (!emailRegex.test(email)) {
      dispatch(
        showSnackbar({ message: "Invalid Email format.", type: "error" })
      );
      return false;
    }

    if (!mobileRegex.test(mobNumber)) {
      dispatch(
        showSnackbar({
          message:
            "Invalid Mobile Number. It should be 10 digits and start with 6-9.",
          type: "error",
        })
      );
      return false;
    }
    if (!password || !confirmPassword) {
      dispatch(
        showSnackbar({
          message: "Password and Confirm Password are required.",
          type: "error",
        })
      );
      return false;
    }

    if (password !== confirmPassword) {
      dispatch(
        showSnackbar({ message: "Passwords do not match.", type: "error" })
      );
      return false;
    }

    if (!passwordRegex.test(password)) {
      dispatch(
        showSnackbar({
          message:
            "Password must be 8–20 characters long and include at least one letter and one number.",
          type: "error",
        })
      );
      return false;
    }

    if (selectedRole === "vendor") {
      if (!panNumber) {
        dispatch(
          showSnackbar({
            message: " PAN is required for vendors.",
            type: "error",
          })
        );
        return false;
      }

      if (businessType === "organization" && !businessName) {
        dispatch(
          showSnackbar({
            message: "Please Enter Organization or Legal Name",
            type: "error",
          })
        );
        return false;
      }

      if (!panRegex.test(panNumber)) {
        dispatch(
          showSnackbar({ message: "Invalid PAN number format.", type: "error" })
        );
        return false;
      }

      if (businessType === "individual") {
        if (!aadharNumber) {
          dispatch(
            showSnackbar({
              message:
                "Aadhar Number is required for individual business type.",
              type: "error",
            })
          );
          return false;
        }

        if (!aadharRegex.test(aadharNumber)) {
          dispatch(
            showSnackbar({
              message: "Invalid Aadhar number. Must be 12 digits.",
              type: "error",
            })
          );
          return false;
        }

        if (!aadhaarFrontImage || !aadhaarBackImage) {
          dispatch(
            showSnackbar({
              message: "Aadhaar front and back images are required.",
              type: "error",
            })
          );
          return false;
        }
      }

      if (!panImage) {
        dispatch(
          showSnackbar({ message: "PAN image is required.", type: "error" })
        );
        return false;
      }

      if (gstNumber && !gstRegex.test(gstNumber)) {
        dispatch(
          showSnackbar({ message: "Invalid GST number format.", type: "error" })
        );
        return false;
      }

      if (gstNumber && !gstImage) {
        dispatch(
          showSnackbar({
            message: "GST image is required if GST number is provided.",
            type: "error",
          })
        );
        return false;
      }
    } else {
      // User role: vehicle info is mandatory
      if (!vehicleNumber || !vehicleCompany || !vehicleModel) {
        dispatch(
          showSnackbar({
            message: "All vehicle details are required for users.",
            type: "error",
          })
        );
        return false;
      }
      if (!vehicleNumberRegex.test(vehicleNumber)) {
        dispatch(
          showSnackbar({
            message: "Invalid vechile number format.",
            type: "error",
          })
        );
        return false;
      }
    }
    if (selectedStatus === null) {
      dispatch(
        showSnackbar({
          message: "Please select a status.",
          type: "error",
        })
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    let payload = {
      owner_legal_name: name,
      mobile_number: mobNumber,
      email,
      avatar: avatar || null,
      role: selectedRole,
      password: password,
      status: selectedStatus,
    };

    if (selectedRole === "vendor") {
      payload = {
        ...payload,
        pan_no: panNumber,
        address: address,
        pan_pic: panImage,
        vendor_type: businessType,
        gstin_number: gstNumber || null,
        gstin_image: gstNumber ? gstImage : null,
      };
      if (businessType === "organization") {
        payload = {
          ...payload,
          business_name: businessName,
        };
      }

      if (businessType === "individual") {
        payload = {
          ...payload,
          adhar_no: aadharNumber,
          adhar_front_pic: aadhaarFrontImage,
          adhar_back_pic: aadhaarBackImage,
        };
      }
    } else {
      // Role: user
      payload = {
        ...payload,
        vehicle_registration_number: vehicleNumber,
        vehicle_manufacturer: vehicleCompany,
        vehicle_model: vehicleModel,
      };
    }
    console.log("Submitting payload:", payload);

    try {
      const response = await dispatch(createUser(payload));
      if (response.payload.code === 200 || response.payload.code === 201) {
        dispatch(
          showSnackbar({
            message: "User created successfully!",
            type: "success",
          })
        );
        navigation.pop();
      } else {
        dispatch(
          showSnackbar({
            message:
              response?.payload?.message ||
              response?.payload ||
              "Failed to create user",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.log("error in create user", error);

      dispatch(
        showSnackbar({ message: "Failed to create user!", type: "error" })
      );
    }
  };

  const renderInput = (label, value, setter, placeholder) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
        {label}
        {label === "GST Number" && businessType === "individual" ? (
          <Text style={styles.optional}> (Optional)</Text>
        ) : (
          <Text style={{ color: Colors.darOrangeColor }}> *</Text>
        )}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => {
          if (label === "Email") {
            setter(text.toLowerCase());
          } else if (
            label === "Vehicle Registration Number" ||
            label === "GST Number" ||
            label === "PAN Number"
          ) {
            setter(text.toUpperCase());
          } else {
            setter(text);
          }
        }}
        placeholder={placeholder}
        keyboardType={
          label === "Mobile Number"
            ? "numeric"
            : label === "Email"
              ? "email-address"
              : "default"
        }
        maxLength={
          label === "Mobile Number" || label === "PAN Number"
            ? 10
            : label === "Aadhar Number"
              ? 12
              : label === "GST Number"
                ? 15
                : undefined
        }
      />
    </View>
  );

  const renderPassword = (
    label,
    value,
    setter,
    placeholder,
    secure,
    setSecure
  ) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
        {label}
        <Text style={{ color: Colors.darOrangeColor }}> *</Text>
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#ccc",
          paddingHorizontal: 10,
        }}
      >
        <TextInput
          style={[styles.input, { flex: 1, borderWidth: 0 }]}
          value={value}
          onChangeText={setter}
          placeholder={placeholder}
          secureTextEntry={secure}
          maxLength={20}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons name={secure ? "eye-off" : "eye"} size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageBox = (label, apiRespUri, setter) => (
    <TouchableOpacity
      onPress={() => showFullImage(imageURL.baseURL + apiRespUri)}
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
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => {
            setCurrentImageSetter(() => setter);
            setBottomSheetVisible(true);
          }}
        >
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {label != "avatar" && <Text style={styles.imageLabel}>
        {label}

        {label === "GST" && businessType === "individual" ? (
          <Text style={styles.optional}> (Optional)</Text>
        ) : (
          <Text style={{ color: Colors.darOrangeColor }}> *</Text>
        )}
      </Text>}
    </TouchableOpacity>
  );

  const roleSelector = () => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
        Select Role
        <Text style={{ color: Colors.darOrangeColor }}> *</Text>
      </Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          onPress={() => setSelectedRole("user")}
          style={[
            styles.selectorOption,
            selectedRole === "user" && styles.selectedOption,
          ]}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedRole === "user" ? { color: "white" } : { color: "black" },
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedRole("vendor")}
          style={[
            styles.selectorOption,
            selectedRole === "vendor" && styles.selectedOption,
          ]}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedRole === "vendor"
                ? { color: "white" }
                : { color: "black" },
            ]}
          >
            Vendor
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: 16 }]}>Create a New User</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainerAvatar}>
          {renderImageBox("avatar", avatar, setAvatar)}
        </View>
        {renderInput("Full Name", name, setName, "Enter your full name")}
        {renderInput(
          "Mobile Number",
          mobNumber,
          setMobNumber,
          "Enter your mobile number"
        )}
        {renderInput("Email", email, setEmail, "Enter your email")}
        {statusSection()}
        {renderPassword(
          "Password",
          password,
          setPassword,
          "Enter Password",
          securePass,
          setSecurePass
        )}
        {renderPassword(
          "Confirm Password",
          confirmPassword,
          setConfirmPassword,
          "Confirm Your Password",
          secureConfirmPass,
          setSecureConfirmPass
        )}

        {roleSelector()}
        {selectedRole === "vendor" ? (
          <>
            {businessTypeSection()}
            {businessType === "organization" && (
              <>
                {renderInput(
                  "Organization or Legal Name",
                  businessName,
                  setBusinessName,
                  "Enter Organization or Legal Name"
                )}
              </>
            )}

            {renderInput(
              "PAN Number",
              panNumber,
              setPanNumber,
              "Enter PAN number"
            )}
            {businessType === "individual" &&
              renderInput(
                "Aadhar Number",
                aadharNumber,
                setAadharNumber,
                "Enter Aadhar number"
              )}

            {renderInput(
              "GST Number",
              gstNumber,
              setGstNumber,
              "Enter GST number"
            )}
            {addressInfo()}
            <View style={styles.imageContainer}>
              {businessType === "individual" && (
                <>
                  {renderImageBox(
                    "Aadhaar front",
                    aadhaarFrontImage,
                    setAadhaarFrontImage
                  )}
                  {renderImageBox(
                    "Aadhaar Back",
                    aadhaarBackImage,
                    setAadhaarBackImage
                  )}
                </>
              )}
              {renderImageBox("PAN", panImage, setPanImage)}
              {renderImageBox("GST", gstImage, setGstImage)}
            </View>
          </>
        ) : (
          <>
            {renderInput(
              "Vehicle Registration Number",
              vehicleNumber,
              setVehicleNumber,
              "Enter your vehicle Reg. Number"
            )}
            {renderInput(
              "Vehicle Manufacturer",
              vehicleCompany,
              setVehicleCompany,
              "Enter your vehicle Manufacturer Name"
            )}

            {renderInput(
              "Vehicle Model",
              vehicleModel,
              setVehicleModel,
              "Enter your vehicle Model"
            )}
          </>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: Colors.primaryColor },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
        <RNModal
          isVisible={isBottomSheetVisible}
          onBackdropPress={() => setBottomSheetVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View style={styles.bottomSheet}>
            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => openCamera(currentImageSetter)}
            >
              <Ionicons name="camera" size={22} color="#555" />
              <Text style={styles.sheetOptionText}>Use Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => openGallery(currentImageSetter)}
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
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </View>
  );
  function businessTypeSection() {
    return (
      <View style={[styles.section, { marginBottom: 12 }]}>
        <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
          Register As <Text style={{ color: Colors.darOrangeColor }}>*</Text>
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
      </View>
    );
  }
  function addressInfo() {
    return (
      <View style={styles.address}>
        <Text
          style={{
            marginBottom: 4,
            fontWeight: "bold",
            fontSize: 14,
            color: Colors.blackColor,
          }}
        >
          Address
          <Text style={{ color: Colors.darOrangeColor }}> *</Text>
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
        <Text
          style={{
            marginVertical: 4,
            fontWeight: "bold",
            fontSize: 14,
            color: Colors.darOrangeColor,
          }}
        >
          Or
        </Text>
        <TouchableOpacity
          onPress={selectOnMap}
          style={[
            styles.actionButton,
            { borderWidth: 1, borderColor: Colors.darOrangeColor },
          ]}
        >
          <Text style={styles.mapButtonText}>Select On Map</Text>
        </TouchableOpacity>
      </View>
    );
  }
  function statusSection() {
    const vendorStatus = ["Rejected", "Completed", "Active", "Inactive", "New", "Blocked"];
    const userStatus = ["Active", "Inactive", "Blocked"];

    return (
      <View style={[styles.section, { marginBottom: 12 }]}>
        <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
          Select Status
          <Text style={{ color: Colors.darOrangeColor }}> *</Text>
        </Text>

        <View style={[styles.TypeContainer, { flexWrap: "wrap" }]}>
          {selectedRole === "user" && userStatus.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.TypeButton,
                selectedStatus === status && styles.selectedButton,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.TypebuttonText,
                  selectedStatus === status && styles.selectedButtonText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
          {selectedRole === "vendor" && vendorStatus.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.TypeButton,
                selectedStatus === status && styles.selectedButton,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.TypebuttonText,
                  selectedStatus === status && styles.selectedButtonText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 50,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,

    flexWrap: "wrap",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(182, 206, 232, 0.3)",
    zIndex: 999,
  },
  imageContainerAvatar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
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
    marginTop: 30,
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
  optional: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#888",
  },
  dropdownText: {
    fontSize: 12,
    color: "#333",
  },
  TypeContainer: {
    flexDirection: "row",
    gap: 10,
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
  selectedButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedButtonText: {
    color: "white",
  },
  mapButtonText: {
    color: Colors.darOrangeColor,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default CreateUser;
