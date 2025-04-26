import axios from "axios";
import { API_BASE_URL } from "./constants";

const apiInstance = axios.create({
  baseURL: API_BASE_URL, //  "http://127.0.0.1:8000/api/v1/"
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // ← NEW
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiInstance;
