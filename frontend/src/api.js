import axios from "axios";

const BASE_URL = '';  // Use empty string for proxy

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,              // set true only if using cookies/sessions
  timeout: 15000,
});

// JWT from localStorage -> Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  // adjust your key
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
