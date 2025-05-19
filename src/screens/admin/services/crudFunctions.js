//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addStationByAdminAPI,
  approveStationAPI,
  approveVendorProfileAPI,
  createUserAPI,
  getAllPendingStationAPI,
  getAllPendingUsersAPI,
  getAllStationsAPI,
  getAllStationsByUserIdAPI,
  getAllSupportIssuesAPI,
  getAllUsersAPI,
  getEntityCountAPI,
  rejectStationAPI,
  updateUserProfileAPI,
} from "./api";
import { deleteStationAPI, } from "../../vendor/services/api";
// Async thunk to fetch stations
export const fetchAllPendingStation = createAsyncThunk(
  "admin/fetchAllPendingStation",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("Fetching all pending stations...");

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
      // console.log("Error in fetchAllPendingStation:", error);

      const errorMessage =
        error?.response?.data?.message || error?.message || "Server error";

      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchAllStations = createAsyncThunk(
  "admin/fetchAllStations",
  async (_, { rejectWithValue }) => {
    try {
  

      const accessToken = await AsyncStorage.getItem("accessToken");

      if (!accessToken) {
        return rejectWithValue("Access token not found.");
      }

      const response = await getAllStationsAPI({ accessToken });

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "Failed to fetch pending stations."
        );
      }
    } catch (error) {
      // console.log("Error in fetchAllStations:", error);

      const errorMessage =
        error?.response?.data?.message || error?.message || "Server error";

      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllVendors = createAsyncThunk(
  "admin/getAllVendors",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getAllUsersAPI({status: "", userType: "vendor", accessToken}); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "User's detail not found"
        );
      }
    } catch (error) {
      // console.log("Error in getAllvendors:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

//Get all Users
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getAllUsersAPI({
        accessToken, status: '', userType: '',
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "User's detail not found"
        );
      }
    } catch (error) {
      // console.log("Error in getAllPendingUsers:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch all stations for a vendor
export const fetchStationsByUserId = createAsyncThunk(
  'admin/fetchStationsByUserId',
  async (vendorId, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      // const accessToken = await useSelector(selectToken);
      // console.log("vendorId", vendorId);
      const response = await getAllStationsByUserIdAPI({ owner_id: vendorId, accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch Stations");
      }
    } catch (error) {
      // console.log("Error in fetchStations:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

//Get all Support issues
export const getAllSupportIssues = createAsyncThunk(
  "admin/getAllSupportIssues",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getAllSupportIssuesAPI({
        accessToken,
      }); // Call the API to fetch stations by location
      // console.log('response = ', response);
      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "Issues detail not found"
        );
      }
    } catch (error) {
      // console.log("Error in getAllSupportIssues:", error);

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
      // console.log("Error in approveStation:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
export const rejectStation = createAsyncThunk(
  "admin/rejectStation",
  async (station_id, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await rejectStationAPI({
        station_id,
        accessToken,
      }); // Call the API to fetch stations by location

      if (response?.data?.code === 200 || response?.data?.code === 201) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.message || response?.data?.message || "Failed to reject station"
        );
      }
    } catch (error) {
      // console.log("Error in reject station:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "admin/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("data in updateUserProfile", data);
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
      // console.log("Error in updateUserProfile:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Failed to update user details"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
export const approveVendorProfile = createAsyncThunk(
  "admin/approveVendorProfile",
  async (data, { rejectWithValue }) => {
    // console.log("admin/approveVendorProfile");
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
      // console.log("Error in approveStation:", error);

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
      // console.log("Error in createUser:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
export const addStationByAdmin = createAsyncThunk(
  "admin/addStationByAdmin",
  async (data, { rejectWithValue }) => {
    
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await addStationByAdminAPI({
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
      // console.log("Error in addStationByAdmin:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Server error"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);


// Delete a station By admin
export const deleteStationByAdmin = createAsyncThunk(
  'admin/deleteStationByAdmin',
  async (stationId, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
      const response = await deleteStationAPI({ station_id: stationId, accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.message || response?.data?.message || "Failed to delete Stations");
      }
    } catch (error) {
      // console.log("Error in deleteStationByAdmin:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
// Get Count of entity
export const getEntityCount = createAsyncThunk(
  'admin/getEntityCount',
  async ( _ ,{ rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve accessToken inside the thunk
      const response = await getEntityCountAPI({ accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.message || response?.data?.message || "Failed to delete Stations");
      }
    } catch (error) {
      // console.log("Error in deleteStationByAdmin:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "Something went wrong. Please try again";          // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);