import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,

} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../../../components/myStatusBar";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../../constants/styles";
import VendorBottomTabBar from "../../../../components/vendorComponents/vendorBottomTabBar";
import { useNavigation } from "@react-navigation/native";
const COLORS = {
  primary: "#101942",
  secondary: "#FF8C00",
  gray: "#F5F5F7",
  darkGray: "#9E9E9E",
  white: "#FFFFFF",
  black: "#000000",
  green: "#00FF00",
};

const stations = [
  {
    id: 1,
    name: "Tesla EV Station",
    chargers: 5,
    address: "MG Road, Pune, Maharashtra, India",
    image:
      "https://plus.unsplash.com/premium_photo-1717007464480-2ab8d1b96f4b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGV2fGVufDB8fDB8fHww",
    rating: 4.7,
  },
  {
    id: 2,
    name: "indira EV Hub",
    chargers: 3,
    address: "Fergusson College Road, Pune, Maharashtra, India",
    image:
      "https://images.unsplash.com/photo-1647418551307-a9bb946afe2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGV2fGVufDB8fDB8fHww",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Bandra hills EV Point",
    chargers: 4,
    address: "Bandra Kurla Complex, Mumbai, Maharashtra, India",
    image:
      "https://plus.unsplash.com/premium_photo-1715639312136-56a01f236440?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXZ8ZW58MHx8MHx8fDA%3D",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Mumbai Central EV Station",
    chargers: 6,
    address: "Mumbai Central, Mumbai, Maharashtra, India",
    image:
      "https://media.istockphoto.com/id/1662932717/photo/electric-car-charging.webp?a=1&b=1&s=612x612&w=0&k=20&c=9FIRR8R78lBruFtHTTBkLRzSnvMdms6nnsnQ6gab3cU=",
    rating: 4.3,
  },
];

const trimText = (text, limit) =>
  text.length > limit ? text.substring(0, limit) + "..." : text;

const AllStations = () => {
    const navigation = useNavigation();
  const [availability, setAvailability] = useState(
    stations.reduce((acc, station) => ({ ...acc, [station.id]: true }), {})
  );

  const toggleAvailability = (id) => {
    setAvailability((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <MyStatusBar/>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>All Charging Stations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {stations.map((station) => (
          <TouchableOpacity onPress={() => navigation.navigate("StationManagement")} key={station.id} style={styles.card}>
            <Image source={{ uri: station.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.stationName}>
                  {trimText(station.name, 18)}
                </Text>
                <Switch
                  trackColor={{ false: COLORS.secondary, true: COLORS.green }}
                  thumbColor={COLORS.white}
                  value={availability[station.id]}
                  onValueChange={() => toggleAvailability(station.id)}
                />
              </View>
              <Text style={styles.statusText}>
                Status:{" "}
                <Text
                  style={{
                    color: availability[station.id]
                      ? COLORS.green
                      : COLORS.secondary,           
                  }}
                >
                  {availability[station.id] ? "Live" : "Offline"}
                </Text>
              </Text>
             
              <Text style={styles.text}>Chargers: {station.chargers}</Text>
              <Text style={styles.addressText}>{station.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* <VendorBottomTabBar/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  scrollContainer: {
    padding: 10,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bodyBackColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0eb",
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center", 
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.primary, 
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: COLORS.primary,
  },
  addressText: {
    fontSize: 10,
    color: COLORS.darkGray,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default AllStations;
