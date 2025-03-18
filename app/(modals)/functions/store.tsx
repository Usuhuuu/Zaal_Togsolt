import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  configureStore,
  createSlice,
  combineReducers,
  PayloadAction,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

// Redux Persist Config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["authStatus"],
};

// Authentication Slice
const authStatus = createSlice({
  name: "authStatus",
  initialState: { isitLogined: false },
  reducers: {
    logininState: (state, action: PayloadAction<{ isitLogined: boolean }>) => {
      state.isitLogined = action.payload.isitLogined;
    },
    logoutState: (state, action: PayloadAction<{ isitLogined: boolean }>) => {
      state.isitLogined = action.payload.isitLogined;
    },
  },
});

// Combine Reducers
const rootReducer = combineReducers({
  authStatus: authStatus.reducer,
});

// Apply Persistor
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Export Actions
export const { logininState, logoutState } = authStatus.actions;

// Create Redux Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Create Persistor
export const persistor = persistStore(store);

// Define Types for useSelector & useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
