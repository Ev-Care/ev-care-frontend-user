import { configureStore } from "@reduxjs/toolkit";
import authReducer from './userSlice'; // Ensure correct import

const store = configureStore({
    reducer: {
        auth: authReducer, // Correct reducer reference
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
