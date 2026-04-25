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

  // restore session on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await API.get("/user/me"); // create this API if not exists
      setUser(res.data.user);
    } catch (err) {
      await clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    const res = await API.post("/user/login", { email, password });
    const { token, refreshToken, ...userData } = res.data;
    console.log(res.data);
    await saveTokens(token, refreshToken);
    setUser(userData);
  };

  const register = async (firstname, lastname , email, mobile, password, referralCode) => {
    const res = await API.post("/user/register", { firstname, lastname, email, mobile, password, referralCode });
    const { token, newUser } = res.data;
    await saveTokens(token);
    setUser(newUser);
  };

  // LOGOUT
  const logout = async () => {
    try {
      await API.get("/user/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    await clearTokens();
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// custom hook
export const useAuth = () => useContext(AuthContext);
