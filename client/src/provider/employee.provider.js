"use client"

import { useEmployeeAuth } from "@/hooks/useEmployeeAuth"
import { createContext, useContext } from "react";

const EmployeeAuthContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const { isLogin, userInfo } = useEmployeeAuth();

  return (
    <EmployeeAuthContext.Provider value={{ isLogin, userInfo }}>
      {children}
    </EmployeeAuthContext.Provider>
  )
}

export const useEmployeeAuthContext = () => {
  const context = useContext(EmployeeAuthContext);
  if (context === null) {
    throw new Error("useEmployeeAuthContext must be used within an EmployeeProvider");
  }
  return context;
}