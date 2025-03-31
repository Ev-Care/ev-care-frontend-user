import { 
    signInSuccess, 
    signInFailed, 
    verifyOtpSuccess, 
    verifyOtpFailed, 
    signUpSuccess, 
    signUpFailed 
} from "./slice"; 

import { signInAPI, verifyOtpAPI, signupAPI } from "./api";
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
          return response.data;
        } else {
          throw new Error("Signup failed");
        }
      } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Signup failed");
      }
    }
  
  );
