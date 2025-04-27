import { createSelector } from "@reduxjs/toolkit";

export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectloader = (state) => state.auth.loading;  // ✅ Get user data
export const selectAuthloader = (state) => state.auth.loading;  // ✅ Get user data
export const selectToken = (state) => state.auth.accessToken;  // ✅ Get user data
export const selectProfileStatus = (state) => state.auth.profileStatus;  // ✅ Get user data
// export const selectSignIn = (state) => state.auth.signIn;
// export const selectToggleValue = (state) => state.auth.toggleValue;
