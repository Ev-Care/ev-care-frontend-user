//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  approveStationAPI,
  approveVendorProfileAPI,
  getAllPendingStationAPI,
  getAllPendingUsersAPI,
} from "./api";
// Async thunk to fetch stations
export const fetchAllPendingStation = createAsyncThunk(
  "admin/fetchAllPendingStation",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching all pending stations...");

      const accessToken = await AsyncStorage.getItem("accessToken");

      if (!accessToken) {
        return rejectWithValue("Access token not found.");
      }

      const response = await getAllPendingStationAPI({ accessToken });

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.data?.message || "Failed to fetch pending stations."
        );
      }
    } catch (error) {
      console.log("Error in fetchAllPendingStation:", error);

      const errorMessage =
        error?.response?.data?.message || error?.message || "Server error";

      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllPendingUsers = createAsyncThunk(
  "admin/getAllPendingUsers",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getAllPendingUsersAPI({
        accessToken,
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "User's detail not found"
        );
      }
    } catch (error) {
      console.log("Error in getAllPendingUsers:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const approveStation = createAsyncThunk(
  "admin/approveStation",
  async (station_id, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await approveStationAPI({
        station_id,
        accessToken,
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "Failed to approve station"
        );
      }
    } catch (error) {
      console.log("Error in approveStation:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);


export const approveVendorProfile = createAsyncThunk(
  "admin/approveVendorProfile",
  async (data, { rejectWithValue }) => {
    console.log("admin/approveVendorProfile");
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await approveVendorProfileAPI({
        user_key: data.user_key,
        accessToken,
        status: data.status,
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "Failed to approve vendor profile."
        );
      }
    } catch (error) {
      console.log("Error in approveStation:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);


export const createUser = createAsyncThunk(
  "admin/createUser",
  async (data, { rejectWithValue }) => {
    
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await createUserAPI({
        data,
        accessToken
      }); // Call the API to create user station

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "Failed to create new user."
        );
      }
    } catch (error) {
      console.log("Error in createUser:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
