import axios from "axios";

import { API_BASE_URL } from "./constants";

/**
 * API instance for making HTTP requests with automatic token handling.
 * @type {import('axios').AxiosInstance}
 */
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✨ Attach Authorization header automatically
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // or cookie if you use cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
