import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { default as Icon, default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import MyStatusBar from "../../../../components/myStatusBar";
import {
  Colors,
  commonStyles
} from "../../../../constants/styles";
import { selectUser } from "../../../auth/services/selector";
import { selectStation } from "../../services/selector";
import { updateStationsChargersConnectorsStatus } from "../../services/crudFunction";
import { toggleStationStatus } from "../../services/vendorSlice";

const COLORS = {
  primary: "#101942",
  secondary: "#FF8C00",
  gray: "#F5F5F7",
  darkGray: "#9E9E9E",
  white: "#FFFFFF",
  black: "#000000",
  green: "#00FF00",
};


const trimText = (text, limit) =>
  text.length > limit ? text.substring(0, limit) + "..." : text;

const AllStations = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();


  const stations = useSelector(selectStation);

  console.log("Stations in AllStations:", stations.length);

  // Initialize availability state after stations are loaded
  const [availability, setAvailability] = useState({});

  React.useEffect(() => {
    if (stations) {
      setAvailability(
        stations.reduce((acc, station) => ({ ...acc, [station.id]: true }), {})
      );
    }
  }, [stations]);

  const toggleStationAvailability = (id) => {
    // dispatch(toggleStationStatus({ id }));
    console.log("Toggling station availability for station ID:", id);
    availability[station.id] = !availability[station.id];
    console.log("Updated availability state:", availability[station.id]);
  };
    /*console.log("Toggling station availability for ID:", id);
    setAvailability((prev) => {
      const updatedAvailability = { ...prev };

      const updatedStations = stations.map((station) => {
        if (station.id === id) {
          const updatedStatus = station.status === "Active" ? "Inactive" : "Active";

          // Update chargers and connectors based on station status
          const updatedChargers = station.chargers.map((charger) => ({
            ...charger,
            status: charger.status !== "Inactive" ? "Inactive" : charger.status, // Set charger status to match station status
            connectors: charger.connectors.map((connector) => ({
              ...connector,
              connector_status: connector.connector_status !== "out-of-service" ? "out-of-service" : connector.connector_status, // Update connector status
            })),
          }));

          // Return the updated station
          return {
            ...station,
            status: updatedStatus,
            chargers: updatedChargers,
          };
        }
        return station;
      });

      // console.log("Updated Stations:", updatedStations);

      // Update availability state
      updatedAvailability[id] = !prev[id];
      return updatedAvailability;
    }); */
  

  const updateStationStatus = async (stationData) => {
    try {
      const response = await dispatch(updateStationsChargersConnectorsStatus(stationData));
      console.log("Response after update station status:", response.payload);
      if (response.payload) {
        Alert.alert("Success", "Station status updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update station status.");
      }
    } catch (error) {
      console.error("Error updating station status:", error);
      Alert.alert("Error", "Failed to update station status.");
    }
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>All Charging Stations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Check if stations is defined and not empty */}
        {stations && stations.length > 0 ? (
          stations.map((station) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("StationManagement", { station })}
              key={station.id}
              style={styles.card}
            >
              {station.image ? (
                <Image source={{ uri: station.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, { alignItems: "center", justifyContent: "center", backgroundColor: "gray", opacity: 0.1 }]}>
                  <MaterialIcons
                    name="ev-station"
                    size={50}  // or match your image size
                    color="#a3a3c2"
                  />
                </View>
              )}

              <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.stationName}>
                    {trimText(station.station_name, 18)}
                  </Text>
                  <Switch
                    trackColor={{ false: COLORS.secondary, true: COLORS.green }}
                    thumbColor={COLORS.white}
                    value={station.status !== "Inactive"}
                    onValueChange={async () => {

                      console.log("Station Status Before toggle:", availability[station.id]);

                    //  await toggleStationAvailability(station.id);

                      // Retrieve the updated station data
                      // const updatedStation = stations.find((s) => s.id === station.id);
                      // console.log("Station Status after toggle:", availability[station.id]);
                      
                      var stationData = {
                  
                        station_id: station.id,
                        statusType: "station",
                        status: station.status === "Active" || station.status === "Planned" ? "Inactive" : "active",

                      }
                      console.log("Station Status before toggle:", station.status);
                      console.log("Station Data to be updated:", stationData);

                     await updateStationStatus(stationData);

                      console.log("Station Status after toggle:", station.status);


                    }
                    }
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

                <Text style={styles.text}>
                  Chargers: {station.chargers.length}
                </Text>
                <Text style={styles.addressText}>{trimText(station.address, 100)}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          // Fallback UI when stations is undefined or empty
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No stations available.
          </Text>
        )}
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
