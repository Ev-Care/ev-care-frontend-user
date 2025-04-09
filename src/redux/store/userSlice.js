import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postSignIn, postSignUp, postVerifyOtp } from "../../screens/auth/services/crudFunction";
import { setupForLogin, verifyOtpAPI } from "./userServer";


const initialState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("accessToken");
      console.log("User logged out successfully");
    },
    restoreUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      console.log("User data restored from AsyncStorage:", action.payload.user);
      console.log("Access token restored from AsyncStorage:", action.payload.accessToken);
    },
    signUpUser: (state, action) => {
      console.log("singup is called in redux");
      state.user = extractUser(action.payload);
      state.loading = false;
      console.log("User signed up successfully in redux:", action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(postSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSignIn.fulfilled, (state, action) => {
        state.loading = false;
      // Call the setupForLogin function with the phone number
        // state.user = extractUser(action.payload.data.user); // Extract user data from the response
        // state.user = action.payload; // Extract user data from the response
        console.log("otp sent with response: ", action.payload.data.user.otp);
      })
      .addCase(postSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // OTP Verification
      .addCase(postVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postVerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        console.log("OTP verification response:", action.payload.status);
        // console.log("OTP Verified by user and action.payload is: ", action.payload);
        if (action.payload.status === 200 || action.payload.status  === 201) {
          // console.log("OTP verified successfully:", response.data);
          if (action.payload.data.user.status === "Completed") {
           
            // navigation.push("Register", { user: response.data.user });
            state.user = extractUser(action.payload.data.user); // Extract user data from the response
            
          }

          // state.user = action.payload;
        }
        /*  uncooment when API is integrated
        if (action.payload.data.user.status === "Completed") {
          state.user = extractUser(action.payload.data.user);
          state.accessToken = action.payload.data.access_token;
        
        }
        // console.log("User status:", state.user.status);
       */
      }
    )
      .addCase(postVerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sign Up
      .addCase(postSignUp.pending, (state) => {
        state.loading = true;
        console.log("User signing up...");
        state.error = null;
      })
      .addCase(postSignUp.fulfilled, (state, action) => {
        state.loading = false;
        console.log("User signed up successfully:", action.payload);
        state.user = extractUser(action.payload.data.user); // Extract user data from the response
        // state.user = action.payload;
      })
      .addCase(postSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const extractUser = (data) => ({
  user_key: data.user_key,
  email: data.email,
  role: data.role,
  status: data.status,
  name: data.owner_legal_name,
  business_name: data.business_name,
  mobile_number: data.mobile_number,
  pan_no: data.pan_no,
  tan_no: data.tan_no,
  adhar_no: data.adhar_no,
  address: data.address,
  avatar: data.avatar,
  adhar_front_pic: data.adhar_front_pic,
  adhar_back_pic: data.adhar_back_pic,
  pan_pic: data.pan_pic,
  tan_pic: data.tan_pic,
  google_id: data.google_id,
  otp: data.otp,
  otp_expiry_date: data.otp_expiry_date,
  login_method: data.login_method,
  created_at: data.created_at,
  update_at: data.update_at,
  updated_by: data.updated_by,
  isLoggedIn: data.isLoggedIn,
  password: data.password,
});

export const { logoutUser, restoreUser, signUpUser } = authSlice.actions;
export default authSlice.reducer;
