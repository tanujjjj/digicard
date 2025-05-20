import axios from "axios";

// ✅ Read from environment variable (Vite uses import.meta.env)
const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
