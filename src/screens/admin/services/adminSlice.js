import { createSlice } from "@reduxjs/toolkit";
import { approveStation, approveVendorProfile, fetchAllPendingStation, getAllUsers } from "./crudFunctions";



const initialState = {
    users: [],
    stations: [],
    loading: false,
    error: null,

};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPendingStation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPendingStation.fulfilled, (state, action) => {
                state.loading = false;
                state.stations = action.payload.data;

            })
            .addCase(fetchAllPendingStation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;

            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(approveStation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveStation.fulfilled, (state, action) => {
                state.loading = false;

            })
            .addCase(approveStation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(approveVendorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveVendorProfile.fulfilled, (state, action) => {
                state.loading = false;

            })
            .addCase(approveVendorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
        }
    });

// export default adminSlice.actions;
export default adminSlice.reducer;
