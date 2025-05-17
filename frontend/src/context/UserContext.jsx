import React, { createContext, useState, useEffect } from "react";
import apiInstance from "../utils/axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const response = await apiInstance.get("/user/me/");
      setUserName(response.data.full_name);
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setUserName(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // 🧼 Logout function
  const logout = () => {
    setUserName(null);
    setUserRole(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <UserContext.Provider value={{ userName, userRole, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
