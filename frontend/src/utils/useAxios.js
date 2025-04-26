import axios from "axios";
import Cookies from "js-cookie";

import { API_BASE_URL } from "./constants";
import { getRefreshedToken, isAccessTokenExpired, setAuthUser } from "./auth";

/**
 * Custom hook to create an Axios instance with authentication headers.
 * @returns {AxiosInstance} The configured Axios instance.
 */
const useAxios = () => {
  const instance = axios.create({ baseURL: API_BASE_URL });

  instance.interceptors.request.use(async (config) => {
    let access = Cookies.get("access_token");
    const refresh = Cookies.get("refresh_token");

    // nothing at all?  just send the request unauthenticated
    if (!access) return config;

    // refresh if expired
    if (isAccessTokenExpired(access) && refresh) {
      const { access: newAccess, refresh: newRefresh } =
        await getRefreshedToken(refresh);

      setAuthUser(newAccess, newRefresh);        // stores new cookies + Zustand
      access = newAccess;
    }

    config.headers.Authorization = `Bearer ${access}`;
    return config;
  });

  return instance;
};

export default useAxios;
