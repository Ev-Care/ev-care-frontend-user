import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStationsAPI, getStationByIdAPI, postStationAPI, updateStationsChargersConnectorsStatusAPI } from "./api";

//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "../../auth/services/selector";

const accessToken = AsyncStorage.getItem("accessToken");
// Async Thunks

// Fetch all stations for a vendor
export const fetchStations = createAsyncThunk(
    'vendorStations/fetchStations',
    async (vendorId, { rejectWithValue }) => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken"); 
        // const accessToken = await useSelector(selectToken);
        const response = await getAllStationsAPI({ owner_id: vendorId, accessToken });
        
        return response.data; // Assuming the API returns an array of stations
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch stations');
      }
    }
  );
  
  // Add a new station
  export const addStation = createAsyncThunk(
    'vendorStations/addStation',
    async (stationData, { rejectWithValue }) => {
        console.log("stationData in thunk", stationData);
      try {
        const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
        const response = await postStationAPI({stationData, accessToken});
        if(response.status !== 200 && response.status !== 201) {
            throw new Error("Failed to add station");
        }
        return response.data; // Assuming the API returns the created station
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to add station');
      }
    }
  );
  
  // Update an existing station
  export const updateStationsChargersConnectorsStatus = createAsyncThunk(
    'vendorStations/updateStationsChargersConnectorsStatus',
    async (data, { rejectWithValue }) => {
      try {
        console.log("api called in crud vendor");
        const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
        console.log("data in thunk", data);
        const UpdateStatusResponse = await updateStationsChargersConnectorsStatusAPI({ ...data, accessToken });
        console.log("UpdateStatusResponse", UpdateStatusResponse.data);
        const getStationresponse = await getStationByIdAPI({ station_id: data.station_id, accessToken });
        console.log("getStationresponse", getStationresponse.data);
        return getStationresponse.data; // Assuming the API returns the updated station
      } catch (error) {
        console.log("Catch block api calling failed in crud vendor", error);
        return rejectWithValue(error.response?.data || 'Failed to update station');
      }
    }
  );
  
  // Delete a station
  export const deleteStation = createAsyncThunk(
    'vendorStations/deleteStation',
    async (stationId, { rejectWithValue }) => {
      try {
        await axios.delete(`${API_URL}/stations/${stationId}`);
        return stationId; // Return the deleted station ID
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete station');
      }
    }
  );