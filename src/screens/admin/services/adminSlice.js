import { createSlice } from "@reduxjs/toolkit";
import { approveStation, approveVendorProfile, fetchAllPendingStation, fetchAllStations, getAllSupportIssues, getAllUsers, getAllVendors } from "./crudFunctions";

const initialState = {
    allUsers: [],
    allVendors: [],
    allStations: [],
    pendingStations: [],
    rejectedStations: [],
    supportIssues: [],
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
                state.pendingStations = action.payload.data;

            })
            .addCase(fetchAllPendingStation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload.data;
                state.loading = false;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(getAllVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllVendors.fulfilled, (state, action) => {
                state.allVendors = action.payload.data;
                state.loading = false;
            })
            .addCase(getAllVendors.rejected, (state, action) => {
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
            })
            .addCase(fetchAllStations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllStations.fulfilled, (state, action) => {
                state.loading = false;
                state.allStations = action.payload.data.chargingStations;

            })
            .addCase(fetchAllStations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(getAllSupportIssues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSupportIssues.fulfilled, (state, action) => {
                state.loading = false;
                state.supportIssues = action.payload.data;

            })
            .addCase(getAllSupportIssues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

// export default adminSlice.actions;
export default adminSlice.reducer;
