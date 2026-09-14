import axios from "axios";

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  url = url.trim();
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL()
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("vp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
