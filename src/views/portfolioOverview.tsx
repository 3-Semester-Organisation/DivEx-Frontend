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
import { Button } from "@/components/ui/button";

import useCheckCredentials from "@/js/useCredentials";
import DividendSummaryTable from "@/components/divex/DividendSummaryTable";
import { stockCurrencyConverter } from "@/js/util";
import { Portfolio } from "@/divextypes/types";
import { getSubscriptionTypeFromToken } from "@/js/jwt";
import { SquareArrowOutUpRight } from "lucide-react";

export default function PortfolioOverview() {
  // SUBSCRIPTION TYPE
  const subType = getSubscriptionTypeFromToken();
  // PORTFOLIO STATES
  const { portfolios, setPortfolios, selectedPortfolio, setSelectedPortfolio } =
    usePortfolios();

  const [currency, setCurrency] = useState("DKK");
  const supportedCurrencies: string[] = ["DKK", "SEK", "NOK"];
  const [isDisplayingDividendSummary, setIsDisplayingDividendSummary] =
    useState(false);

  useCheckCredentials();

  async function handlePortfolioCreation(values) {
    const newPortfolio = await createPortfolio(values);
    setPortfolios((prevPortfolios) => [...prevPortfolios, newPortfolio]);
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

  function numberFormater(value: number) {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <>
      <div className="relative group">
        <h1 className="text-semibold flex text-5xl">
          {selectedPortfolio ? selectedPortfolio.name : "Select a portfolio"}
          <PortfolioEditDialog
            onSubmit={changePortfolioName}
            selectedPortfolio={selectedPortfolio}
          />
        </h1>
      </div>

      <div className="flex flex-row content-center gap-3 pt-5">
        <div className="">
          {selectedPortfolio && (
            <PortfolioSelect
              portfolioList={portfolios}
              selectedPortfolio={selectedPortfolio}
              setSelectedPortfolio={setSelectedPortfolio}
            />
          )}
        </div>

        <div className="">
          <CreatePortfolioButton
            onSubmit={handlePortfolioCreation}
            portfolios={portfolios}
          />
        </div>

        <div className="">
          {selectedPortfolio && (
            <>
              <Button
                variant="default"
                onClick={() =>
                  setIsDisplayingDividendSummary(!isDisplayingDividendSummary)
                }
              >
                {isDisplayingDividendSummary ? "Show Stocks" : "Show Dividends"}
              </Button>
            </>
          )}
        </div>

        <div>
          <CurrencySelect
            selectedCurrency={currency}
            setSelectedCurrency={setCurrency}
            supportedCurrencies={supportedCurrencies}
          />
        </div>

        {subType === "PREMIUM" && portfolios?.length > 0 && (
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                if (selectedPortfolio) {
                  //sharePortfolio(selectedPortfolio); //logic here
                  toast.info("Feature coming soon.");
                } else {
                  toast.error("No portfolio selected.");
                }
              }}
            >
              Share Portfolio
              <SquareArrowOutUpRight />
            </Button>
          </div>
        )}

        <div className="w-80 ml-auto">
          <SearchBar />
        </div>
      </div>

      <div>
        {portfolios?.length === 0 && (
          <h1 className="text-4xl font-semibold">
            Create a portfolio to get started
          </h1>
        )}

        {selectedPortfolio && (
          <div className="grid grid-cols-12">
            <div className="col-span-4 mt-5">
              <PortfolioChart selectedPortfolio={selectedPortfolio} />
            </div>

            <div className="col-span-12">
              {!isDisplayingDividendSummary ? (
                <PortfolioTable
                  selectedPortfolio={selectedPortfolio}
                  setSelectedPortfolio={setSelectedPortfolio}
                  currency={currency}
                  numberFormater={numberFormater}
                />
              ) : (
                <DividendSummaryTable
                  selectedPortfolio={selectedPortfolio}
                  setSelectedPortfolio={setSelectedPortfolio}
                  currency={currency}
                  numberFormater={numberFormater}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
