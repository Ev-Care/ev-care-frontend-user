import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
 
  loggedInUser: null, // Holds the authenticated user
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      // const user = state.users.find(user => user.contactNo === action.payload);
      state.user = action.payload;
      state.loggedInUser = state.user; // Set the logged-in user
      // state.loggedInUser = null;
    },
    logoutUser: (state) => {
      state.loggedInUser = null; // Clear user session
    },
    // addUser: (state, action) => {
    //   state.users.push(action.payload);
    // },
  },
});

export const { loginUser, logoutUser, addUser } = userSlice.actions;
export default userSlice.reducer;
