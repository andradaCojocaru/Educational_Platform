import React, { createContext, useState, useEffect } from "react";
import apiInstance from "../utils/axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await apiInstance.get("/user/me/");
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ userRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};