import { createSlice } from "@reduxjs/toolkit";
import { approveStation, approveVendorProfile, fetchAllPendingStation, fetchAllStations, getAllPendingUsers, getAllSupportIssues } from "./crudFunctions";



const initialState = {
    allUsers: [],
    allStations: [],
    pendingStations: [],
    pendingUsers: [],
    rejectedStations: [],
    rejectedUsers: [],
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
            .addCase(getAllPendingUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPendingUsers.fulfilled, (state, action) => {
                state.loading = false;
                console.log('in users fulfilled.', action.payload.data[0]);
                state.pendingUsers = action.payload.data;

            })
            .addCase(getAllPendingUsers.rejected, (state, action) => {
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
