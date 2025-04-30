//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPendingStationAPI, getAllUsersAPI } from "./api";
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

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getAllUsersAPI({
        accessToken,
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response.data.message || "User's detail not found"
        );
      }
    } catch (error) {
      console.log("Error in getAllUsers:", error);

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
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await approveStationAPI({
        ...data,
        accessToken,
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.data?.message || "Failed to approve station"
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
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await approveVendorProfileAPI({
        ...data,
        accessToken,
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.data?.message || "Failed to approve vendor profile."
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


/*
//Get vendor details by key
export const getUserDetailsByKey = createAsyncThunk(
  "auth/getUserDetailsByKey",
  async (user_key, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getUserByKeyAPI({ user_key, accessToken });

      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch user details"
        );
      }
    } catch (error) {
      console.log("Error in getUserDetailsByKey:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Failed to fetch user details"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const patchUpdateUserProfile = createAsyncThunk(
  "userSlice/profileUpdate",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      // console.log("data:",  {...data, accessToken}); // Log the access token for debugging
      const response = await updateUserProfileAPI({ ...data, accessToken }); // Call the API to fetch stations by location
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to update user details"
        );
      }
    } catch (error) {
      console.log("Error in patchUpdateUserProfile:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Failed to update user details"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const sendQueryAction = createAsyncThunk(
  "support/send-query",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      const response = await sendQuery({ ...data, accessToken }); // Call the API to fetch stations by location
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Send query failed!!");
      }
    } catch (error) {
      console.log("Error in sendQueryAction:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "could not send query to admin"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

*/
