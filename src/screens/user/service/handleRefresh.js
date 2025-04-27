import { Alert } from "react-native";
import { fetchStationsByLocation } from "./crudFunction";

export const handleRefreshStationsByLocation = async (dispatch, data, setRefreshing, errorMessage) => {
  try {
    console.log("Refreshing stations...");
    if (setRefreshing) setRefreshing(true);
    const stationsResponse = await dispatch(fetchStationsByLocation(data));
    if (fetchStationsByLocation.fulfilled.match(stationsResponse)) {
      dispatch(showSnackbar({ message: 'Stations refreshed successfully.', type: "success" }))
    } else if (fetchStationsByLocation.rejected.match(stationsResponse)) {
      dispatch(showSnackbar({ message: errorMessage, type: "error" }))

    }
    console.log("Stations refreshed successfully.", response.payload);
  } catch (error) {
    console.error("Error refreshing stations:", error);
   
  } finally {
    if (setRefreshing) setRefreshing(false);
  }
};