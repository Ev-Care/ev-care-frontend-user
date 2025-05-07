// Selector to get stations from the state
export const selectPendingStations = (state) => state.admin.pendingStations;
export const selectPendingUsers = (state) => state.admin.pendingUsers;
export const selectAllUsers = (state) => state.admin.allUsers;
export const selectAllStations = (state) => state.admin.allStations;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectUserLoading = (state) => state.auth.loading;
export const selectRejectedStations = (state) => state.admin.rejectedStations;
export const selectRejectedUsers = (state) => state.admin.rejectedUsers;
export const selectAllSupportIssues = (state) => state.admin.supportIssues;
;
