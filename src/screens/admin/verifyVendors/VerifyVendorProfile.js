import { MaterialIcons } from "@expo/vector-icons";
import { Overlay } from "@rneui/themed";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch } from "react-redux";
import imageURL from "../../../constants/baseURL";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles
} from "../../../constants/styles";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import { approveVendorProfile, getAllUsers } from "../services/crudFunctions";
import { default as Icon } from "react-native-vector-icons/MaterialIcons";

const VerifyVendorProfile = ({ route, navigation }) => {
  const { user } = route?.params; // Get the user data from route params
  const [name, setName] = useState(user?.owner_legal_name || "Not found");
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
  const [gstNumber, setGstNumber] = useState(user?.gst_no || "--");

  //   image start
  const [aadhaarFrontImage, setAadhaarFrontImage] = useState(
    imageURL.baseURL + user?.adhar_front_pic
  );
  const [aadhaarBackImage, setAadhaarBackImage] = useState(
    imageURL.baseURL + user?.adhar_back_pic
  );
  const [panImage, setPanImage] = useState(imageURL.baseURL + user?.pan_pic);
  const [gstImage, setGstImage] = useState(imageURL.baseURL + user?.gst_pic);
  const [avatar, setAvatar] = useState(imageURL.baseURL + user?.avatar);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [showRejectDialogue, setshowRejectDialogue] = useState(false);
  const [showApproveDialogue, setshowApproveDialogue] = useState(false);
  const [imageloading, setImageLoading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showFullImage = (uri) => {
    if (!uri) return;
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const dispatch = useDispatch();

  const handleReject = async () => {
    console.log("calling reject");
    setIsLoading(true);
    try {
      const rejectResponse = await dispatch(
        approveVendorProfile({ user_key: user?.user_key, status: "reject" })
      );
      console.log({ rejectResponse });

      if (approveVendorProfile.fulfilled.match(rejectResponse)) {
        const pendingVendorResponse = await dispatch(getAllUsers());

        if (getAllUsers.fulfilled.match(pendingVendorResponse)) {
          await dispatch(
            showSnackbar({
              message: "Vendor profile rejected.",
              type: "success",
            })
          );
          navigation.goBack();
        } else if (getAllUsers.rejected.match(pendingVendorResponse)) {
          dispatch(
            showSnackbar({
              message: "Failed to reject vendor.",
              type: "error",
            })
          );
        }
      } else if (approveVendorProfile.rejected.match(approvedResponse)) {
        dispatch(
          showSnackbar({ message: "Failed to reject vendor.", type: "error" })
        );
      }
    } finally {
      setIsLoading(false);
    }
    // dispatch(
    //   showSnackbar({
    //     message: "Currently this service is under development.",
    //     type: "error",
    //   })
    // );
  };
  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const approvedResponse = await dispatch(
        approveVendorProfile({ user_key: user?.user_key, status: "approve" })
      );

      if (approveVendorProfile.fulfilled.match(approvedResponse)) {
        const pendingVendorResponse = await dispatch(getAllUsers());

        if (getAllUsers.fulfilled.match(pendingVendorResponse)) {
          await dispatch(
            showSnackbar({
              message: "Vendor profile approved.",
              type: "success",
            })
          );
          navigation.goBack();
        } else if (getAllUsers.rejected.match(pendingVendorResponse)) {
          dispatch(
            showSnackbar({
              message: "Failed to approve vendor.",
              type: "error",
            })
          );
        }
      } else if (approveVendorProfile.rejected.match(approvedResponse)) {
        dispatch(
          showSnackbar({ message: "Failed to approve vendor.", type: "error" })
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderTextData = (key, value) => (
    <View
      style={{
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 14, textAlign: "left" }}>
        {key}:
      </Text>
      <Text style={{ fontSize: 14, textAlign: "right" }}>{value}</Text>
    </View>
  );

  const renderImageBox = (label, localURI) => (
    <TouchableOpacity
      onPress={() => showFullImage(localURI)}
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
        ) : localURI ? (
          <Image
            source={{ uri: localURI }}
            style={[
              styles.imageStyle,
              { borderRadius: label === "avatar" ? 50 : 12 },
            ]}
          />
        ) : (
          <MaterialIcons name="image-not-supported" size={50} color="#bbb" />
        )}
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
              <Text style={[styles.title,{fontSize:16}]}>Verify Vendor Profile</Text>
              <View style={{ width: 24 }} />
            </View>
      <ScrollView contentContainerStyle={styles.container}>
     
        <View style={styles.imageContainerAvatar}>
          {renderImageBox("avatar", avatar, setAvatar)}
        </View>
        {renderTextData("Full Name", name)}
        {renderTextData("Mobile Number", mobNumber)}
        {renderTextData("Email", email)}
        {renderTextData("Business Name", businessName)}
        {renderTextData("Aadhar Number", aadharNumber)}
        {renderTextData("PAN Number", panNumber)}
        {renderTextData("GST Number", gstNumber)}
        <View style={styles.imageContainer}>
          {renderImageBox("Aadhaar front", aadhaarFrontImage)}
          {renderImageBox("Aadhaar Back", aadhaarBackImage)}
          {renderImageBox("PAN", panImage)}
          {renderImageBox("GST", gstImage)}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              setshowRejectDialogue(true);
            }}
            style={[
              styles.actionButton,
              { backgroundColor: Colors.darOrangeColor },
            ]}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setshowApproveDialogue(true);
            }}
            style={[
              styles.actionButton,
              { backgroundColor: Colors.primaryColor },
            ]}
          >
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
        {rejectDialogue()}
        {approveDialogue()}
      </ScrollView>
        {isLoading && (
             <View style={styles.loaderContainer}>
               <ActivityIndicator size="large" color={Colors.primaryColor} />
             </View>
           )}
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
    // backgroundColor: Colors.bodyBackColor,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },  
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
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
