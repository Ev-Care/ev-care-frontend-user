import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteStationAPI, getAllStationsAPI, getStationByIdAPI, postStationAPI, updateAllStationStatusAPI, updateStationAPI, updateStationsChargersConnectorsStatusAPI } from "./api";

//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fetch all stations for a vendor
export const fetchStations = createAsyncThunk(
  'vendorStations/fetchStations',
  async (vendorId, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      // const accessToken = await useSelector(selectToken);
      console.log("vendorId", vendorId);
      const response = await getAllStationsAPI({ owner_id: vendorId, accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch Stations");
      }
    } catch (error) {
      console.log("Error in fetchStations:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

// Add a new station
export const addStation = createAsyncThunk(
  'vendorStations/addStation',
  async (stationData, { rejectWithValue }) => {
    // console.log("stationData in thunk", stationData);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
      const response = await postStationAPI({ stationData, accessToken });
      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        console.log('error message:',response?.data?.message );
        return rejectWithValue(response?.data?.message || "Failed to add station");
      }
    } catch (error) {
      console.log("Error in addStation:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

// Update an existing station
export const updateStationsChargersConnectorsStatus = createAsyncThunk(
  'vendorStations/updateStationsChargersConnectorsStatus',
  async (data, { rejectWithValue }) => {
    try {

      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk

      const UpdateStatusResponse = await updateStationsChargersConnectorsStatusAPI({ ...data, accessToken });
      console.log("UpdateStatusResponse", UpdateStatusResponse?.data);
      const getStationresponse = await getStationByIdAPI({ station_id: data.station_id, accessToken });
      console.log("getStationresponse", JSON.stringify(getStationresponse?.data, null, 2));
      if (getStationresponse?.data?.code === 200 || getStationresponse?.data?.code === 201) {
        return getStationresponse.data;
      } else {
        return rejectWithValue(getStationresponse.data.message || "Failed to fetch Stations");
      }
    } catch (error) {
      console.log("Error in fetchStations:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);


// Delete a station
export const deleteStation = createAsyncThunk(
  'vendorStations/deleteStation',
  async (stationId, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
      const response = await deleteStationAPI({ station_id: stationId, accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to delete Stations");
      }
    } catch (error) {
      console.log("Error in deleteStation:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
export const updateAllStationStatus = createAsyncThunk(
  'vendorStations/updateAllStationStatus',
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
      const response = await updateAllStationStatusAPI({ ...data, accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to update stations status");
      }
    } catch (error) {
      console.log("Error in updateAllStationStatus:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateStation = createAsyncThunk(
  'vendorStations/updateStation',
  async (stationDetails, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
      const response = await updateStationAPI({stationDetails, accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch Stations");
      }
    } catch (error) {
      console.log("Error in fetchStations:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

