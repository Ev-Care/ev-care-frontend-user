import { Alert } from "react-native";
import { fetchStations } from "./crudFunction";

export const handleRefreshStations = async (dispatch, userId, setRefreshing) => {
  try {
    console.log("Refreshing stations...");
    if (setRefreshing) setRefreshing(true);
    const response = await dispatch(fetchStations(userId));
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