import useSWR, { SWRConfiguration } from "swr";
import {
  fetchRoleAndProfile,
  normalFetch,
} from "../app/(modals)/functions/profile_data_fetch";

interface useSWRProps {
  pathname?: string;
  cacheKey?: string;
  loginStatus?: boolean;
}

export const regular_swr = (
  { item }: { item: useSWRProps },
  config?: SWRConfiguration
) => {
  const { pathname, cacheKey, loginStatus } = item;
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(loginStatus ? [cacheKey, loginStatus] : null, {
    fetcher: () => normalFetch(`${pathname}`),
    revalidateOnFocus: config?.revalidateOnFocus ?? false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    ...config,
  });

  return {
    data: userData,
    error: userError,
    isLoading: userLoading,
  };
};

export const auth_swr = (
  { item }: { item: useSWRProps },
  config?: SWRConfiguration
) => {
  const { pathname, cacheKey, loginStatus } = item;
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(loginStatus ? [cacheKey, loginStatus] : null, {
    fetcher: () => fetchRoleAndProfile(`${pathname}`, loginStatus ?? false),
    revalidateOnFocus: config?.revalidateOnFocus ?? false,
    refreshInterval: config?.refreshInterval ?? 30 * 1000,
    shouldRetryOnError: false,
    errorRetryInterval: 4000,
    errorRetryCount: 3,
    ...config,
  });

  return {
    data: userData,
    error: userError,
    isLoading: userLoading,
  };
};
