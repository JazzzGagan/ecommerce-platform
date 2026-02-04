import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
      }
    }

    setLoading(false);
  }, []);

  const persistAuth = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authToken", tokenValue);
  };

  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    const { user: userData, token: tokenValue } = response.data;
    persistAuth(userData, tokenValue);
    return response;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // ignore logout errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      setAuth: persistAuth,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
