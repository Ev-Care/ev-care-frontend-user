import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer, { restoreUser } from "./userSlice";
import vendorReducer from "../../screens/vendor/services/vendorSlice";
import stationReducer from "../../screens/user/service/stationSlice"; // Import the stationReducer
const store = configureStore({
  reducer: {
    auth: authReducer,
    vendor: vendorReducer,
    stations: stationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const loadUserData = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (user && accessToken) {
      store.dispatch(restoreUser({ user: JSON.parse(user), accessToken }));
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

loadUserData();

export default store;
