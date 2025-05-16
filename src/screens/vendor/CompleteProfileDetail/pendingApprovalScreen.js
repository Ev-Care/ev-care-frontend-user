import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../../constants/styles";
import { logoutUser } from "../../../redux/store/userSlice";
import { selectUser } from "../../auth/services/selector";
import { getUserDetailsByKey } from "../../user/service/crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";

const PendingApprovalScreen = ({route,navigation}) => {


  const dispatch = useDispatch();
  // const { setApproved } = route.params;
  const user = useSelector(selectUser); // Get user data
  const handleContinue = async () => {
    const response = await dispatch(getUserDetailsByKey(user.user_key));
    const updatedUser = response?.payload.data;
    console.log('updated user in pending', updatedUser);
    if (response?.payload?.code === 200 || response?.payload?.code === 201) {
      if (updatedUser.status !== "Active") {
        await dispatch(showSnackbar({ message: 'Please wait for admin approval', type: 'error' }));

        // Alert.alert("Pending","Please wait for admin approval before proceeding. You can contact admin with the below displayed number");
      } else {
        await dispatch(showSnackbar({ message: 'Congrats!, Your account is approved.', type: 'success' }));

        // Alert.alert("Success","Your account is active. Proceeding!");
      }
    }
  }

  return (
  <View style={styles.container}>
  <Image
    source={require("../../../../assets/images/completed.png")}
    style={styles.image}
  />
  
  <Text style={styles.title}>Documents Submitted</Text>
  
  <Text style={styles.subtitle}>
    Please wait for approval from the admin.{"\n"}
    This process usually takes 2–3 business days.
  </Text>
  
  <Text style={[styles.subtitle, { color: "black", fontWeight: "700" }]}>
    Need help or support?{" "}
    <Text
      onPress={() => navigation.navigate("HelpScreen")}
      style={[styles.subtitle, { color: "blue" }]}
    >
      Click here
    </Text>
  </Text>

  <TouchableOpacity
    style={[styles.button, { backgroundColor: Colors.primaryColor }]}
    onPress={handleContinue}
  >
    <Text style={styles.buttonText}>Check Status</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => dispatch(logoutUser())}>
    <Text style={styles.goBackText}>Log Out</Text>
  </TouchableOpacity>
</View>

  );
};

export default PendingApprovalScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: 150, height: 150, resizeMode: "contain", marginBottom: 40 },
  title: { fontSize: 28, fontWeight: "bold", color: "black", textAlign: "center" },
  subtitle: { fontSize: 12, color: "grey", textAlign: "center", marginVertical: 10 },
  button: { width: "100%", backgroundColor: "#F4721E", paddingVertical: 10, borderRadius: 8, alignItems: "center", marginVertical: 30 },
  buttonText: { fontSize: 14, color: "white", fontWeight: "bold" },
  goBackText: { fontSize: 14, color: "#F4721E", textAlign: "center", marginTop: 30 },
});
