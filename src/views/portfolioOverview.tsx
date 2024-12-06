"use client";
import * as React from "react";
import { toast } from "sonner";
import { useState, useEffect, useContext } from "react";
import { Stock, Portfolio } from "@/divextypes/types";
import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";

import { usePortfolios } from "@/js/PortfoliosContext";
import { createPortfolio, fetchPortfolios, fetchUpdatePortfolioName } from "@/api/portfolio";
import { PortfolioEditDialog } from "@/components/ui/custom/portfolioEditDialog";
import SearchBar from "@/components/divex/searchBar";
import PortfolioTable from "@/components/divex/PortfolioTable";



export default function PortfolioOverview() {
  // PORTFOLIO STATES
  const { portfolios, setPortfolios } = usePortfolios();
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [currency, setCurrency] = useState("DKK");
  const supportedCurrencies: string[] = ["DKK", "SEK", "NOK"];


  async function handlePortfolioCreation(values) {
    const newPortfolio = await createPortfolio(values);

    setPortfolios((prevPortfolios) => [
      ...prevPortfolios,
      newPortfolio
    ]);
  }


  useEffect(() => {
    async function loadPortfolios() {
      const data = await fetchPortfolios();
      setPortfolios(data || []);

      if (!selectedPortfolio && data && data.length > 0) {
        setSelectedPortfolio(data[0]);
        localStorage.setItem("selectedPortfolio", JSON.stringify(data[0]));
      }
    }

    loadPortfolios();
    setSelectedPortfolio(selectedPortfolio);
  }, []);


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
      const data = await fetchUpdatePortfolioName(newName, selectedPortfolio.id);

      console.log("changedNAME", data)

      // Update local state
      const updatedPortfolio = { ...selectedPortfolio, name: data.name };
      setSelectedPortfolio(updatedPortfolio);
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((portfolio) =>
          portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio
        )
      );

      // Update localStorage
      localStorage.setItem("selectedPortfolio", JSON.stringify(updatedPortfolio));

      toast.success("Portfolio name updated.");

    } catch (error: any) {
      console.error("Update portfolio name error", error);
      toast.error(error.message);
    }
  }


  // console.log("portfolios", portfolios)
  // console.log("Localstorage Ports", JSON.parse(localStorage.getItem("selectedPortfolio")))

  // console.log("Selected PORTs", selectedPortfolio)



  return (
    <>
      <div className="flex flex-row items-center gap-4 mt-5">

        {portfolios !== null && (
          <div className="flex flex-col content-center">

            <div className="relative group">
              <h1 className="text-semibold flex text-5xl">{selectedPortfolio ? selectedPortfolio.name : "Select a portfolio"}
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

              <div className="content-center">
                <CreatePortfolioButton
                  onSubmit={handlePortfolioCreation}
                  portfolios={portfolios}
                />
              </div>

              <div>
                <select
                  className="p-2 border-2 border-gray-400 rounded-lg mr-4 ml-4 bg-primary-foreground"
                  onChange={(event) => setCurrency(event.target.value)}
                  defaultValue="DKK"
                >
                  <option value="" disabled>
                    Select a currency
                  </option>
                  {supportedCurrencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <SearchBar />
      </div>



      <div>
        {portfolios === null && (
          <h1 className="text-4xl font-semibold">Create a portfolio to get started</h1>
        )}
      </div>

      <PortfolioTable
        selectedPortfolio={selectedPortfolio}
        currency={currency} />
    </>
  );
}
