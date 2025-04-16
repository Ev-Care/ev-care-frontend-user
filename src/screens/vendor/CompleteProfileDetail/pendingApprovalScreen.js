import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { logoutUser } from "../../../redux/store/userSlice";
import { selectUser } from "../../auth/services/selector";
import {  useDispatch, useSelector } from "react-redux";
import { color } from "@rneui/base";
import {Colors} from "../../../constants/styles";
import { getUserDetailsByKey } from "../../user/service/crudFunction";

const PendingApprovalScreen = (route) => {  
  const navigation = useNavigation();  
  const dispatch = useDispatch();
  // const { setApproved } = route.params;
  const user = useSelector(selectUser); // Get user data

  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/images/completed.png")} style={styles.image} />
      <Text style={styles.title}>Document Submitted </Text>
      <Text style={styles.subtitle}>Kindly wait for approval from the admin.{"\n"}This usually takes 2-3 business days.</Text>
     
{/* 
      <TouchableOpacity style={styles.button} onPress={() => setApproved(true)}>
      <Text style={styles.buttonText}>continue</Text>
      </TouchableOpacity> */}
    <TouchableOpacity 
    style={[styles.button, { backgroundColor: Colors.primaryColor }]} 
    onPress={() => dispatch(getUserDetailsByKey(user.user_key))}
>
     <Text style={styles.buttonText}>continue</Text>
    </TouchableOpacity>

      <TouchableOpacity  onPress={() => dispatch(logoutUser())}>
        <Text style={styles.goBackText}>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity  >
        <Text style={styles.goBackText}>{user.user_key}</Text>
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
  goBackText: { fontSize: 14, color: "#F4721E", textAlign: "center" ,marginTop: 80},
});
