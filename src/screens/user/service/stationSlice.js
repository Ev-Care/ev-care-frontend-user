import { createSlice,  } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { fetchStationsByLocation } from "./crudFunction";


// Enable support for Set and Map in Immer
enableMapSet();
// Initial state
const initialState = {
  stations: [],
  favorite: new Set(),
  recent: new Set(),
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
      state.favorite = new Set();
      state.recent = new Set();
      state.loading = false;
      state.error = null;
    },
    addToFavorite: (state, action) => {
      var station = action.payload;

      if(state.favorite.has(station)) {
        console.log("station already in favorite");
        state.favorite.delete(station);
        return;
      }
      state.favorite.add(station);
      console.log("station added to favorite in slice", [...state.favorite]);
    },
    removeFromFavorite: (state, action) => {
      var station = action.payload;
      state.favorite.delete(station);
    },
    addToRecent: (state, action) => {
      var item = {
        id: action.payload.id,
        time: Date.now(),
      }
      state.recent.push(stationId);
    },

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
      });
  },
});

// Export actions
export const { resetStationsState, addToFavorite, removeFromFavorite, addToRecent } = stationSlice.actions;



// Export reducer
export default stationSlice.reducer;