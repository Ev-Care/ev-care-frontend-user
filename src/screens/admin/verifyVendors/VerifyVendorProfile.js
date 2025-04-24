import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import {
    Colors,
    Sizes,
    Fonts,
    commonStyles,
    screenWidth,
  } from "../../../constants/styles";
import RNModal from 'react-native-modal';
import { Overlay } from "@rneui/themed";
import imageURL from "../../../constants/baseURL";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const VerifyVendorProfile = ({ route, navigation }) => {
  const { user } = route?.params; // Get the user data from route params
  const [name, setName] = useState(user?.owner_legal_name || 'Not found');
  const [email, setEmail] = useState(user?.email || 'Not found');
  const [mobNumber, setMobNumber] = useState(user?.mobile_number || 'Not found');
  const [businessName, setBusinessName] = useState(user?.business_name || 'Not found');
  const [aadharNumber, setAadharNumber] = useState(user?.adhar_no || 'Not found');
  const [panNumber, setPanNumber] = useState(user?.pan_no || 'Not found');
  const [gstNumber, setGstNumber] = useState(user?.gst_no || 'Not found');

//   image start
  const [aadhaarFrontImage, setAadhaarFrontImage] = useState(user?.adhar_front_pic);
  const [aadhaarBackImage, setAadhaarBackImage] = useState(user?.adhar_back_pic);
  const [panImage, setPanImage] = useState(user?.pan_pic);
  const [gstImage, setGstImage] = useState(user?.gst_pic);
  const [avatar, setAvatar] = useState(user?.owner_legal_name);
//   image uri
  const [aadhaarFrontImageURI, setAadhaarFrontImageURI] = useState(null);
  const [aadhaarBackImageURI, setAadhaarBackImageURI] = useState(null);
  const [panImageURI, setPanImageURI] = useState(null);
  const [gstImageURI, setGstImageURI] = useState(null);
  const [avatarURI, setAvatarURI] = useState(null);
//   image end

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentImageSetter, setCurrentImageSetter] = useState(null);
  const [showRejectDialogue, setshowRejectDialogue] = useState(false);
  const [showApproveDialogue, setshowApproveDialogue] = useState(false);
 const [imageloading, setImageLoading] = useState("");
  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const openGallery = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
    setBottomSheetVisible(false);
  };

  const openCamera = async (setter) => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });
    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
    setBottomSheetVisible(false);
  };

  const removeImage = (setter) => {
    setter(null);
    setBottomSheetVisible(false);
  };

  const handleReject = () => {
    console.log("handle Reject Called");
  };
  const handleApprove = () => {
    console.log("handle Approve Called");
  };

  const renderInput = (label, value, setter, placeholder) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
      />
    </View>
  );

  const renderImageBox = (label, localURI, setter, apiRespUri) => (
    <TouchableOpacity onPress={() => showFullImage(localURI)} style={{ alignItems: 'center', marginBottom: 20 }}>
      <View style={[styles.imageBox, { borderRadius: label === "avatar" ? 50 : 12 }]}>
        {imageloading===label ? (
          <ActivityIndicator size={40} color="#ccc" />
        ) : localURI ? (
          <Image source={{ uri: localURI }} style={styles.imageStyle} />
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
      <Text style={styles.imageLabel}>{label}</Text>
    </TouchableOpacity>
  );
  

  return (

    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update User Details</Text>
 
   <View style={styles.imageContainerAvatar}>
      {renderImageBox('avatar', avatar, setAvatar)}     
    </View>
    {renderInput('Full Name', name, setName, 'Enter your full name')}
    {renderInput('Mobile Number', mobNumber, setMobNumber, 'Enter your full name')}
    {renderInput('Email', email, setEmail, 'Enter your email')}
    {renderInput('Business Name', businessName, setBusinessName, 'Enter business name')}
    {renderInput('Aadhar Number', aadharNumber, setAadharNumber, 'Enter Aadhar number')}
    {renderInput('PAN Number', panNumber, setPanNumber, 'Enter PAN number')}
    {renderInput('GST Number', gstNumber, setGstNumber, 'Enter GST number')}    
    <View style={styles.imageContainer}>
      {renderImageBox('Aadhaar front', aadhaarFrontImage, setAadhaarFrontImage)}
      {renderImageBox('Aadhaar Back', aadhaarBackImage, setAadhaarBackImage)}
      {renderImageBox('PAN', panImage, setPanImage)}
      {renderImageBox('GST', gstImage, setGstImage)}   
    </View>


      <View style={styles.buttonRow}>

        <TouchableOpacity   onPress={() => {
            setshowRejectDialogue(true);
          }} style={[styles.actionButton, { backgroundColor: Colors.darOrangeColor  }]}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => {
            setshowApproveDialogue(true);
          }}  style={[styles.actionButton, { backgroundColor: Colors.primaryColor }]}>
          <Text style={styles.buttonText}>Approve</Text>
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
        style={{ justifyContent: 'flex-end', margin: 0 }}
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
            <Text style={[styles.sheetOptionText, { color: 'red' }]}>Remove Image</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
      { rejectDialogue()}
      {approveDialogue()}
    </ScrollView>
    </View>
  );

    function rejectDialogue() {
      return (
        <Overlay
          isVisible={showRejectDialogue}
          onBackdropPress={() => setshowRejectDialogue(false)}
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
              Do You Want To Reject?
            </Text>
            <View
              style={{
                alignSelf: "center",
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 2,
                borderColor: Colors.darOrangeColor,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: Sizes.fixPadding * 1.5,
              }}
            >
              <MaterialCommunityIcons
                name="question-mark-circle-outline"
                size={40}
                color={Colors.darOrangeColor}
              />
            </View>
  
            <View
              style={{
                ...commonStyles.rowAlignCenter,
                marginTop: Sizes.fixPadding,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setshowRejectDialogue(false);
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
                  handleReject();
                  setshowRejectDialogue(false);
                  // handle delete logic here
                }}
                style={{
                  backgroundColor: Colors.darOrangeColor,
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
    function approveDialogue() {
      return (
        <Overlay
          isVisible={showApproveDialogue}
          onBackdropPress={() => setshowApproveDialogue(false)}
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
              Do You Want To Approve?
            </Text>
            <View
              style={{
                alignSelf: "center",
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 2,
                borderColor: Colors.primaryColor,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: Sizes.fixPadding * 1.5,
              }}
            >
              <MaterialCommunityIcons
                name="question-mark-circle-outline"
                size={40}
                color={Colors.primaryColor}
              />
            </View>
    
            <View
              style={{
                ...commonStyles.rowAlignCenter,
                marginTop: Sizes.fixPadding,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setshowApproveDialogue(false);
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
                  handleApprove();
                  setshowApproveDialogue(false);
                  // handle delete logic here
                }}
                style={{
                  ...styles.yesButtonStyle,
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
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    
    flexWrap: 'wrap',
  },
  imageContainerAvatar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  imageBox: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#aaa',
   
   
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#f9f9f9',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  editIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.primaryColor,
    borderRadius: 15,
    padding: 2,
  },
  imageLabel: {
    textAlign: 'center',
    marginTop: 6,
    color: '#444',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  closeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sheetOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
   /*  Dialog Styles */
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
    yesButtonStyle: {
        borderTopColor: Colors.primaryColor,
        backgroundColor: Colors.primaryColor,
        borderBottomRightRadius: Sizes.fixPadding - 5.0,
      },
    /*End of  Dialog Styles */
});

export default VerifyVendorProfile;
