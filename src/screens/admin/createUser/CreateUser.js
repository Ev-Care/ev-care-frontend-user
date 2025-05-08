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
import { default as Icon } from "react-native-vector-icons/MaterialIcons";
import imageURL from "../../../constants/baseURL";
import { color } from '@rneui/base';


const CreateUser = ({ route, navigation }) => {
 
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [mobNumber, setMobNumber] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [aadharNumber, setAadharNumber] = useState(null);
  const [panNumber, setPanNumber] = useState(null);
  const [gstNumber, setGstNumber] = useState(null);

//   image start
  const [aadhaarFrontImage, setAadhaarFrontImage] = useState(null);
  const [aadhaarBackImage, setAadhaarBackImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [gstImage, setGstImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
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
 
  const[selectedRole,setSelectedRole]=useState("user");
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
        <View style={styles.appBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.title,{fontSize:16}]}>Create a New User</Text>
              <View style={{ width: 24 }} />
            </View>
    <ScrollView contentContainerStyle={styles.container}>
   
    <View style={styles.imageContainerAvatar}>
      {renderImageBox('avatar', avatar, setAvatar )}     
    </View>
    {renderInput('Full Name', name, setName, 'Enter your full name')}
    {renderInput('Mobile Number', mobNumber, setMobNumber, 'Enter your full name')}
    {renderInput('Email', email, setEmail, 'Enter your email')}
    {roleSelector()}

   {selectedRole === "vendor" && (<>
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
  </>)}


      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.primaryColor }]}>
          <Text style={styles.buttonText}>Submit</Text>
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
     
    </ScrollView>
    </View>
  );
function roleSelector(){
    return(
    <View style={{ marginBottom: 12 }}>
    <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>Select Role</Text>
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        onPress={() => setSelectedRole("user")}
        style={[
          styles.selectorOption,
          selectedRole === "user" && styles.selectedOption,
        ]}
      >
      <Text style={[styles.dropdownText, selectedRole === "user" ? { color: "white" } : {color: "black"}]}>User</Text>
  
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelectedRole("vendor")}
        style={[
          styles.selectorOption,
          selectedRole === "vendor" && styles.selectedOption,
        ]}
      >
         <Text style={[styles.dropdownText, selectedRole === "vendor" ? { color: "white" } : {color: "black"}]}>Vendor</Text>
  
      </TouchableOpacity>
    </View>
  </View>
)}
};

const styles = StyleSheet.create({
  container: {
   
    padding: 20,
    backgroundColor: '#fff',
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
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    gap:20,
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
 
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    // marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 3,
  },
  selectorOption: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedOption: {
  
    backgroundColor: Colors.primaryColor,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  
   
});

export default CreateUser;
