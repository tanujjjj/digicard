import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
});

// ⬇️ Optional: Authenticated requests with token
export const apiWithToken = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default api;
