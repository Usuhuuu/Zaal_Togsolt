import { configureStore, createSlice } from "@reduxjs/toolkit";
import * as Localization from "expo-localization";

const localLng = Localization.getLocales()[0].languageCode;

// Define separate initial states
const initState = {
  isitLogined: false,
  lngCode: localLng,
  forceUpdate: 0,
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

// Reset user state
const resetSlice = createSlice({
  name: "reset",
  initialState: initState,
  reducers: {
    triggerReRender: (state) => {
      state.forceUpdate++;
    },
  },
});

// Export actions
export const { loginedState, loginoutState } = authStatus.actions;
export const { changeLanguageState } = languageSlice.actions;
export const { triggerReRender } = resetSlice.actions;

// Create store
export const store = configureStore({
  reducer: {
    authStatus: authStatus.reducer,
    language: languageSlice.reducer,
    reset: resetSlice.reducer,
  },
});

// Define types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
