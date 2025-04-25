// Selector to get stations from the state
export const selectStations = (state) => state.station.stations;
export const selectFavoriteStations = (state) => state.station.favorite;
export const selectRecentStations = (state) => state.station.recent;
export const selectUser = (state) => state.auth.user;
export const selectUserCoordinate = (state) => state.auth.userCoordinate;
export const selectStationsLoading = (state) => state.station.loading;
export const selectUserLoading = (state) => state.auth.loading;