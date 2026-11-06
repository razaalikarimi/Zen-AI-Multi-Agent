import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

// Resilient Authorization header propagation for cross-origin environments
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("zen_session");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
