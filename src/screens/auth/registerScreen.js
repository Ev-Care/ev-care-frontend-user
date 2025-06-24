import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import MyStatusBar from "../../components/myStatusBar";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import { register } from "./services/crudFunction";
import { selectAuthError, selectToken, selectUser } from "./services/selector";
import { vehicleData } from "../../utils/evVehicleData";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX, VEHICLE_NUMBER_REGEX } from "../../constants/regex";
// import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setfullName] = useState(null);
  const [email, setemail] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Get user data from Redux store
  const token = useSelector(selectToken); // Get user data from Redux store
  const error = useSelector(selectAuthError); // Get error from Redux store
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [customCompany, setCustomCompany] = useState(null);
  const [customModel, setCustomModel] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState(null);

  const [mobNumber, setMobNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  const models =
    selectedCompany && vehicleData[selectedCompany]
      ? vehicleData[selectedCompany]
      : [];
  // console.log("user key in register : ", userKey);

  const validateUserData = (data) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const nameRegex = /^[A-Za-z\s]{3,}$/;
    // const vehicleNumberRegex = /^[A-Z0-9]{8,11}$/;
    // const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    // const phoneRegex = /^[6-9]\d{9}$/;

    if (!PHONE_REGEX.test(mobNumber)) {
      return "Invalid mobile number";
    }
    if (!data.email || !EMAIL_REGEX.test(data.email)) {
      return "Invalid email address.";
    }

    if (!data.owner_legal_name || !NAME_REGEX.test(data.owner_legal_name)) {
      return "Invalid full name. Only letters and spaces, at least 3 characters.";
    }

    if (!data.role || !["user", "vendor"].includes(data.role.toLowerCase())) {
      return "Role must be either 'user' or 'vendor'.";
    }

    if (!data.password) {
      return "Password is required.";
    }

    if (!PASSWORD_REGEX.test(data.password)) {
      return "Password must be 8–20 characters long and include at least one letter and one number.";
    }

    if (!data.confirm_password) {
      return "Confirm password is required.";
    }

    if (data.password !== data.confirm_password) {
      return "Passwords do not match.";
    }

    if (data.role === "user") {
      if (
        !data.vehicle_registration_number ||
        !VEHICLE_NUMBER_REGEX.test(data.vehicle_registration_number)
      ) {
        return "Invalid vehicle number format ";
      }

      if (
        !data.vehicle_manufacturer ||
        data.vehicle_manufacturer.trim() === ""
      ) {
        return "Vehicle manufacturer is required.";
      }

      if (!data.vehicle_model || data.vehicle_model.trim() === "") {
        return "Vehicle model is required.";
      }
    }

    return null; // all good
  };

  const handleSignUp = async () => {
    const userData = {
      email: email,
      owner_legal_name: fullName,
      role: role,
      password:password.trim(),
      mobile_number: mobNumber,
      confirm_password: confirmPassword.trim(),
      vehicle_registration_number: vehicleNumber,
      vehicle_manufacturer:
        customCompany !== "" || null ? customCompany : selectedCompany,
      vehicle_model: customModel !== "" || null ? customModel : selectedModel,
    };

    const validationError = validateUserData(userData);
    if (validationError) {
      // console.log("error cartched");
      dispatch(showSnackbar({ message: validationError, type: "error" }));
      return;
    }

    setLoading(true);

    // console.log("P/ost signup called");
    try {
      const response = await dispatch(register(userData));
      if (register.fulfilled.match(response)) {
            // Save user data and token to AsyncStorage
        AsyncStorage.setItem("user", response?.payload?.data?.user?.user_key);
        // console.log('token in sigin = ', token);
        AsyncStorage.setItem("accessToken", response?.payload?.data?.access_token);
        dispatch(
          showSnackbar({ message: "Registration Successfull", type: "success" })
        );
      } else if (register.rejected.match(response)) {
        dispatch(
          showSnackbar({
            message: response.payload || "Registration Failed",
            type: "error",
          })
        );
      }
    } catch (error) {
      // console.log("Error during registration");
      dispatch(
        showSnackbar({
          message: error || "Something went wrong. Please try again later!",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {topImage()}
        <ScrollView
          style={{ paddingHorizontal: 20 }}
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >
          {selectRole()}
          {fullNameInfo()}
          {mobNumberInfo()}
          {emailInfo()}
          {role === "user" && (
            <>
              {vehicleNumberInfo()}
              {vehicleDataForm()}
            </>
          )}
          {passwordField()}
          {signInText()}
          {continueButton()}
          {agreeInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function selectRole() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          margin: Sizes.fixPadding * 2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="User"
            status={role === "user" ? "checked" : "unchecked"}
            onPress={() => setRole("user")}
          />
          <Text>User</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="Vendor"
            status={role === "vendor" ? "checked" : "unchecked"}
            onPress={() => setRole("vendor")}
          />
          <Text>Vendor</Text>
        </View>
      </View>
    );
  }

  function agreeInfo() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center", ...Fonts.grayColor16Medium }}>
          By continuing, you agree to our
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("http://evcareindia.com/")}
        >
          <Text
            style={{
              textAlign: "center",
              ...Fonts.grayColor18SemiBold,
              color: "blue",
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function emailInfo() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Email Id <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <View
          style={{
            ...styles.textFieldWrapper,
            marginBottom: Sizes.fixPadding * 2.0,
          }}
        >
          <TextInput
            placeholder="Enter Your Email id "
            placeholderTextColor={Colors.grayColor}
            value={email}
            onChangeText={(text) => setemail(text.toLowerCase())}
            style={{
              ...Fonts.blackColor16Medium,
              paddingVertical: 12,
              fontSize: 12,
            }}
            cursorColor={Colors.primaryColor}
           
            keyboardType="email-address"
          />
        </View>
      </>
    );
  }
  function mobNumberInfo() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Mobile Number <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <View
          style={{
            ...styles.textFieldWrapper,
            marginBottom: Sizes.fixPadding * 2.0,
          }}
        >
          <TextInput
            placeholder="Enter Your Mobile Number "
            placeholderTextColor={Colors.grayColor}
            value={mobNumber}
            onChangeText={(text) => setMobNumber(text)}
            style={{
              ...Fonts.blackColor16Medium,
              paddingVertical: 12,
              fontSize: 12,
            }}
            cursorColor={Colors.primaryColor}
         
            maxLength={10}
            keyboardType="numeric"
          />
        </View>
      </>
    );
  }
  function passwordField() {
    return (
      <>
        {/* Password Field */}
        <Text style={styles.sectionLabel}>
          Password <Text style={styles.label}>*</Text>
        </Text>
        <View
          style={{
            ...styles.textFieldWrapper,
            marginBottom: Sizes.fixPadding * 2.0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Enter Your Password"
            placeholderTextColor={Colors.grayColor}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={secureText}
            maxLength={20}
            style={{
              ...Fonts.blackColor16Medium,
              paddingVertical: 12,
              fontSize: 12,
              flex: 1,
            }}
            cursorColor={Colors.primaryColor}
          
          />
          <Ionicons
            name={secureText ? "eye-off" : "eye"}
            size={20}
            color={Colors.grayColor}
            onPress={() => setSecureText(!secureText)}
            style={{ marginHorizontal: 10 }}
          />
        </View>

        {/* Confirm Password Field */}
        <Text style={styles.sectionLabel}>
          Confirm Password <Text style={styles.label}>*</Text>
        </Text>
        <View
          style={{
            ...styles.textFieldWrapper,
            marginBottom: Sizes.fixPadding * 2.0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Re-enter Your Password"
            placeholderTextColor={Colors.grayColor}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={secureConfirmText}
            maxLength={20}
            style={{
              ...Fonts.blackColor16Medium,
              paddingVertical: 12,
              fontSize: 12,
              flex: 1,
            }}
            cursorColor={Colors.primaryColor}
        
          />
          <Ionicons
            name={secureConfirmText ? "eye-off" : "eye"}
            size={20}
            color={Colors.grayColor}
            onPress={() => setSecureConfirmText(!secureConfirmText)}
            style={{ marginHorizontal: 10 }}
          />
        </View>
      </>
    );
  }

  function fullNameInfo() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Full Name <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <View style={{ ...styles.textFieldWrapper }}>
          <TextInput
            placeholder="Enter Your Full name"
            placeholderTextColor={Colors.grayColor}
            value={fullName}
            onChangeText={(text) => setfullName(text)}
            style={{
              ...Fonts.blackColor16Medium,
              paddingVertical: 12,
              fontSize: 12,
            }}
            cursorColor={Colors.primaryColor}
          
          />
        </View>
      </>
    );
  }
  function vehicleNumberInfo() {
    return (
      <>
        <Text style={styles.sectionLabel}>
          Vehicle Registration Number <Text style={styles.label}>*</Text>
          {/* <Text style={styles.optional}>(Optional)</Text> */}
        </Text>
        <View style={{ ...styles.textFieldWrapper }}>
          <TextInput
            placeholder="Enter Your Vehicle Registration Number"
            placeholderTextColor={Colors.grayColor}
            value={vehicleNumber}
            onChangeText={(text) => setVehicleNumber(text.toUpperCase())}
            style={{
              ...Fonts.blackColor16Medium,
              paddingVertical: 12,
              fontSize: 12,
            }}
            cursorColor={Colors.primaryColor}
        
          />
        </View>
      </>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSignUp}
        style={{
          ...commonStyles.button,
          borderRadius: Sizes.fixPadding - 5.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
        disabled={loading}
      >
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={{ ...Fonts.whiteColor18Medium }}>Please Wait...</Text>
          </View>
        ) : (
          <Text style={{ ...Fonts.whiteColor18Medium }}>Continue</Text>
        )}
      </TouchableOpacity>
    );
  }

  function topImage() {
    return (
      <ImageBackground
        source={require("../../../assets/images/authbg.png")}
        style={{ width: screenWidth, height: screenWidth - 150 }}
        resizeMode="stretch"
      >
        <View style={styles.topImageOverlay}>
          <MaterialIcons
            name="arrow-back"
            color={Colors.whiteColor}
            size={26}
            onPress={() => navigation.goBack()} // Use goBack instead of navigate
          />
          <View>
            <Text style={{ ...Fonts.whiteColor22SemiBold }}>Register</Text>
            <Text
              style={{
                ...Fonts.whiteColor16Regular,
                marginTop: Sizes.fixPadding,
              }}
            >
              Create your account
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  function vehicleDataForm() {
    return (
      <View style={styles.container}>
        {/* Company Picker */}
        <Text style={styles.sectionLabel}>
          Select Vehicle Manufacturer <Text style={styles.label}>*</Text>
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCompany}
            onValueChange={(itemValue) => {
              setSelectedCompany(itemValue);
              setSelectedModel(""); // Reset model
              setCustomCompany("");
              setCustomModel("");
            }}
            style={styles.pickerStyle}
          >
            <Picker.Item
              style={{ fontSize: 12 }}
              label="Select Manufacturer"
              value=""
            />
            {Object.keys(vehicleData).map((make) => (
              <Picker.Item
                style={{ fontSize: 12 }}
                key={make}
                label={make}
                value={make}
              />
            ))}
          </Picker>
        </View>

        {/* Custom company if 'Other' */}
        {selectedCompany === "Others" && (
          <>
            <Text style={styles.sectionLabel}>
              Enter Vehicle Manufacturer <Text style={styles.label}>*</Text>
            </Text>

            <View
              style={{
                ...styles.textFieldWrapper,
                marginBottom: Sizes.fixPadding * 2.0,
              }}
            >
              <TextInput
                placeholder="Enter Manufacturer Name here "
                placeholderTextColor={Colors.grayColor}
                value={customCompany}
                onChangeText={setCustomCompany}
                style={{
                  ...Fonts.blackColor16Medium,
                  paddingVertical: 12,
                  fontSize: 12,
                }}
                cursorColor={Colors.primaryColor}
             
              />
            </View>
            <Text style={styles.sectionLabel}>
              Enter Vehicle Model <Text style={styles.label}>*</Text>
            </Text>
            <View
              style={{
                ...styles.textFieldWrapper,
                marginBottom: Sizes.fixPadding * 2.0,
              }}
            >
              <TextInput
                placeholder="Enter Model here "
                placeholderTextColor={Colors.grayColor}
                value={customModel}
                onChangeText={setCustomModel}
                style={{
                  ...Fonts.blackColor16Medium,
                  paddingVertical: 12,
                  fontSize: 12,
                }}
                cursorColor={Colors.primaryColor}
            
              />
            </View>
          </>
        )}

        {/* Model Picker if applicable */}
        {models.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>
              Select Vehicle Model <Text style={styles.label}>*</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedModel}
                onValueChange={(itemValue) => setSelectedModel(itemValue)}
                style={styles.pickerStyle}
              >
                <Picker.Item
                  style={{ fontSize: 12 }}
                  label="Select Model"
                  value=""
                />
                {models.map((model) => (
                  <Picker.Item
                    style={{ fontSize: 12 }}
                    key={model}
                    label={model}
                    value={model}
                  />
                ))}
                <Picker.Item
                  style={{ fontSize: 12 }}
                  label="Other"
                  value="Other"
                />
              </Picker>
            </View>
          </>
        ) : selectedCompany !== "" ? null : null}

        {/* Custom model if no models found or "Other" selected */}
        {(selectedCompany === "Other" || selectedModel === "Other") && (
          <>
            <Text style={styles.sectionLabel}>
              Enter Vehicle Model <Text style={styles.label}>*</Text>
            </Text>
            <View
              style={{
                ...styles.textFieldWrapper,
                marginBottom: Sizes.fixPadding * 2.0,
              }}
            >
              <TextInput
                placeholder="Enter Model here "
                placeholderTextColor={Colors.grayColor}
                value={customModel}
                onChangeText={setCustomModel}
                style={{
                  ...Fonts.blackColor16Medium,
                  paddingVertical: 12,
                  fontSize: 12,
                }}
                cursorColor={Colors.primaryColor}
             
              />
            </View>
          </>
        )}
      </View>
    );
  }
  function signInText() {
    return (
      <View style={{ alignItems: "flex-end", marginBottom: 20 }}>
        <Text style={{ ...Fonts.grayColor18Medium, textAlign: "right" }}>
          Are You Existing User?{" "}
          <Text
            onPress={() => navigation.goBack()}
            style={{
              ...Fonts.grayColor18SemiBold,
              color: "blue",
              fontWeight: "700",
            }}
          >
            Click Here
          </Text>
        </Text>
      </View>
    );
  }
};

export default RegisterScreen;

const styles = StyleSheet.create({
  topImageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: Sizes.fixPadding * 2.0,
  },
  textFieldWrapper: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    // backgroundColor:"cyan",
    paddingVertical: 5,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: 10,
  },
  optional: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#888",
  },
  container: { marginBottom: 10 },
  textField: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    ...commonStyles.shadow,
    padding: 12,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: Colors.bodyBackColor,
  },
  pickerWrapper: {
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 5.0,

    marginBottom: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
  },
  pickerStyle: {
    height: Platform.OS === "ios" ? 180 : 50,
    width: "100%",
    color: "#000",
    fontSize: 16,
  },
});
