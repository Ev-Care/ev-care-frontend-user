import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserByKeyApi,
  postSingleFileAPI,
  signInAPI,
  signupAPI,
  updateVendorAPI,
  verifyOtpAPI,
} from "./api";

// Async Thunks
export const postSignIn = createAsyncThunk(
  "auth/signIn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await signInAPI(data);

      if (response.status === 200 || response.status === 201) {
        // console.log("API Response:", response.data);
        return response.data;
      } else {
        throw new Error(response.data?.message || "OTP not sent, try again");
      }
    } catch (error) {
      console.log("Error in postSignIn:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const postVerifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await verifyOtpAPI(data);
      // console.log("response in postVerifyOtp", response);

      if (response.data.code === 200 || response.data.code === 201) {
        return response.data; // Success, return data
      } else {
        // Fail case: return error message
        return rejectWithValue(
          response?.message || response?.data?.message || "OTP verification failed"
        );
      }
    } catch (error) {
      console.log("Error in postVerifyOtp:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "OTP verification failed"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const postSignUp = createAsyncThunk(
  "auth/signUp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await signupAPI(data);

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

export const postSingleFile = createAsyncThunk(
  "auth/singleFileUpload",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("postSingleFile called with:", data);
      const response = await postSingleFileAPI(data);

      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data?.message || response?.message || "File Upload failed.");
      }
    } catch (error) {
      console.log("Error in postSingleFile:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Something went wrong. Please try again"; // fallback message
      console.log("error message : ", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const patchUpdateVendorProfile = createAsyncThunk(
  "auth/UpdateVendorProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateVendorAPI(data);
      // console.log("response at crud func page", response);
      if (response?.data?.code === 200 || response?.data?.code === 201) {
        console.log("return response data in thunk", response.data);
        return response?.data;
      } else {
        return rejectWithValue(
          response?.data?.message || response?.message || "Profile Update Failed"
        );
      }
    } catch (error) {
      console.log("Error in patchUpdateVendorProfile:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Something went wrong. Please try again"; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserByKey = createAsyncThunk(
  "auth/getUserByKey",
  async (user_key, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await getUserByKeyApi({ user_key, accessToken });
      if (response.data.code === 200 || response.data.code === 201) {
        return response.data;
      } else {
        return rejectWithValue(
          response?.data?.message || response?.message|| "Failed to get user details."
        );
      }
    } catch (error) {
      console.log("Error in getUserByKey:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message || // API sent error message
        error?.message || // JS error message
        "Failed to get user details."; // fallback message

      return rejectWithValue(errorMessage);
    }
  }
);
