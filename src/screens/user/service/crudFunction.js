//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStationsByLocationAPI, updateUserProfileAPI , getUserByKeyAPI} from "./api"; // Import the API function
// Async thunk to fetch stations
export const fetchStationsByLocation = createAsyncThunk(
  "stations/fetchStations",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      // console.log("data:",  {...data}); // Log the access token for debugging
      const response = await getAllStationsByLocationAPI({...data, accessToken}); // Call the API to fetch stations by location
     console.log("response:", response.data); // Log the response for debugging
      return response.data; // Assuming the API returns a list of stations
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


//Get vendor details by key
export const getUserDetailsByKey = createAsyncThunk(
  'auth/getUserDetailsByKey',
  async (user_key, { rejectWithValue }) => {
    try {
      console.log("inside thunk", );
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
      const response = await getUserByKeyAPI({ user_key, accessToken });
       await AsyncStorage.setItem('user', JSON.stringify(response.data.data)); // Store the user data in AsyncStorage.
      return response.data; // Assuming the API returns the vendor details
    } catch (error) {

      return rejectWithValue(error.response?.data || 'Failed to fetch vendor details');
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