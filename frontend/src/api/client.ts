import axios from "axios";

/** Typed axios instance. Attaches the JWT and handles 401 centrally. */
export const api = axios.create({ baseURL: "/api" });

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => { accessToken = t; };

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
