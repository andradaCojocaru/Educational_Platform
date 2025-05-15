import React, { createContext, useState, useEffect } from "react";
import apiInstance from "../utils/axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null); // State for username
  const [userRole, setUserRole] = useState(null); // State for user role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiInstance.get("/user/me/");
        setUserName(response.data.full_name); // Set the username
        setUserRole(response.data.role); // Set the user role
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setUserName(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider value={{ userName, userRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};