import * as React from "react";
import { createContext, useState, useEffect } from "react";
import { getSubscriptionTypeFromToken } from "./jwt";

interface AuthContextType {
  isLoggedin: boolean;
  subscriptionType: string | null;
  updateSubscriptionType: (subType: string) => void;
  login: () => void;
  logout: () => void;
}

// Provide a default value for the context
const defaultAuthContext: AuthContextType = {
  isLoggedin: false,
  subscriptionType: null,
  updateSubscriptionType: () => {},
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedin(true);
      try {
        const subType = getSubscriptionTypeFromToken();
        setSubscriptionType(subType);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  // Function to handle login
  const login = () => {
    setIsLoggedin(true);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedin(false);
  };

  // Function to update subscription type
  const updateSubscriptionType = (subType: string) => { 
    setSubscriptionType(subType);
  }

  return (
    <AuthContext.Provider value={{ isLoggedin, login, logout, subscriptionType, updateSubscriptionType }}>
      {children}
    </AuthContext.Provider>
  );
};
