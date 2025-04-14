import { createSlice,  } from "@reduxjs/toolkit";

import { fetchStationsByLocation } from "./crudFunction";

// Initial state
const initialState = {
  stations: [],
  loading: false,
  error: null,
};

// Slice
const stationSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    // Reducer to reset the state
    resetStationsState: (state) => {
      state.stations = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetchStations
      .addCase(fetchStationsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for fetchStations
      .addCase(fetchStationsByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload; // Update the stations list
      })
      // Handle rejected state for fetchStations
      .addCase(fetchStationsByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

// Export actions
export const { resetStationsState } = stationSlice.actions;



// Export reducer
export default stationSlice.reducer;