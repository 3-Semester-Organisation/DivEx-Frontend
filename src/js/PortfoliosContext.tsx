import React, { createContext, useState, useEffect } from 'react';
import { Portfolio } from '@/divextypes/types';
import { fetchPortfolios } from "@/api/portfolio"; // Adjust the fetch function as needed

// Define the context type
type PortfoliosContextType = {
  portfolios: Portfolio[] | null;
  setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[] | null>>;
};

// Create the context with a default value
export const PortfoliosContext = createContext<PortfoliosContextType | null>(null);

// Create the Provider component
export const PortfoliosProvider: React.FC = ({ children }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[] | null>(null);

  useEffect(() => {
    // Fetch portfolios from an API or service
    async function fetchAndSetPortfolios() {
      try {
        const data: Portfolio[] = await fetchPortfolios();  // Adjust this call if necessary
        setPortfolios(data);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
    }

    fetchAndSetPortfolios();
  }, []);  // Fetch on mount

  return (
    <PortfoliosContext.Provider value={{ portfolios, setPortfolios }}>
      {children}
    </PortfoliosContext.Provider>
  );
};

// Custom hook for accessing the context
export const usePortfolios = () => {
  const context = React.useContext(PortfoliosContext);
  if (!context) {
    throw new Error('usePortfolios must be used within a PortfoliosProvider');
  }
  return context;
};