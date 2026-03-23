import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

// Save Tokens
export const saveTokens = async (access) => {
  if (!access) return;

  if (isWeb) {
    localStorage.setItem("accessToken", access);
    } else {
    await SecureStore.setItemAsync("accessToken", access);
  }
};

// Get Access Token
export const getAccessToken = async () => {
  return isWeb
    ? localStorage.getItem("accessToken")
    : await SecureStore.getItemAsync("accessToken");
};

// Get Refresh Token
export const getRefreshToken = async () => {
  return isWeb
    ? localStorage.getItem("refreshToken")
    : await SecureStore.getItemAsync("refreshToken");
};

// Clear Tokens
export const clearTokens = async () => {
  if (isWeb) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } else {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }
};
