import { 
    signInSuccess, 
    signInFailed, 
    verifyOtpSuccess, 
    verifyOtpFailed, 
    signUpSuccess, 
    signUpFailed 
} from "./slice"; 

import { signInAPI, verifyOtpAPI, signupAPI, postSingleFileAPI ,updateVendorAPI } from "./api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks
export const postSignIn = createAsyncThunk(
    "auth/signIn",
    async (data, { rejectWithValue }) => {
        try {
            console.log("postSignIn called with:", data);
            const response = await signInAPI(data);

            if (response.status === 200 || response.status === 201) {
                console.log("API Response:", response.data);
                return response.data;
            } else {
                throw new Error(response.data?.message || "OTP not sent, try again");
            }
        } catch (error) {
            console.log("Error in postSignIn:", error);
            return rejectWithValue(error?.response?.data?.message || "Something went wrong");
        }
      
    
    }
);


  
export const postVerifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (data, { rejectWithValue }) => {
      try {
        const response = await verifyOtpAPI(data);
  
        if (response.status === 200 || response.status === 201) {

          return response.data; // Axios automatically parses JSON
        } else {
          throw new Error("OTP verification failed");
        }
      } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "OTP verification failed");
      }
    }
  );
  
export const postSignUp = createAsyncThunk(
    "auth/signUp",
    async (data, { rejectWithValue }) => {
      try {
        const response = await signupAPI(data);
        
        if (response.status === 200 || response.status === 201) {
          return data;
        } else {
          throw new Error("Signup failed");
        }
      } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Signup failed");
      }
    }
  
  );

export const postSingleFile = createAsyncThunk(
    "auth/singleFileUpload",
    async (data, { rejectWithValue }) => {
     
      try {
        // console.log("postSingleFile called with:", data);
        const response = await postSingleFileAPI(data);
        
        if (response.status === 200 || response.status === 201) {
          return response.data;
        } else {
          throw new Error("Signup failed");
        }
      } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Signup failed");
      }
    }
  
  );
  export const patchUpdateVendorProfile = createAsyncThunk(
    "auth/UpdateVendorProfile",
    async (data, { rejectWithValue }) => {
      try {
        const { user_key, ...bodyData } = data; // separate user_key for URL
  
        const response = await updateVendorAPI(user_key, bodyData);
  
        if (response.status === 200 || response.status === 201) {
          return response.data; // or `bodyData` if you want
        } else {
          throw new Error("Detail Submission Request failed");
        }
      } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Request failed");
      }
    }
  );
  
