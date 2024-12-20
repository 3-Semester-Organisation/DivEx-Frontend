import React, {createContext, useState, useEffect} from "react";
import { getSubscriptionTypeFromToken } from "./jwt";
import { usePortfolios } from "./PortfoliosContext";

interface AuthContextType {
  isLoggedin: boolean;
  subscriptionType: string | null;
  setSubscriptionType: (subType: string) => void;
  login: () => void;
  logout: () => void;
}

// Provide a default value for the context
const defaultAuthContext: AuthContextType = {
  isLoggedin: false,
  subscriptionType: null,
  setSubscriptionType: () => {},
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  const { setSelectedPortfolio } = usePortfolios();

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
    const subType = getSubscriptionTypeFromToken();
    setSubscriptionType(subType);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedPortfolioId");
    setSelectedPortfolio(null);
    setIsLoggedin(false);
    setSubscriptionType(null);
  };

  

  return (
    <AuthContext.Provider value={{ isLoggedin, login, logout, subscriptionType, setSubscriptionType }}>
      {children}
    </AuthContext.Provider>
  );
};
