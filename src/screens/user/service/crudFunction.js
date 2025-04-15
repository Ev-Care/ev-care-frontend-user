//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStationsByLocationAPI, updateUserProfileAPI } from "./api"; // Import the API function
// Async thunk to fetch stations
export const fetchStationsByLocation = createAsyncThunk(
  "stations/fetchStations",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      // console.log("data:",  {...data, accessToken}); // Log the access token for debugging
      const response = await getAllStationsByLocationAPI({...data, accessToken}); // Call the API to fetch stations by location
      return response.data; // Assuming the API returns a list of stations
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const patchUpdateUserProfile = createAsyncThunk(
  "userSlice/profileUpdate",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      // console.log("data:",  {...data, accessToken}); // Log the access token for debugging
      const response = await updateUserProfileAPI({...data, accessToken}); // Call the API to fetch stations by location
      return response.data; // Assuming the API returns a list of stations
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);