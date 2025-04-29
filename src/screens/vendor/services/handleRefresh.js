import { Alert } from "react-native";
import { fetchStations } from "./crudFunction";
import { showSnackbar } from "../../../redux/snackbar/snackbarSlice";
import { useSelector } from "react-redux";
import { selectVendorError } from "./selector";

export const handleRefreshStations = async (dispatch, userId, setRefreshing, errorMessage) => {

  try {
    console.log("Refreshing stations...");
    if (setRefreshing) setRefreshing(true);
    const response = await dispatch(fetchStations(userId));
    if (fetchStations.fulfilled.match(response)) {
      await dispatch(showSnackbar({ message: "Station fetched Successfully." , type : 'success'}));

    } else if (fetchStations.rejected.match(response)) {
      await dispatch(showSnackbar({ message: errorMessage || "Failed to fetch station.",  type : 'error' }));

    }
  } catch (error) {
    console.error("Error refreshing stations:", error);
    await dispatch(showSnackbar({ message: errorMessage || "Failed to fetch station.",  type : 'error' }));

  } finally {
    if (setRefreshing) setRefreshing(false);
  }
};