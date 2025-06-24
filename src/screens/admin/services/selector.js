import { createSelector } from 'reselect';

// ...existing code...
export const selectAllVendors = (state) => state.admin.allVendors;
export const selectAllUsers = (state) => state.admin.allUsers;
export const selectAllStations = (state) => state.admin.allStations;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectUserLoading = (state) => state.auth.loading;
export const selectRejectedStations = (state) => state.admin.rejectedStations;
export const selectRejectedUsers = (state) => state.admin.rejectedUsers;
export const selectAllSupportIssues = (state) => state.admin.supportIssues;

// Memoized selectors using reselect
export const selectPendingVendors = createSelector(
  [selectAllVendors],
  (allVendors) => allVendors.filter((user) => user?.status === "Completed")
);

export const selectActiveVendors = createSelector(
  [selectAllVendors],
  (allVendors) => allVendors.filter((user) => user?.status === "Active")
);

export const selectPendingStations = createSelector(
  [selectAllStations],
  (allStations) => allStations.filter((station) => station?.status === "Planned")
);