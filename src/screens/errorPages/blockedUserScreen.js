import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../auth/services/selector";
import { logoutUser } from "../../redux/store/userSlice";
const BlockedUserScreen = ({ navigation }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/sadCar.png")}
        style={styles.image}
      />
       
      {user?(
        <>
        <Text style={styles.title}>
        Oops! Your account is currently {user?.status}
      </Text>
       <Text style={styles.subtitle}>
        Your access has been restricted. Please contact the administrator for
        further assistance or to resolve any issues.
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Help")}
      >
        <Text style={styles.buttonText}>Contact Support</Text>
      </TouchableOpacity>
       

      <TouchableOpacity onPress={() => dispatch(logoutUser())}>
        <Text style={styles.goBackText}>Log out</Text>
      </TouchableOpacity>
      </>
    ):(<>
        <Text style={styles.title}>Unexpected Error Occured</Text>
        <Text style={styles.subtitle}>
        Please contact the administrator for
        further assistance or to resolve any issues Or Check Your internet Connection
      </Text>
      
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Help")}
      >
        <Text style={styles.buttonText}>Contact Support</Text>
      </TouchableOpacity> */}
        </>
      )}

    
    </View>
  );
};

export default BlockedUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: { width: 180, height: 180, resizeMode: "contain", marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "grey",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#F4721E",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: { fontSize: 14, color: "white", fontWeight: "bold" },
  goBackText: { fontSize: 14, color: "#F4721E", textAlign: "center" },
});
