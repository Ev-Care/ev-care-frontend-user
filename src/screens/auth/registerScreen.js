import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Linking,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import React, { useState, useEffect } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useDispatch, useSelector } from "react-redux";
import { postSignUp } from "./services/crudFunction";
import { selectAuthError, selectToken, selectUser } from "./services/selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import { Picker } from '@react-native-picker/picker';
import { Entypo } from '@expo/vector-icons';
// import DropDownPicker from 'react-native-dropdown-picker';





const vehicleData = {
  "Tata": ["Ace", "Intra", "Yodha"],
  "Mahindra": ["Bolero", "Jeeto", "Supro"],
  "Ashok Leyland": ["Dost", "Partner", "Boss"],
  "Maruti Suzuki": ["Super Carry", "Eeco Cargo", "Omni Cargo"],
  "Piaggio": ["Ape Xtra", "Porter", "Ape Auto"],
  "Force Motors": ["Kargo King", "Shaktiman", "Traveller Pickup"],
  "Isuzu": ["D-Max", "S-CAB", "Hi-Lander"],
  "Eicher": ["Pro 2049", "Pro 3015", "Pro 2059"],
  "Toyota": ["Hilux", "Innova Crysta Commercial", "LC79 Pickup"],
  "Others": [] , 
  

};

const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false); // Loader state
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Get user data from Redux store
  const token = useSelector(selectToken); // Get user data from Redux store
  const error = useSelector(selectAuthError); // Get error from Redux store
  const userKey = route?.params?.userKey;
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const models = selectedCompany && vehicleData[selectedCompany] ? vehicleData[selectedCompany] : [];
  // console.log("user key in register : ", userKey);

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    setLoading(true);

    const userData = {
      email: email,
      owner_legal_name: fullName,
      role: role,
      user_key: userKey, // Use user_key from Redux state
    };

    console.log("Post signup called");
    try {
      const response = await dispatch(postSignUp(userData));
    } catch (error) {
      console.log("Error during registration");
      dispatch(
        showSnackbar({ message: error || "Registration Failed", type: "error" })
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect to handle user and token updates
  useEffect(() => {
    if (user && user?.status !== "New" && token) {
      console.log("User and token updated in useEffect:", user, token);

      try {
        // Save user data and token to AsyncStorage
        AsyncStorage.setItem("user", user.user_key);
        AsyncStorage.setItem("accessToken", token);

        console.log(
          "Access token stored in AsyncStorage:",
          AsyncStorage.getItem("token")
        );

        dispatch(
          showSnackbar({
            message: error || "Registration Successfull",
            type: "success",
          })
        );

        navigation.navigate("userHome"); // Navigate to the home screen
      } catch (error) {
        console.error("Error saving user data:", error);
        dispatch(
          showSnackbar({ message: "Error in saving user data", type: "error" })
        );
      }
    } else if (error) {
      console.error("Error during registration:", error);
      dispatch(
        showSnackbar({ message: error || "Registration Failed", type: "error" })
      );
    }
  }, [user, token, error, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 ,}}>
        {topImage()}
        <ScrollView
          style={{paddingHorizontal:20}}
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >
          {selectRole()}
          {fullNameInfo()}
          {emailInfo()}
          {vehicleNumberInfo()}
          {vehicleDataForm()}
          {continueButton()}
          {agreeInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function selectRole() {
    return (
      <View style={{marginTop:30}}>
       <Text style={styles.sectionLabel}>
       Select Role <Text style={styles.label}>*</Text>
      </Text>
      <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={selectedModel}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.pickerStyle}
      >
        <Picker.Item style={{fontSize:12}}label="Select Role" value="" />
        <Picker.Item style={{fontSize:12}} label="User" value="user" />
        <Picker.Item style={{fontSize:12}} label="Vendor" value="vendor" />
      </Picker>
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
          onPress={() =>
            Linking.openURL("http://89.116.34.17:3000/terms-and-conditions")
          }
        >
          <Text
            style={{
              textAlign: "center",
              ...Fonts.grayColor18SemiBold,
              color:"blue",
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
    return (<>
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
          style={{ ...Fonts.blackColor16Medium }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
      </View>
      </>
    );
  }

  function fullNameInfo() {
    return (<>
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
          style={{ ...Fonts.blackColor16Medium, paddingVertical: 12,
            fontSize: 12,}}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
      </View>
      </>
    );
  }
  function vehicleNumberInfo() {
    return (<>
      <Text style={styles.sectionLabel}>
      Vehicle Registration Number <Text style={styles.label}>*</Text>
      {/* <Text style={styles.optional}>(Optional)</Text> */}
    </Text>
      <View style={{ ...styles.textFieldWrapper }}>
        
        <TextInput
          placeholder="Enter Your Vehicle Registration Number"
          placeholderTextColor={Colors.grayColor}
          value={vehicleNumber}
          onChangeText={(text) => setVehicleNumber(text)}
          style={{ ...Fonts.blackColor16Medium, paddingVertical: 12,
            fontSize: 12,}}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
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

  function vehicleDataForm(){
    return(
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
          <Picker.Item style={{fontSize:12}}  label="Select Company" value="" />
          {Object.keys(vehicleData).map((make) => (
            <Picker.Item style={{fontSize:12}} key={make} label={make} value={make} />
          ))}
        </Picker>
       </View>

      {/* Custom company if 'Other' */}
      {selectedCompany === "Others" && (
        <>
         
      <Text style={styles.sectionLabel}>
       Enter Manufacturer Name <Text style={styles.label}>*</Text>
      </Text>
  
        <View
        style={{
          ...styles.textFieldWrapper,
          marginBottom: Sizes.fixPadding * 2.0,
        
        }}
      >
        <TextInput
          placeholder="Enter Company Name here "
          placeholderTextColor={Colors.grayColor}
          value={customCompany}
          onChangeText={setCustomCompany}
          style={{ ...Fonts.blackColor16Medium }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
         
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
         style={{ ...Fonts.blackColor16Medium }}
         cursorColor={Colors.primaryColor}
         selectionColor={Colors.primaryColor}
        
       />
     </View>
     </>
      )}

      {/* Model Picker if applicable */}
      {models.length > 0 ? (<>
          <Text style={styles.sectionLabel}>
          Select Vehicle Model <Text style={styles.label}>*</Text>
         </Text>
          <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedModel}
            onValueChange={(itemValue) => setSelectedModel(itemValue)}
            style={styles.pickerStyle}
          >
            <Picker.Item style={{fontSize:12}}label="Select Model" value="" />
            {models.map((model) => (
              <Picker.Item style={{fontSize:12}} key={model} label={model} value={model} />
            ))}
            <Picker.Item style={{fontSize:12}} label="Other" value="Other" />
          </Picker>
           </View></>
      ) : selectedCompany !== "" ? null : null}

      {/* Custom model if no models found or "Other" selected */}
      {(selectedCompany === "Other" || selectedModel === "Other") && (
        <>
     <Text style={styles.sectionLabel}>
       Enter Manufacturer Name <Text style={styles.label}>*</Text>
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
          style={{ ...Fonts.blackColor16Medium }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
         
        />
      </View>
      </>
      )}
    </View>
    )
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
    paddingVertical:5,
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
  container: { marginBottom:10},
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
