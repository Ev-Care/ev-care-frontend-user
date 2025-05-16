import { createSlice,  } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { fetchStationsByLocation, getAllFavoriteStations } from "./crudFunction";



const initialState = {
  stations: [],
  favorite: [],
  loading: false,
  error: null,
};

// Slice
const stationSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
     clearUserStationsState: () => initialState,

  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetchStations
      .addCase(fetchStationsByLocation.pending, (state) => {
        // console.log("Fetching stations...");
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for fetchStations
      .addCase(fetchStationsByLocation.fulfilled, (state, action) => {
        // console.log("Stations fetched successfully 1:", action.payload);
        state.loading = false;
        state.stations = action.payload.data; // Update the stations list
        
      })
      // Handle rejected state for fetchStations
      .addCase(fetchStationsByLocation.rejected, (state, action) => {
        // console.log("Error fetching stations:", action.payload);
        state.loading = false;
        state.error = action.payload; // Store the error message
      })
      .addCase(getAllFavoriteStations.pending, (state) => {
        // console.log("Fetching favorite stations...");
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFavoriteStations.fulfilled, (state, action) => {
        // console.log("Favorite stations fetched successfully:", action.payload);
        state.loading = false;
        state.favorite = action.payload.data; // Update the favorite stations list
        console.log("favorite stations:", state.favorite); // Log the favorite stations for debugging
      })
      .addCase(getAllFavoriteStations.rejected, (state, action) => {
        // console.log("Error fetching favorite stations:", action.payload);
        state.loading = false;
        state.error = action.payload; // Store the error message
      })  
  },
});

// Export actions
export const { clearUserStationsState } = stationSlice.actions;



// Export reducer
export default stationSlice.reducer;