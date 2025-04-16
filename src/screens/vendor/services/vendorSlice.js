
import { createSlice } from '@reduxjs/toolkit';
import { fetchStations, addStation, deleteStation, updateStationsChargersConnectorsStatus } from './crudFunction';

// Initial State
const initialState = {
  stations: [], // Array to hold multiple stations
  loading: false, // To track loading state
  error: null, // To track errors
};
// Slice
const vendorSlice = createSlice({
  name: 'vendorStations',
  initialState,
  reducers: {
    // Optional: Add any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    // Fetch Stations
    builder
      .addCase(fetchStations.pending, (state) => {
        // console.log("fetch stations pending called")
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload.data.chargingStations;
        // console.log("fetch stations fullfilled called", action.payload.data.chargingStations)
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("fetch stations rejected called", action.payload)
      });

    // Add Station
    builder
      .addCase(addStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStation.fulfilled, (state, action) => {
        state.loading = false;
        state.stations.push(action.payload.data);
      })
      .addCase(addStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Station
    /* builder
       .addCase(updateStation.pending, (state) => {
         state.loading = true;
         state.error = null;
       })
       .addCase(updateStation.fulfilled, (state, action) => {
         state.loading = false;
         const updatedStation = action.payload;
         const index = state.stations.findIndex((station) => station.id === updatedStation.id);
         if (index !== -1) {
           state.stations[index] = updatedStation;
         }
       })
       .addCase(updateStation.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload;
       });
 */
    // Delete Station
    builder
      .addCase(deleteStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStation.fulfilled, (state, action) => {
        state.loading = false;
        const stationId = action.payload;
        state.stations = state.stations.filter((station) => station.id !== stationId);
      })
      .addCase(deleteStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // update toggele station 
    builder
      .addCase(updateStationsChargersConnectorsStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("update station pending called");
      })
      .addCase(updateStationsChargersConnectorsStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // console.log("update station Fullfilled called", action.payload[0]);

        // Extract the updated station from the payload
        const updatedStation = action.payload[0];

        // Iterate over the stations and replace the matching station
        state.stations = state.stations.map((station) =>
          station.id === updatedStation.id ? updatedStation : station
        );

        // console.log("Updated stations:", state.stations);


      })
      .addCase(updateStationsChargersConnectorsStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vendorSlice.reducer;