import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import {
  postSignIn,
  postSignUp,
  postSingleFile,
  postVerifyOtp,
  patchUpdateVendorProfile,
  getUserByKey,
  login,
  register,
} from "../../screens/auth/services/crudFunction";
import {
  patchUpdateUserProfile,
  getUserDetailsByKey,
} from "../../screens/user/service/crudFunction";
import { clearAdminState } from "../../screens/admin/services/adminSlice";
import { clearVendorState } from "../../screens/vendor/services/vendorSlice";

const initialState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
  userCoordinate: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoaderFalse: (state) => {
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("accessToken");
      // console.log("User logged out successfully");
      // clearAdminState();
      // clearVendorState();
      // clearUserStationsState();
    },
    restoreUser: (state, action) => {
      // state.user = extractUser(action.payload.user);
      state.accessToken = action.payload;
      // console.log("User data restored from AsyncStorage:", action.payload.user);
      console.log("Access token restored from AsyncStorage:", action.payload);
    },
    signUpUser: (state, action) => {
      // console.log("singup is called in redux");
      state.user = extractUser(action.payload);
      state.loading = false;
      // console.log("User signed up successfully in redux:", action.payload);
    },
    // New reducer to update userCoordinate
    updateUserCoordinate: (state, action) => {
      state.userCoordinate = action.payload; // Update userCoordinate with the payload
    },
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
      })
      .addCase(postSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // OTP Verification
      .addCase(postVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postVerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        console.log("inside slice");
        if (action.payload?.data?.user?.status !== "New") {
          state.user = extractUser(action.payload.data.user); // Extract user data from the response
        }
        // state.user = extractUser(action.payload.data.user); // Extract user data from the response
        state.accessToken = action.payload.data.access_token;
        console.log("token saved successfully - ", state.accessToken);
        console.log("user saved successfully - ", state.user);
      })
      .addCase(postVerifyOtp.rejected, (state, action) => {
        state.loading = false;
        console.log("error in slice", action.payload);
        state.error = action.payload.message;
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
        // Extract user data from the response
        state.user = extractUser(action.payload.data.user);
        console.log("User data after signup in slice:", state.user);
      })
      .addCase(postSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign Up
      .addCase(register.pending, (state) => {
        state.loading = true;
        console.log("User signing up...");
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        console.log("User signed up successfully:", action.payload);
        // Extract user data from the response
        state.user = extractUser(action.payload.data?.user);
        state.accessToken = action.payload.data?.access_token;
        console.log("User data after signup in slice:", state.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postSingleFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSingleFile.fulfilled, (state, action) => {
        state.loading = false;
        // state.filePathUrl = action.payload?.filePathUrl; // Assuming the API returns this
      })
      .addCase(postSingleFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "File upload failed";
      })
      .addCase(patchUpdateVendorProfile.pending, (state) => {
        // console.log("inside update vendor profile pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(patchUpdateVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("User profile updated successfully:", action.payload);
        // state.user = action.payload; // Assuming the API returns the updated user data
        state.user = extractUser(action.payload.data); // Extract user data from the response
        console.log("User data after update in slice:", state.user);
      })
      .addCase(patchUpdateVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Profile update failed";
      })
      .addCase(patchUpdateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchUpdateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        console.log(
          "User profile updated successfully in slice:",
          action.payload.data
        );
        state.user = extractUser(action.payload.data); // Extract user data from the response
      })
      .addCase(patchUpdateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Profile update failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        console.log(
          "User logged in successfully in slice:",
          action.payload.data
        );
        state.user = extractUser(action.payload.data.user); // Extract user data from the response
        state.accessToken = action.payload.data.access_token
        console.log('token in slice = ', state.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Profile update failed";
        console.log(state.error);
      })
      .addCase(getUserDetailsByKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailsByKey.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("User details fetched successfully:", action.payload);
        state.user = extractUser(action.payload.data); // Extract user data from the response
        // console.log("User data after fetching in slice:", state.user);
      })
      .addCase(getUserDetailsByKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user details";
      })
      .addCase(getUserByKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByKey.fulfilled, (state, action) => {
        // console.log("User details fetched successfully:", action.payload.data);

        state.loading = false;
        state.user = extractUser(action.payload.data);
      })
      .addCase(getUserByKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user details";
      });
  },
});

const extractUser = (data) => ({
  id: data.id,
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
  vehicle_registration_number: data.vehicle_registration_number,
  vehicle_manufacturer: data.vehicle_manufacturer,
  vehicle_model: data.vehicle_model,
  vendor_type: data.vendor_type,
  created_at: data.created_at,
  update_at: data.update_at,
  updated_by: data.updated_by,
  isLoggedIn: data.isLoggedIn,
  password: data.password,
});

export const {
  setAuthLoaderFalse,
  logoutUser,
  restoreUser,
  signUpUser,
  updateUserCoordinate,
} = authSlice.actions;
export default authSlice.reducer;
