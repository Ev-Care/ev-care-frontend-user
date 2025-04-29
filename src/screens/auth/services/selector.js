
export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectloader = (state) => state.auth.loading;  // ✅ Get user data
export const selectAuthloader = (state) => state.auth.loading;  // ✅ Get user data
export const selectToken = (state) => state.auth.accessToken;  // ✅ Get user data
export const selectAuthError = (state) => state.auth.error;  // ✅ Get user data

