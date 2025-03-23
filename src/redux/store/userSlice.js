import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [
    { id: 1, name: " John Doe", contactNo: "1234567890" ,role:"user" },
    { id: 2, name: " Alice Smith", contactNo: "9876543210",role:"vendor"  },
  ],
  loggedInUser: null, // Holds the authenticated user
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const user = state.users.find(user => user.contactNo === action.payload);
      if (user) {
        state.loggedInUser = user; // Set the logged-in user
      } else {
        state.loggedInUser = null;
      }
    },
    logoutUser: (state) => {
      state.loggedInUser = null; // Clear user session
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
  },
});

export const { loginUser, logoutUser, addUser } = userSlice.actions;
export default userSlice.reducer;
