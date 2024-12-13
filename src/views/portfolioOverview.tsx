"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";

import { usePortfolios } from "@/js/PortfoliosContext";
import {
  createPortfolio, deletePortfolio, deletePortfolioEntry,
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
import { Portfolio, PortfolioEntry } from "@/divextypes/types";
import { getSubscriptionTypeFromToken } from "@/js/jwt";
import { SquareArrowOutUpRight } from "lucide-react";
import DividendBarChart from "@/components/divex/DividendBarChart";
import { PortfolioGoalProgress } from "@/components/ui/custom/portfolio-goal-progress";
import { updatePortfolioGoal } from "@/api/portfolio";
import { PortfolioGoalDialog } from "@/components/ui/custom/portfolio-goal-dialog";

export default function PortfolioOverview() {
  // SUBSCRIPTION TYPE
  const subType = getSubscriptionTypeFromToken();

  // PORTFOLIO STATES
  const { portfolios, setPortfolios, selectedPortfolio, setSelectedPortfolio } = usePortfolios();

  const [currency, setCurrency] = useState("DKK");
  const supportedCurrencies: string[] = ["DKK", "SEK", "NOK"];
  const [isDisplayingDividendSummary, setIsDisplayingDividendSummary] = useState(false);
  const [summarizedPortfolio, setSummarizedPortfolio] = useState<Portfolio>(null)
  
  useCheckCredentials();

  useEffect(() => {
    async function loadPortfolios() {
      const fetchedPortfolios = await fetchPortfolios();
      setPortfolios(fetchedPortfolios || []);

      if(!selectedPortfolio && fetchedPortfolios.length > 0 ) {
        setSelectedPortfolio(fetchedPortfolios[0])
        console.log("New login portfolio set")
        console.log("fetched data", fetchedPortfolios[0])
        return;
      }
      
      //sets the selected portfolio to the one that was selected last. Since setting state is asynchronize, make use of the variable instead.
      const selectedPortfolioId = localStorage.getItem("selectedPortfolioId");
      const cachedSelectedPortfolio = fetchedPortfolios.find(portfolio => portfolio.id.toString() === selectedPortfolioId)
      setSelectedPortfolio(cachedSelectedPortfolio);
      console.log("Not new login set cached POrtfolio")
    }

    loadPortfolios();
  }, []);



  useEffect(() => {
    summarizePortfolioEntries();
  }, [selectedPortfolio, portfolios])



  function summarizePortfolioEntries() {

    const summarizedEntries = [];
    let totalCost = 0;
    let totalNumberOfShares = 0;
    let avgAcquiredPrice = 0;
    let previousEntry = null;

    if (selectedPortfolio && selectedPortfolio.portfolioEntries !== null) {

      const portfolioEntries = selectedPortfolio.portfolioEntries;
      portfolioEntries.sort((a, b) => a.stock.name.localeCompare(b.stock.name));

      for (const currentEntry of portfolioEntries) {

        if (previousEntry !== null && previousEntry.stock.name.toLowerCase() === currentEntry.stock.name.toLowerCase()) {
          totalCost += currentEntry.stockPrice * currentEntry.quantity;
          totalNumberOfShares += currentEntry.quantity;
        } else {

          if (previousEntry !== null) {
            avgAcquiredPrice = totalCost / totalNumberOfShares;
            summarizedEntries.push({
              ...previousEntry,
              avgAcquiredPrice: avgAcquiredPrice.toFixed(2),
              quantity: totalNumberOfShares,
            });
          }

          previousEntry = currentEntry;
          totalCost = currentEntry.stockPrice * currentEntry.quantity;
          totalNumberOfShares = currentEntry.quantity;
        }
      }

      if (previousEntry !== null) {
        avgAcquiredPrice = totalCost / totalNumberOfShares;
        summarizedEntries.push({
          ...previousEntry,
          avgAcquiredPrice: avgAcquiredPrice.toFixed(2),
          quantity: totalNumberOfShares,
        });
      }
    }

    const updatedPortfolio = {
      ...selectedPortfolio,
      portfolioEntries: summarizedEntries,
    };

    setSummarizedPortfolio(updatedPortfolio);
  }



  async function handlePortfolioCreation(values) {
    const newPortfolio = await createPortfolio(values);
    setPortfolios((prevPortfolios) => [...prevPortfolios, newPortfolio]);
    setSelectedPortfolio(newPortfolio);
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

  function numberFormater(value: number) {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const onUpdatePortfolioGoal = async (goal: number) => {
    if (!selectedPortfolio) {
      toast.error("No portfolio selected.");
      return;
    }
    try {
      const updatedPortfolio = await updatePortfolioGoal(selectedPortfolio.id, goal);
      setSelectedPortfolio(updatedPortfolio);

      toast.success("Portfolio goal updated.");
    } catch (error: any) {
      console.error("Update portfolio goal error", error);
      toast.error(error.message);
    }
  }

  const deleteSelectedPortfolio = async (
      portfolioId: number,
      portfolioName: String
  ) => {
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
      await deletePortfolio(
          portfolioId,
          portfolioName
      );

      setPortfolios((prevPortfolios) => prevPortfolios
          .filter((portfolio) => portfolio.id !== portfolioId));

      //the shortening of portfolios.length seems to happen after the scope ends,
      //not within, which means the following if-statement has to be +1. Technically,
      //when we delete the last portfolio, the length is registered as 1 in this scope
      //and thus we are checking it this way. Seems a quirk of either JS or React.
      if(portfolios.length > 1) {
        setSelectedPortfolio(portfolios[0])
      }else{
        setSelectedPortfolio(null)
      }

      toast.success("Portfolio deleted.");
    } catch (error: any) {
      console.error("Delete portfolio error", error);
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="relative group flex">
        <h1 className="text-semibold flex text-5xl mr-5">
          {selectedPortfolio ? selectedPortfolio.name : "Select a portfolio"}
          <PortfolioEditDialog
            onSubmit={changePortfolioName}
            selectedPortfolio={selectedPortfolio}
          />
        </h1>

        {selectedPortfolio && selectedPortfolio.goal !== 0 && (
          <PortfolioGoalProgress
            currency={currency}
          />
        )}
      </div>

      <div className="flex flex-row content-center gap-3 pt-5">
        <div>
          {selectedPortfolio && (
              <PortfolioSelect
                  portfolioList={portfolios}
                  selectedPortfolio={selectedPortfolio}
                  setSelectedPortfolio={setSelectedPortfolio}
              />
          )}
        </div>

        <div>
          <CreatePortfolioButton
              onSubmit={handlePortfolioCreation}
              portfolios={portfolios}
          />
        </div>

        <div>
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

        {/* Set portfolio goal */}
        <div>
          <PortfolioGoalDialog
              selectedPortfolio={selectedPortfolio}
              onSubmit={onUpdatePortfolioGoal}
          />
        </div>

        <div>
          <CurrencySelect
              selectedCurrency={currency}
              setSelectedCurrency={setCurrency}
              supportedCurrencies={supportedCurrencies}
          />
        </div>

        {portfolios?.length > 0 && (
          <div>
            <Button
                variant="destructive"
                onClick={() =>
                    deleteSelectedPortfolio(
                        selectedPortfolio.id, selectedPortfolio.name
                    )
                }
            >
              Delete
            </Button>
          </div>
        )}

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
                Share
                <SquareArrowOutUpRight/>
              </Button>
            </div>
        )}


        <div className="w-80 ml-auto">
          <SearchBar
              placeholder={"Search for stocks to add..."}/>
        </div>
      </div>


      <div>
        {portfolios?.length === 0 && (
            <h1 className="text-4xl font-semibold mt-20">
              Create a portfolio to get started
            </h1>
        )}

        {selectedPortfolio && (
            <div className="grid grid-cols-12">
            <div className="col-span-4 mt-5">
              <PortfolioChart selectedPortfolio={summarizedPortfolio} />
            </div>

            <div className="col-span-8 mt-5">
              {isDisplayingDividendSummary && (
                <DividendBarChart
                  selectedPortfolio={summarizedPortfolio}
                  currency={currency} />
              )}
            </div>

            <div className="col-span-12">
              {isDisplayingDividendSummary ? (
                <DividendSummaryTable
                  selectedPortfolio={summarizedPortfolio}
                  setSelectedPortfolio={setSummarizedPortfolio}
                  currency={currency}
                  numberFormater={numberFormater}
                />
              ) : (
                <PortfolioTable
                  selectedPortfolio={summarizedPortfolio}
                  setSelectedPortfolio={setSummarizedPortfolio}
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
