import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getPayload(response) {
  // Supports common API envelopes: { success, data: [...] } or direct arrays/objects.
  return response?.data?.data ?? response?.data;
}

export function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Terjadi kesalahan.";
}

export default api;