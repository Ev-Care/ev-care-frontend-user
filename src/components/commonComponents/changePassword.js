import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from "react-native";

import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Sizes,
  Fonts,
  commonStyles,
  screenWidth,
} from "../../constants/styles";

import { Overlay } from "@rneui/themed";

import { default as Icon } from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";

import {
  selectAuthError,
  selectToken,
  selectUser,
} from "../../screens/auth/services/selector";

import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import { postUpdatePassword } from "../../screens/user/service/crudFunction";
import { PASSWORD_REGEX } from "../../constants/regex";


const ChangePassword = ({ route, navigation }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "Not found");
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [secureCurrentPass, setSecureCurrentPass] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);
  const [secureNewpass, setSecureNewPass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialogue, setshowDialogue] = useState(false);

  // console.log('user = ', user);
  const validateInputs = () => {
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;


    if (!newPassword || !confirmPassword || !currentPassword) {
      dispatch(
        showSnackbar({
          message: "All fields are required.",
          type: "error",
        })
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      dispatch(
        showSnackbar({ message: "New Password and Confirm Passwords do not match.", type: "error" })
      );
      return false;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      dispatch(
        showSnackbar({
          message:
            "Password must be 8–20 characters long and include at least one letter and one number.",
          type: "error",
        })
      );
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log('submit called');
    try {
      if (!validateInputs()) return;
      console.log("handle submit called");
      const payload = {
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      }
      const response = await dispatch(postUpdatePassword(payload));
      if (response.payload.code == 200) {
        await dispatch(showSnackbar({message: 'Password Updated Successfully', type: 'success'}));
        navigation.goBack();
        
      } else {
         await dispatch(showSnackbar({message: response.payload || 'Failed to update password', type: 'error'}));
      }

    }
    catch (error) {
      console.log('error in create user', error);
    } finally {
      setIsLoading(false);
    }
  };



  const renderPassword = (label, value, setter, placeholder, secure, setSecure) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
        {label}
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




  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: 16 }]}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {renderPassword(
          "Current Password",
          currentPassword,
          setCurrentPassword,
          "Enter Your Current Password",
          secureCurrentPass,
          setSecureCurrentPass

        )}
        {renderPassword(
          "New Password",
          newPassword,
          setNewPassword,
          "Enter New Password",
          secureNewpass,
          setSecureNewPass
        )}
        {renderPassword(
          "Confirm Password",
          confirmPassword,
          setConfirmPassword,
          "Confirm Your Password",
          secureConfirmPass,
          setSecureConfirmPass
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
    // backgroundColor: "#fff",
    flex:1,
    backgroundColor: Colors.whiteColor,
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
  imageContainer: {
    flexDirection: "row",
    gap: 20,
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
  editIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: Colors.primaryColor,
    borderRadius: 15,
    padding: 2,
  },
  vehicleEditIcon: {
    position: "absolute",
    top: "50%",
    right: 10,
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

export default ChangePassword;
