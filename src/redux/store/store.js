import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer, { restoreUser } from "./userSlice";
import vendorReducer from "../../screens/vendor/services/vendorSlice";
import stationReducer from "../../screens/user/service/stationSlice"; // Import the stationReducer
import adminReducer from "../../screens/admin/services/adminSlice";
import { getUserByKey } from "../../screens/auth/services/crudFunction";
import snackbarReducer, { showSnackbar } from '../snackbar/snackbarSlice'
import { TimeDelay } from "../../utils/globalMethods";

const store = configureStore({
  reducer: {
    auth: authReducer,
    vendor: vendorReducer,
    admin: adminReducer,
    station: stationReducer,
    snackbar: snackbarReducer

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const loadUserData = async () => {
  try {
    const user_key = await AsyncStorage.getItem("user");
    const accessToken = await AsyncStorage.getItem("accessToken");
    // console.log("user key in store", user_key);
    // console.log("Access token in store", accessToken);
    if (user_key && accessToken) {
      await delay(2000); // 3 seconds delay
      await store.dispatch(getUserByKey(user_key));
      await store.dispatch(restoreUser(accessToken));
      // await store.dispatch(showSnackbar({ message: "Logged-In successfully", type: "success" }));

    }
  } catch (error) {
    console.error("Error loading user data:", error);
    store.dispatch(showSnackbar({ message: "Logged-In failed. Try again", type: "error" }));

  }
};

loadUserData();

export default store;
