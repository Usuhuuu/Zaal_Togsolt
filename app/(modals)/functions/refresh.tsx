import * as SecureStore from "expo-secure-store";
import { axiosInstanceRegular } from "./axiosInstanc";
import type { AppDispatch } from "./store";
import { RootState, loginedState, loginoutState } from "./store";
import { useDispatch, useSelector } from "react-redux";

export const auth_Refresh_Function = async (refreshToken: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const loginInState = useSelector((state: RootState) => {
    console.log(state.authStatus.isitLogined);
    return state.authStatus.isitLogined;
  });
  try {
    const refreshTokenAuth = await axiosInstanceRegular.post(
      "/auth/refresh",
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    if (refreshTokenAuth.status == 401 && !refreshTokenAuth.data.success) {
      await SecureStore.deleteItemAsync("Token");
      dispatch(loginoutState());
    } else if (
      refreshTokenAuth.status == 403 &&
      !refreshTokenAuth.data.success
    ) {
      throw new Error(`${refreshTokenAuth.data.message}`);
    } else if (refreshTokenAuth.data.authAccess) {
      dispatch(loginedState());
      const new_access_token = refreshTokenAuth.data.accessToken;
      return new_access_token;
    }
  } catch (err) {
    console.error("Error refreshing token:", err);
    throw new Error("Failed to refresh token. Please try again later.");
  }
};
