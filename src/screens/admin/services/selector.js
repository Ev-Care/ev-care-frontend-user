// Selector to get stations from the state
// export const selectPendingStations = (state) => state.admin.pendingStations;
export const selectAllVendors = (state) => state.admin.allVendors;
export const selectAllUsers = (state) => state.admin.allUsers;
export const selectAllStations = (state) => state.admin.allStations;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectUserLoading = (state) => state.auth.loading;
export const selectRejectedStations = (state) => state.admin.rejectedStations;
export const selectRejectedUsers = (state) => state.admin.rejectedUsers;
export const selectAllSupportIssues = (state) => state.admin.supportIssues;

// Filtered selectors
export const selectPendingVendors = (state) => state.admin.allVendors.filter((user) => user?.status === "Completed");
export const selectActiveVendors = (state) => state.admin.allVendors.filter((user) => user?.status === "Active");
export const selectPendingStations = (state) => state.admin.allStations.filter((station) => station?.status === "Planned");

