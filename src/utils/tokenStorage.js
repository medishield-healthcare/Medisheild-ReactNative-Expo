import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// ============================================================
// SAVE TOKENS
// ============================================================

export const saveTokens = async (
  accessToken,
  refreshToken
) => {
  try {
    if (isWeb) {
      if (accessToken) {
        localStorage.setItem(
          ACCESS_TOKEN_KEY,
          accessToken
        );
      }

      if (refreshToken) {
        localStorage.setItem(
          REFRESH_TOKEN_KEY,
          refreshToken
        );
      }
    } else {
      if (accessToken) {
        await SecureStore.setItemAsync(
          ACCESS_TOKEN_KEY,
          accessToken
        );
      }

      if (refreshToken) {
        await SecureStore.setItemAsync(
          REFRESH_TOKEN_KEY,
          refreshToken
        );
      }
    }
  } catch (error) {
    console.log(
      "Save tokens error:",
      error
    );
  }
};


// ============================================================
// GET ACCESS TOKEN
// ============================================================

export const getAccessToken = async () => {
  try {
    if (isWeb) {
      return localStorage.getItem(
        ACCESS_TOKEN_KEY
      );
    }

    return await SecureStore.getItemAsync(
      ACCESS_TOKEN_KEY
    );

  } catch (error) {
    console.log(
      "Get access token error:",
      error
    );

    return null;
  }
};


// ============================================================
// GET REFRESH TOKEN
// ============================================================

export const getRefreshToken = async () => {
  try {
    if (isWeb) {
      return localStorage.getItem(
        REFRESH_TOKEN_KEY
      );
    }

    return await SecureStore.getItemAsync(
      REFRESH_TOKEN_KEY
    );

  } catch (error) {
    console.log(
      "Get refresh token error:",
      error
    );

    return null;
  }
};


// ============================================================
// CLEAR TOKENS
// ============================================================

export const clearTokens = async () => {
  try {
    if (isWeb) {

      localStorage.removeItem(
        ACCESS_TOKEN_KEY
      );

      localStorage.removeItem(
        REFRESH_TOKEN_KEY
      );

    } else {

      await SecureStore.deleteItemAsync(
        ACCESS_TOKEN_KEY
      );

      await SecureStore.deleteItemAsync(
        REFRESH_TOKEN_KEY
      );

    }
  } catch (error) {
    console.log(
      "Clear tokens error:",
      error
    );
  }
};