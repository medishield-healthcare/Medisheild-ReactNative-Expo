import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../utils/tokenStorage";

const API = axios.create({
  baseURL: "http://192.168.1.11:5000/api",
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearTokens();
        return Promise .reject(error);
      }

      try {
        const res = await axios.post(
          "http://192.168.1.11:5000/api/user/refresh",
          { refreshToken }
        );

        await saveTokens(res.data.accessToken, refreshToken);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return API(originalRequest);
      } catch {
        await clearTokens();
      }
    }

    return Promise.reject(error);
  }
);

export default API;
