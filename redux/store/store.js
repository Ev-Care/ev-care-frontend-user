import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import vendorReducer from "./vendorSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    vendors: vendorReducer,
  },
});

export default store;