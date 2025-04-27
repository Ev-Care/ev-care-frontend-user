import { 
    signInSuccess, 
    signInFailed, 
    verifyOtpSuccess, 
    verifyOtpFailed, 
    signUpSuccess, 
    signUpFailed 
} from "./slice"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInAPI, verifyOtpAPI, signupAPI, postSingleFileAPI ,updateVendorAPI, getUserByKeyApi } from "./api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserByKeyAPI } from "../../user/service/api";

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
            return rejectWithValue(error?.response?.data?.message || "Something went wrong");
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
        return rejectWithValue(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.log("Error in postVerifyOtp:", error);

      // Always extract message properly even in catch
      const errorMessage =
        error?.response?.data?.message ||  // API sent error message
        error?.message ||                  // JS error message
        "OTP verification failed";          // fallback message

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
          return rejectWithValue(response.data.message || "OTP verification failed");
        }
      } catch (error) {
        console.log("Error in postSignUp:", error);
  
        // Always extract message properly even in catch
        const errorMessage =
          error?.response?.data?.message ||  // API sent error message
          error?.message ||                  // JS error message
          "OTP verification failed";          // fallback message
  
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
        console.log("data at crud func page",data.user_key);
        const response = await updateVendorAPI(data);
        console.log("response at crud func page",response);
        if (response.status === 200 || response.status === 201) {
         
          return response.data; // or `bodyData` if you want
        } else {
          console.log("resposne in else",response);
          // return rejectWithValue(response.message + " "+response.statusCode);
          throw new Error(response.message + " "+response.statusCode);
        }
      } catch (error) {
        console.log("error at crud ",error);
        return rejectWithValue(error || "Request failed");
      }
    }
  );

  export const getUserByKey = createAsyncThunk(
    "auth/getUserByKey",
    async (user_key, { rejectWithValue }) => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        console.log("payload in crud getuserbykey",user_key,"access token",accessToken);
        const response = await getUserByKeyApi({user_key,accessToken});
        console.log("response at crud func page",response);
        if (response.status === 200 || response.status === 201) {
         
          return response.data; // or `bodyData` if you want
        } else {
          console.log("resposne in else",response);
          // return rejectWithValue(response.message + " "+response.statusCode);
          throw new Error(response.message + " "+response.statusCode);
        }
      } catch (error) {
        console.log("error at crud ",error);
        return rejectWithValue(error || "Request failed");
      }
    }
  )