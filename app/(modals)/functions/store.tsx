import { configureStore, createSlice } from "@reduxjs/toolkit";
import * as Localization from "expo-localization";

const localLng = Localization.getLocales()[0].languageCode;

// Define separate initial states
const initState = {
  isitLogined: false,
  lngCode: localLng,
};

// Language slice
const languageSlice = createSlice({
  name: "language",
  initialState: initState,
  reducers: {
    changeLanguageState: (state, action) => {
      state.lngCode = action.payload.lngCode;
    },
  },
});

// Authentication slice
const authStatus = createSlice({
  name: "authStatus",
  initialState: initState,
  reducers: {
    loginedState: (state) => {
      state.isitLogined = true; // Direct mutation (handled by immer)
    },
    loginoutState: (state) => {
      state.isitLogined = false;
    },
  },
});

export const resetUserState = () => ({
  type: "RESET_USER_STATE",
});

// Export actions
export const { loginedState, loginoutState } = authStatus.actions;
export const { changeLanguageState } = languageSlice.actions;

// Create store
export const store = configureStore({
  reducer: {
    authStatus: authStatus.reducer,
    language: languageSlice.reducer,
  },
});

// Define types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
