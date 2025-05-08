// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     signIn: null, 
//     toggleValue: 0,
//     user: null,
//     loggedInUser: null
// };

// const signInSlice = createSlice({
//     name: "signIn",
//     initialState,
//     reducers: {
//         signInSuccess: (state, action) => {
//             state.signIn = action.payload;
//             state.toggleValue = Math.floor(Math.random() * 100) + 1;
//         }, 
//         signInFailed: (state, action) => {
//             state.signIn = Array.isArray(action.payload.errors) && action.payload.errors[0]?.length > 0 
//                 ? action.payload.errors[0] 
//                 : "Something went wrong. Please try again";
//             state.toggleValue = Math.floor(Math.random() * 100) + 1;
//         }, 
//         verifyOtpSuccess: (state, action) => {
//             state.user = action.payload;
//             state.toggleValue = Math.floor(Math.random() * 100) + 1;
//         },
//         verifyOtpFailed: (state, action) => {
//             state.user = action.payload || "OTP verification failed";
//             state.toggleValue = Math.floor(Math.random() * 100) + 1;
//         },
//         signUpSuccess: (state, action) => {
//             state.user = action.payload; // Store updated user data
//             state.toggleValue = Math.floor(Math.random() * 100) + 1;
//         },
//         signUpFailed: (state, action) => {
//             state.user = action.payload || "Signup failed";
//             state.toggleValue = Math.floor(Math.random() * 100) + 1;
//         },
//         logout: (state) => {
//             state.signIn = null;
//             state.user = null;
//             state.loggedInUser = null;
//             state.toggleValue = 0;
//         }
//     }
// });

// export const signInReducer = signInSlice.reducer;
// export const { signInSuccess, signInFailed, verifyOtpFailed, verifyOtpSuccess, signUpSuccess,signUpFailed, logout } = signInSlice.actions;
