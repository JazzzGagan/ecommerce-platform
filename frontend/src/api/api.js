import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = String(error?.response?.data?.message || "").toLowerCase();
    const isAuthError =
      status === 401 &&
      (message.includes("token") ||
        message.includes("authorization") ||
        message.includes("auth"));

    if (isAuthError) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      if (window.location.pathname !== "/login") {
        const redirectTo = encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        );
        window.location.href = `/login?expired=1&redirect=${redirectTo}`;
      }
    }

    return Promise.reject(error);
  },
);

export default API;
