import { createContext, useContext, useEffect, useState } from "react";

import API from "../api/axios";

import {
  getAccessToken,
  saveTokens,
  clearTokens,
} from "../utils/tokenStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // RESTORE SESSION
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        setUser(null);
        return;
      }

      const res = await API.get("/user/me");

      setUser(res.data.user);
    } catch (err) {
      console.log(
        "Session restore failed:",
        err?.response?.data || err?.message
      );

      await clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // EXISTING EMAIL-PASSWORD LOGIN
  const login = async (email, password) => {
    try {
      const res = await API.post("/user/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const { token, refreshToken, ...userData } = res.data;

      await saveTokens(token, refreshToken);

      setUser(userData);

      return res.data;
    } catch (error) {
      console.log(
        "Login error:",
        error?.response?.data || error?.message
      );

      throw error;
    }
  };

  // GOOGLE LOGIN — NEW FUNCTION
  const googleLogin = async (idToken) => {
    try {
      if (!idToken) {
        throw new Error("Google ID token is missing");
      }

      const res = await API.post("/user/google-login", {
        idToken,
      });

      const {
        token,
        refreshToken,
        ...userData
      } = res.data;

      await saveTokens(token, refreshToken);

      setUser(userData);

      return res.data;
    } catch (error) {
      console.log(
        "Google login error:",
        error?.response?.data || error?.message
      );

      throw error;
    }
  };

  
  // APPLE LOGIN
  const appleLogin = async (identityToken, firstName = "", lastName = "", referralCode = "") => {
    try {
      if (!identityToken) {
        throw new Error("Apple identity token is missing");
      }

      const res = await API.post("/user/apple-login", {
        identityToken,
        firstName,
        lastName,
        referralCode,
      });

      const { token, refreshToken, ...userData } = res.data;

      await saveTokens(token, refreshToken);
      setUser(userData);

      return res.data;
    } catch (error) {
      console.log(
        "Apple login error:",
        error?.response?.data || error?.message
      );

      throw error;
    }
  };


  // EXISTING REGISTER
  const register = async (
    firstname,
    lastname,
    email,
    mobile,
    password,
    referralCode
  ) => {
    try {
      const res = await API.post("/user/register", {
        firstname,
        lastname,
        email,
        mobile,
        password,
        referralCode,
      });

      console.log("REGISTER RESPONSE:", res.data);

      const { token, refreshToken, newUser } = res.data;

      await saveTokens(token, refreshToken);

      setUser(newUser);

      return res.data;
    } catch (error) {
      console.log(
        "Register error:",
        error?.response?.data || error?.message
      );

      throw error;
    }
  };

  // EXISTING LOGOUT
  const logout = async () => {
    try {
      await API.get("/user/logout");
    } catch (err) {
      console.log(
        "Logout API error:",
        err?.response?.data || err?.message
      );
    } finally {
      await clearTokens();
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    loading,

    login,
    googleLogin,
    appleLogin,
    register,
    logout,

    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// CUSTOM HOOK
export const useAuth = () => {
  return useContext(AuthContext);
};