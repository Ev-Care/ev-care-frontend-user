import { configureStore } from "@reduxjs/toolkit";
import { signInReducer } from "../../screens/auth/services/slice";

const store = configureStore({
    reducer: {
        signIn: signInReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),

});

export default store;
