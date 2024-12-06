"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";

import { usePortfolios } from "@/js/PortfoliosContext";
import {
  createPortfolio,
  fetchPortfolios,
  fetchUpdatePortfolioName,
} from "@/api/portfolio";
import { PortfolioEditDialog } from "@/components/ui/custom/portfolioEditDialog";
import SearchBar from "@/components/divex/searchBar";
import PortfolioTable from "@/components/divex/PortfolioTable";
import { PortfolioChart } from "@/components/ui/custom/pie-chart";
import { CurrencySelect } from "@/components/ui/custom/currency-select";

import useCheckCredentials from "@/js/useCredentials";
import DividendSummaryTable from "@/components/divex/DividendSummaryTable";
import { currencyConverter } from "@/js/util";
import { Portfolio } from "@/divextypes/types";



export default function PortfolioOverview() {
  // PORTFOLIO STATES
  const { portfolios, setPortfolios, selectedPortfolio, setSelectedPortfolio } = usePortfolios();

  const [currency, setCurrency] = useState("DKK");
  const supportedCurrencies: string[] = ["DKK", "SEK", "NOK"];
  const [isDisplayingDividendSummary, setIsDisplayingDividendSummary] = useState(false)


  useCheckCredentials();


  async function handlePortfolioCreation(values) {
    const newPortfolio = await createPortfolio(values);

    // might be redundant? idk
    // setPortfolios((prevPortfolios) => [...prevPortfolios, newPortfolio]);
  }

  useEffect(() => {
    function getLatestPortfolio(portfolios: Portfolio[]) {
      const lastElement = portfolios.length - 1;
      return portfolios[lastElement];
    }

    if (portfolios?.length > 0) {
      setSelectedPortfolio(getLatestPortfolio(portfolios));
    }
  }, [portfolios]);


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

            {selectedPortfolio && (
              <PortfolioSelect
                portfolioList={portfolios}
                selectedPortfolio={selectedPortfolio}
                setSelectedPortfolio={setSelectedPortfolio}
              />
            )}

            <div className="content-center">
              <CreatePortfolioButton
                onSubmit={handlePortfolioCreation}
                portfolios={portfolios}
              />
            </div>

            {selectedPortfolio && (
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

                <button
                  className={isDisplayingDividendSummary ? "hover:underline bg-primary-foreground p-2 rounded-lg border-2 border-gray-400 font-bold shadow-lg"
                    : "hover:underline bg-primary-foreground p-2 rounded-lg border-2 border-gray-400"}
                  onClick={() => setIsDisplayingDividendSummary(!isDisplayingDividendSummary)}>
                  {isDisplayingDividendSummary ? "Dividends" : "Dividends"}
                </button>
              </div>
            )}

          </div>
        </div>

        <SearchBar />
      </div>


      <div>
        {portfolios !== null && (
          <div>
            {portfolios === null && (
              <h1 className="text-4xl font-semibold">Create a portfolio to get started</h1>
            )}
          </div>
        )}

        {selectedPortfolio && !isDisplayingDividendSummary && (
          <div className="flex flex-col">

            <div className="flex justify-center items-center w-[30%] mt-5">
              <PortfolioChart selectedPortfolio={selectedPortfolio} />
            </div>

            <PortfolioTable
              selectedPortfolio={selectedPortfolio}
              currency={currency}
            />
          </div>
        )}


        {isDisplayingDividendSummary && (
          <DividendSummaryTable
            selectedPortfolio={selectedPortfolio}
            currency={currency}
            currencyConverter={currencyConverter} />
        )}
      </div>
    </>
  );
}
