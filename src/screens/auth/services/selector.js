import { createSelector } from "@reduxjs/toolkit";

export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectSignIn = (state) => state.auth.signIn;
export const selectToggleValue = (state) => state.auth.toggleValue;
