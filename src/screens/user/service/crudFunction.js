import { createAsyncThunk } from "@reduxjs/toolkit";
// Async thunk to fetch stations
export const fetchStationsByLocation = createAsyncThunk(
  "stations/fetchStations",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getAllStationsByLocationAPI(data); // Call the API to fetch stations by location
      return response.data; // Assuming the API returns a list of stations
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);