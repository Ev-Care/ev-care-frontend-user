import { Alert } from "react-native";
import { fetchStationsByLocation } from "./crudFunction";

export const handleRefreshStationsByLocation = async (dispatch, data, setRefreshing) => {
  try {
    console.log("Refreshing stations...");
    if (setRefreshing) setRefreshing(true);
    const response = await dispatch(fetchStationsByLocation(data));
    if(response.payload.code !== 200) {
      throw new Error("Failed to fetch stations");
    }
    console.log("Stations refreshed successfully.", response.payload);
  } catch (error) {
    console.error("Error refreshing stations:", error);
    Alert.alert(
      "Error",
      "Failed to refresh stations. Please try again later.",
      [{ text: "OK" }]
    );
  } finally {
    if (setRefreshing) setRefreshing(false);
  }
};