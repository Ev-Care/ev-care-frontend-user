// Selector to get stations from the state
export const selectAdminStations = (state) => state.admin.stations;
export const selectAdminUsers = (state) => state.admin.users;
export const selectUserCoordinate = (state) => state.admin.userCoordinate;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectUserLoading = (state) => state.auth.loading;