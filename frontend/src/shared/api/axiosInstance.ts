import axios from "axios";

// withCredentials para que el navegador mande la cookie HttpOnly
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
  timeout: 10000,
  withCredentials: true,
});
