"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";

import { usePortfolios } from "@/js/PortfoliosContext";
import {
  createPortfolio,
  fetchUpdatePortfolioName,
} from "@/api/portfolio";
import { PortfolioEditDialog } from "@/components/ui/custom/portfolioEditDialog";
import SearchBar from "@/components/divex/searchBar";
import PortfolioTable from "@/components/divex/PortfolioTable";
import { PortfolioChart } from "@/components/ui/custom/pie-chart";
import { CurrencySelect } from "@/components/ui/custom/currency-select";

export default function PortfolioOverview() {
  // PORTFOLIO STATES
  const { portfolios, setPortfolios, selectedPortfolio, setSelectedPortfolio } = usePortfolios();
    
  const [currency, setCurrency] = useState("DKK");
  const supportedCurrencies: string[] = ["DKK", "SEK", "NOK"];

  async function handlePortfolioCreation(values) {
    const newPortfolio = await createPortfolio(values);

    setPortfolios((prevPortfolios) => [...prevPortfolios, newPortfolio]);
  }

  const changePortfolioName = async (newName: string) => {
    const token = localStorage.getItem("token");
    if (!selectedPortfolio) {
      toast.error("No portfolio selected.");
      return;
    }
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    try {
      const data = await fetchUpdatePortfolioName(
        newName,
        selectedPortfolio.id
      );

      // Update local state
      const updatedPortfolio = { ...selectedPortfolio, name: data.name };
      setSelectedPortfolio(updatedPortfolio);
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((portfolio) =>
          portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio
        )
      );

      toast.success("Portfolio name updated.");
    } catch (error: any) {
      console.error("Update portfolio name error", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center gap-4 mt-5">
        {portfolios !== null && (
          <div className="flex flex-col content-center">
            <div className="relative group">
              <h1 className="text-semibold flex text-5xl">
                {selectedPortfolio
                  ? selectedPortfolio.name
                  : "Select a portfolio"}
                <PortfolioEditDialog
                  onSubmit={changePortfolioName}
                  selectedPortfolio={selectedPortfolio}
                />
              </h1>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <PortfolioSelect
                portfolioList={portfolios}
                selectedPortfolio={selectedPortfolio}
                setSelectedPortfolio={setSelectedPortfolio}
              />              
                <CreatePortfolioButton
                  onSubmit={handlePortfolioCreation}
                  portfolios={portfolios}
                />
              
                <CurrencySelect
                  supportedCurrencies={supportedCurrencies}
                  selectedCurrency={currency}
                  setSelectedCurrency={setCurrency}
                />
            </div>
          </div>
        )}

        <SearchBar />
      </div>

      <div className="grid grid-cols-12 mt-5">
        <div className="col-span-7">
      <PortfolioTable
        selectedPortfolio={selectedPortfolio}
        currency={currency}
          />
        </div>
        <div className="col-span-4 col-end-13">
          <PortfolioChart selectedPortfolio={selectedPortfolio} />
          </div>
      </div>
    </>
  );
}
