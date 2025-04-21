import useSWR from "swr";
import {
  fetchRoleAndProfile,
  normalFetch,
} from "../app/(modals)/functions/profile_data_fetch";

interface useSWRProps {
  pathname?: string;
  cacheKey?: string;
  loginStatus?: boolean;
}

export const regular_swr = ({ item }: { item: useSWRProps }) => {
  const { pathname, cacheKey } = item;
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(`${cacheKey}`, {
    fetcher: () => normalFetch(`${pathname}`),
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  return {
    data: userData,
    error: userError,
    isLoading: userLoading,
  };
};
export const auth_swr = ({ item }: { item: useSWRProps }) => {
  const { pathname, cacheKey, loginStatus } = item;
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(loginStatus ? [cacheKey, loginStatus] : null, {
    fetcher: () => fetchRoleAndProfile(`${pathname}`, loginStatus ?? false),
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 10000,
    errorRetryInterval: 4000,
    errorRetryCount: 3,
    dedupeInterval: 3000,
  });

  return {
    data: userData,
    error: userError,
    isLoading: userLoading,
  };
};
