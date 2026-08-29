import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../utils/tokenStorage";


// ============================================================
// API INSTANCE
// ============================================================

const BASE_URL =
  "http://192.168.1.15:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

API.interceptors.request.use(
  async (config) => {

    const token =
      await getAccessToken();

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ============================================================
// REFRESH STATE
// ============================================================

let isRefreshing = false;

let failedQueue = [];


// ============================================================
// PROCESS QUEUED REQUESTS
// ============================================================

const processQueue = (
  error,
  token = null
) => {

  failedQueue.forEach(
    (promise) => {

      if (error) {

        promise.reject(error);

      } else {

        promise.resolve(token);

      }

    }
  );

  failedQueue = [];
};


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

API.interceptors.response.use(

  // SUCCESS
  (response) => {
    return response;
  },


  // ERROR
  async (error) => {

    const originalRequest =
      error.config;


    // --------------------------------------------------------
    // Only handle 401
    // --------------------------------------------------------

    if (
      error.response?.status !== 401
    ) {

      return Promise.reject(error);
    }


    // --------------------------------------------------------
    // Don't retry same request twice
    // --------------------------------------------------------

    if (
      originalRequest?._retry
    ) {

      return Promise.reject(error);
    }


    // --------------------------------------------------------
    // Don't refresh the refresh endpoint
    // --------------------------------------------------------

    if (
      originalRequest?.url?.includes(
        "/user/refresh"
      )
    ) {

      await clearTokens();

      return Promise.reject(error);
    }


    // --------------------------------------------------------
    // If another refresh is already running
    // wait for it
    // --------------------------------------------------------

    if (isRefreshing) {

      return new Promise(
        (resolve, reject) => {

          failedQueue.push({
            resolve,
            reject,
          });

        }
      )
        .then((newAccessToken) => {

          originalRequest.headers =
            originalRequest.headers ||
            {};

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;

          return API(
            originalRequest
          );

        })
        .catch((err) => {

          return Promise.reject(err);

        });
    }


    // --------------------------------------------------------
    // Start refresh
    // --------------------------------------------------------

    originalRequest._retry =
      true;

    isRefreshing = true;


    try {

      const refreshToken =
        await getRefreshToken();


      console.log(
        "Refresh token available:",
        !!refreshToken
      );


      if (!refreshToken) {

        await clearTokens();

        throw new Error(
          "Refresh token not found"
        );
      }


      // ------------------------------------------------------
      // Refresh API
      // IMPORTANT:
      // Use axios directly, not API
      // ------------------------------------------------------

      const refreshResponse =
        await axios.post(

          `${BASE_URL}/user/refresh`,

          {
            refreshToken,
          }

        );


      console.log(
        "Refresh response:",
        refreshResponse.data
      );


      const newAccessToken =
        refreshResponse.data.accessToken ||
        refreshResponse.data.token;


      const newRefreshToken =
        refreshResponse.data.refreshToken ||
        refreshToken;


      if (!newAccessToken) {

        throw new Error(
          "New access token not received"
        );
      }


      // ------------------------------------------------------
      // SAVE NEW TOKENS
      // ------------------------------------------------------

      await saveTokens(
        newAccessToken,
        newRefreshToken
      );


      // ------------------------------------------------------
      // Resolve waiting requests
      // ------------------------------------------------------

      processQueue(
        null,
        newAccessToken
      );


      // ------------------------------------------------------
      // Retry original request
      // ------------------------------------------------------

      originalRequest.headers =
        originalRequest.headers ||
        {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;


      console.log(
        "Access token refreshed successfully"
      );


      return API(
        originalRequest
      );


    } catch (refreshError) {

      console.log(
        "Refresh failed:",
        refreshError?.response?.data ||
        refreshError?.message
      );


      processQueue(
        refreshError,
        null
      );


      await clearTokens();


      return Promise.reject(
        refreshError
      );


    } finally {

      isRefreshing = false;

    }

  }
);


export default API;