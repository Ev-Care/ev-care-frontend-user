//get Access Token from Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllFavoriteStationsAPI,
  getAllStationsByLocationAPI,
  getEnrouteStationsAPI,
  getUserByKeyAPI,
  postFavoriteStationAPI,
  sendQuery,
  unFavoriteStationAPI,
  updatePasswordAPI,
  updateUserProfileAPI
} from "./api"; // Import the API function
// Async thunk to fetch stations
export const fetchStationsByLocation = createAsyncThunk(
  "stations/fetchStations",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getAllStationsByLocationAPI({
        ...data,
        accessToken,
      }); // Call the API to fetch stations by location

      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "OTP verification failed"
        );
      }
    } catch (error) {
      console.log("Error in postSignUp:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "OTP verification failed"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
export const searchStationsByLocation = createAsyncThunk(
  "stations/searchStationsByLocation",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage

      const response = await getAllStationsByLocationAPI({
        ...data,
        accessToken,
      }); // Call the API to fetch stations by location

      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "OTP verification failed"
        );
      }
    } catch (error) {
      console.log("Error in postSignUp:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "OTP verification failed"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

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
export const postUpdatePassword = createAsyncThunk(
  "userSlice/postUpdatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      // console.log("data:",  {...data, accessToken}); // Log the access token for debugging
      const response = await updatePasswordAPI({ data, accessToken }); // Call the API to fetch stations by location
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

export const getEnrouteStations = createAsyncThunk(
  "stations/getEnrouteStations",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      const response = await getEnrouteStationsAPI({ ...data, accessToken }); // Call the API to fetch stations by location
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to get enroute stations details"
        );
      }
    } catch (error) {
      console.log("Error in getEnrouteStations:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Failed to get enroute stations details"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllFavoriteStations = createAsyncThunk(
  "favorite/getAllFavoriteStations",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      const response = await getAllFavoriteStationsAPI({
        ...data,
        accessToken,
      }); // Call the API to fetch stations by location
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "Fav. Stations not found"
        );
      }
    } catch (error) {
      console.log("Error in getAllFavoriteStations:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Failed to fetch favorite details"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const postFavoriteStation = createAsyncThunk(
  "favorite/postFavoriteStation",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      const response = await postFavoriteStationAPI({ ...data, accessToken }); // Call the API to fetch stations by location
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "Station not added to favorite."
        );
      }
    } catch (error) {
      console.log("Error in postFavoriteStation:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Failed to add favorite stations"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const unFavoriteStation = createAsyncThunk(
  "favorite/unFavoriteStation",
  async (data, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Retrieve access token from AsyncStorage
      const response = await unFavoriteStationAPI({ ...data, accessToken }); // Call the API to fetch stations by location
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "Station not removed from favorites"
        );
      }
    } catch (error) {
      console.log("Error in unFavoriteStation:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Station not removed from favorites"; // fallback message

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
