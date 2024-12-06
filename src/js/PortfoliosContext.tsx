import React, { createContext, useState, useEffect, useContext } from 'react';
import { Portfolio } from '@/divextypes/types';
import { fetchPortfolios } from "@/api/portfolio"; // Adjust the fetch function as needed

// Define the context type
type PortfoliosContextType = {
  portfolios: Portfolio[] | null;
  setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[] | null>>;
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: React.Dispatch<React.SetStateAction<Portfolio | null>>;
};

// Create the context with a default value
export const PortfoliosContext = createContext<PortfoliosContextType | null>(null);

// Create the Provider component
export const PortfoliosProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[] | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Fetch portfolios from an API or service
    async function fetchAndSetPortfolios() {
      try {
        const data: Portfolio[] = await fetchPortfolios();  // Adjust this call if necessary
        const storedPortfolioId = localStorage.getItem("selectedPortfolioId");
        setPortfolios(data);

        if (storedPortfolioId && data) {
          const foundPortfolio = data.find((portfolio) => portfolio.id.toString() === storedPortfolioId);
          if (foundPortfolio) {
            setSelectedPortfolio(foundPortfolio);
          } else if (data.length > 0) {
            // If stored ID is invalid, default to the first portfolio
            setSelectedPortfolio(data[0]);
            localStorage.setItem('selectedPortfolioId', data[0].id.toString());
          } else {
          }
        } 
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
    }

    fetchAndSetPortfolios();
  }, []);  // Fetch on mount

  useEffect(() => {
    if (!isInitialLoad) {
      if (selectedPortfolio) {
        localStorage.setItem("selectedPortfolioId", selectedPortfolio.id.toString());
      } else {
        localStorage.removeItem("selectedPortfolioId");
      }
    }
  }, [selectedPortfolio, isInitialLoad]);

  return (
    <PortfoliosContext.Provider
      value={{ portfolios, setPortfolios, selectedPortfolio, setSelectedPortfolio }}>
      {children}
    </PortfoliosContext.Provider>
  );
};

// Custom hook for accessing the context
export const usePortfolios = () => {
  const context = useContext(PortfoliosContext);
  if (!context) {
    throw new Error('usePortfolios must be used within a PortfoliosProvider');
  }
  return context;
};
