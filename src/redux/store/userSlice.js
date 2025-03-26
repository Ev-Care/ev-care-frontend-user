import { createSlice } from "@reduxjs/toolkit";
import { postSignIn, postSignUp, postVerifyOtp } from "../../screens/auth/services/crudFunction";
// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
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
        state.user = action.payload;
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
        state.user = action.payload;
      })
      .addCase(postVerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sign Up
      .addCase(postSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(postSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authReducer = authSlice.reducer;