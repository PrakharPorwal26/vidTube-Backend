// src/utils/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1",
  withCredentials: true, // send & receive HttpOnly cookies
});

// A flag so we don’t infinite‑loop
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalReq = err.config;
    if (
      err.response?.status === 401 &&
      !originalReq._retry
    ) {
      if (isRefreshing) {
        // queue up additional failed requests until refresh finishes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(() => api(originalReq))
        .catch((e) => Promise.reject(e));
      }

      originalReq._retry = true;
      isRefreshing = true;

      // Call the refresh endpoint
      return new Promise((resolve, reject) => {
        api.post("/users/refresh")
          .then((res) => {
            processQueue(null);
            resolve(api(originalReq));
          })
          .catch((refreshErr) => {
            processQueue(refreshErr, null);
            reject(refreshErr);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  }
);

export default api;
