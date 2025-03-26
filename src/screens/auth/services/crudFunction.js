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
        const response = await signInAPI(data);
        if (response.status === 200 || response.status === 201) {
          return await response.json();
        } else {
          throw new Error("Error: OTP not sent, try again");
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const postVerifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (data, { rejectWithValue }) => {
      try {
        const response = await verifyOtpAPI(data);
        if (response.status === 200 || response.status === 201) {
          return await response.json();
        } else {
          throw new Error("OTP verification failed");
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const postSignUp = createAsyncThunk(
    "auth/signUp",
    async (data, { rejectWithValue }) => {
      try {
        const response = await signupAPI(data);
        if (response.status === 200 || response.status === 201) {
          return await response.json();
        } else {
          throw new Error("Signup failed");
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
