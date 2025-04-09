import {
  signInSuccess,
  signInFailed,
  verifyOtpSuccess,
  verifyOtpFailed,
  signUpSuccess,
  signUpFailed
} from "./slice";

// import { signInAPI, verifyOtpAPI, signupAPI } from "./api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectUser } from "./selector";
import { useSelector } from "react-redux";
import {verifyOtpAPI, LoginAPI, signupAPI} from "../../../redux/store/userServer";
// Async Thunks
export const postSignIn = createAsyncThunk(
  "auth/signIn",
  async (data, { rejectWithValue }) => {
    try {
      console.log("postSignIn called with:", data);

      const response = await LoginAPI(data.mobileNumber);
      /* const response = await signInAPI(data);

      if (response.status === 200 || response.status === 201) {
          console.log("API Response:", response.data);
          return response.data;
      } else {
          throw new Error(response.data?.message || "OTP not sent, try again");
      } */
      return response;
    } catch (error) {
      console.log("Error in postSignIn:", error);
      // return rejectWithValue(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue("Something went wrong"); // Comment when API is integrated
    }


  }
);



export const postVerifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      

      console.log("postVerifyOtp called with:", data);
      const response =  await verifyOtpAPI(data.mobileNumber, data.otp);

     
      console.log("Mock response:", response.data);
      return response; // Mock response for testing
      /*
      const response = await verifyOtpAPI(data);
 
      if (response.status === 200 || response.status === 201) {
        const user = {
          user_key: response.data.data.user.user_key,
          id: response.data.data.user.id,
          name: response.data.data.user.owner_legal_name,
          mobile_number: response.data.data.user.mobile_number,
          role: response.data.data.user.role,
          status: response.data.data.user.status,
        };
        const token = response.data.data.access_token;
  
        

        return response.data; // Axios automatically parses JSON


    } else {
      throw new Error("OTP verification failed");
    }  */  // Uncomment when API is integrated
  } catch (error) {
    // return rejectWithValue(error?.response?.data?.message || "OTP verification failed");
    return rejectWithValue("OTP verification failed"); // Comment when API is integrated
  }
    }
  );

export const postSignUp = createAsyncThunk(
  "auth/signUp",
  async (data, { rejectWithValue }) => {
    try {

      console.log("postSignUp called with:", data);

      response = await signupAPI(data)
      /*
      const response = await signupAPI(data);

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error("Signup failed");
      } */
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Signup failed");
    }
  }

);
