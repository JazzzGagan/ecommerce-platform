import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("adminUser");
    const storedToken = localStorage.getItem("adminToken");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedToken) {
      API.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    const userData = response.data.user;
    const token = response.data.token;

    // Check if user has admin role
    if (!userData.roles.includes("admin")) {
      throw new Error("Access denied. Admin role required.");
    }

    setUser(userData);
    localStorage.setItem("adminUser", JSON.stringify(userData));

    if (token) {
      localStorage.setItem("adminToken", token);
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    return response.data;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      delete API.defaults.headers.common.Authorization;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
