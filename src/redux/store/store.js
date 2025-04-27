import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer, { restoreUser } from "./userSlice";
import vendorReducer from "../../screens/vendor/services/vendorSlice";
import stationReducer from "../../screens/user/service/stationSlice"; // Import the stationReducer
import { getUserByKey } from "../../screens/auth/services/crudFunction";
import snackbarReducer from '../snackbar/snackbarSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    vendor: vendorReducer,
    station: stationReducer,
    snackbar: snackbarReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const loadUserData = async () => {
  try {
    const user_key = await AsyncStorage.getItem("user");
    const accessToken = await AsyncStorage.getItem("accessToken");
   console.log("user key in store",user_key);
    if (user_key && accessToken) {
      store.dispatch(getUserByKey( user_key ));
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

loadUserData();

export default store;
