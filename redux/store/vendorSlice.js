import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendors: [
    { id: 1, name: "EV FastCharge", location: "Downtown, NY" },
    { id: 2, name: "GreenCharge", location: "Suburbs, CA" },
  ],
};

const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    addVendor: (state, action) => {
      state.vendors.push(action.payload);
    },
  },
});

export const { addVendor } = vendorSlice.actions;
export default vendorSlice.reducer;