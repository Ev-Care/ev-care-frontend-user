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
  ActivityIndicator,
  View,
} from "react-native";
import {
  default as Icon,
  default as MaterialIcons,
} from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import MyStatusBar from "../../../../components/myStatusBar";
import { Colors, commonStyles } from "../../../../constants/styles";
import { selectAuthError, selectUser } from "../../../auth/services/selector";
import { selectVendorStation } from "../../services/selector";
import {
  fetchStations,
  updateStationsChargersConnectorsStatus,
} from "../../services/crudFunction";
import imageURL from "../../../../constants/baseURL";
import { RefreshControl } from "react-native";
import { handleRefreshStations } from "../../services/handleRefresh";
import { showSnackbar } from "../../../../redux/snackbar/snackbarSlice";
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

const AllStations = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const stations = useSelector(selectVendorStation);
  const [isLoading, setIsLoading] = useState(false);
  const errorMessage = useSelector(selectAuthError);
  // console.log("Stations in AllStations:", stations?.length);
  const [stationStatusMap, setStationStatusMap] = useState({});

  const updateStationStatus = async (stationData) => {
    setIsLoading(true);

    // Optimistically toggle the status
    setStationStatusMap((prev) => ({
      ...prev,
      [stationData.station_id]: stationData.status === "active",
    }));

    try {
      const response = await dispatch(
        updateStationsChargersConnectorsStatus(stationData)
      );

      if (updateStationsChargersConnectorsStatus.fulfilled.match(response)) {
        await dispatch(
          showSnackbar({ message: "Station status updated.", type: "success" })
        );
      } else if (
        updateStationsChargersConnectorsStatus.rejected.match(response)
      ) {
        await dispatch(
          showSnackbar({
            message: errorMessage || "Failed to update station status.",
            type: "error",
          })
        );
      }

      // Fetch updated stations after the status change
      const stationResponse = await dispatch(fetchStations(user?.id));
      if (fetchStations.fulfilled.match(stationResponse)) {
        // Optionally show a success message for fetching stations
        // await dispatch(showSnackbar({ message: "Stations fetched successfully.", type: "success" }));
      } else if (fetchStations.rejected.match(stationResponse)) {
        await dispatch(
          showSnackbar({
            message: errorMessage || "Failed to fetch stations.",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error updating station status:", error);
      await dispatch(
        showSnackbar({
          message: errorMessage || "Failed to update station status.",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    console.log("Refreshing stations...in all stations");
    await handleRefreshStations(dispatch, user?.id, setRefreshing);
  };

  return (
    <View style={styles.container}>
      <MyStatusBar />
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>All Charging Stations</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9Bd35A", "#101942"]} // Android spinner colors
            tintColor="#101942" // iOS spinner color
          />
        }
      >
        {/* Check if stations is defined and not empty */}
        {stations && stations?.length > 0 ? (
          stations.map((station) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("StationManagement", { station })
              }
              key={station.id}
              style={styles.card}
            >
              {station?.station_images ? (
                <Image
                  source={{ uri: imageURL.baseURL + station?.station_images }}
                  style={styles.image}
                />
              ) : (
                <View
                  style={[
                    styles.image,
                    { alignItems: "center", justifyContent: "center" },
                  ]}
                >
                  <MaterialIcons
                    name="ev-station"
                    size={50} // or match your image size
                    color="#8f8f8f"
                  />
                </View>
              )}

              <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.stationName}>
                    {trimText(station?.station_name, 18)}
                  </Text>
                  <Switch
                    trackColor={
                      station?.status === "Planned"
                        ? { false: COLORS.darkGray, true: COLORS.green }
                        : { false: COLORS.secondary, true: COLORS.green }
                    }
                    thumbColor={COLORS.white}
                    value={
                      stationStatusMap[station?.id] ??
                      station?.status === "Active"
                    }
                    disabled={station?.status === "Planned"}
                    onValueChange={async () => {
                      const newStatus =
                        station?.status === "Active" ? "inactive" : "active";
                      const stationData = {
                        station_id: station?.id,
                        statusType: "station",
                        status: newStatus,
                      };
                      await updateStationStatus(stationData); // Update the station status on server
                    }}
                  />
                </View>
                <Text style={styles.statusText}>
                  Status:{" "}
                  <Text
                    style={{
                      color:
                        station?.status !== "Inactive"
                          ? station?.status === "Active"
                            ? COLORS.green
                            : COLORS.darkGray
                          : COLORS.secondary,
                    }}
                  >
                    {station?.status !== "Inactive"
                      ? station?.status === "Active"
                        ? "Live"
                        : "Not Published"
                      : "Offline"}
                  </Text>
                </Text>

                <Text style={styles.text}>
                  Chargers: {station?.chargers?.length || 0}
                </Text>
                <Text style={styles.addressText}>
                  {trimText(station?.address, 100)}
                </Text>
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
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    {addSatationButton()}
    </View>
  );
  function addSatationButton(){
    return(
    
      <TouchableOpacity
        onPress={()=>navigation?.navigate("AddStations")}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: Colors.primaryColor,

          shadowColor: Colors.primaryColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          elevation: 8,
          position: "absolute",
          bottom: 100,
          right: "10%",
        }}
      >
        <MaterialIcons name="add" size={30} color={Colors.whiteColor} />
      </TouchableOpacity>
     
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
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
  scrollContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    // fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.whiteColor,
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
    borderWidth: 1,
    borderColor: '#e2e2e2 ',
    backgroundColor: '#f5f5f5' 
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
    fontSize: 14,
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
