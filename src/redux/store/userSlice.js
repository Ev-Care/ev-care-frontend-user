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
      console.log("User logged out successfully in redux");
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
        // state.user = action.payload;
        console.log("otp sent with response: ", action.payload);
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
        // console.log("OTP Verified by user and action.payload is: ", action.payload);
        if (action.payload.data.user.status === "Completed") {
          state.user = extractUser(action.payload.data.user);
          console.log("User state changed by redux:", state.user);
        }
        // console.log("User status:", state.user.status);
      
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
        // state.user = action.payload;
      })
      .addCase(postSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const extractUser = (data) => {
  return {
    user_key: data.user_key,
    email: data.email,
    role: data.role,
    status: data.status,
    name : data.owner_legal_name
  }
}

export const { logoutUser, signUpUser } = authSlice.actions;
export default authSlice.reducer;
