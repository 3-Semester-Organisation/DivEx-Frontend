"use client";
import * as React from "react";
import { toast } from "sonner";
import { useState, useEffect, useContext } from "react";
import { Stock, Portfolio } from "@/divextypes/types";
import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePortfolios } from "@/js/PortfoliosContext";
import { createPortfolio, fetchPortfolios, fetchUpdatePortfolioName } from "@/api/portfolio";
import { PortfolioEditDialog } from "@/components/ui/custom/portfolioEditDialog";
import SearchBar from "@/components/divex/searchBar";



export default function PortfolioOverview() {
  // PORTFOLIO STATES
  const { portfolios, setPortfolios } = usePortfolios();
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [valuta, setValuta] = useState("SEK");

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


  console.log("portfolios", portfolios)
  console.log("Localstorage Ports", JSON.parse(localStorage.getItem("selectedPortfolio")))

  console.log("Selected PORTs", selectedPortfolio)

  function displayPortfolioValue() {

    let totalPortfolioValue: number = 0;

    selectedPortfolio.portfolioEntries.forEach(entry => {
      const historicalPricing = entry.stock.historicalPricing ?? [];
      const lastElementIndex = historicalPricing.length - 1;
      const latestClosingPrice = historicalPricing[lastElementIndex]?.previousDailyClosingPrice ?? 0;

      totalPortfolioValue += currencyConverter(totalPortfolioValue, entry, latestClosingPrice);

    })

    return totalPortfolioValue;
  }



  function displayPortfolioPercentageChange() {

    const portfolioMarketValue = displayPortfolioValue();

    let totalMoneySpent: number = 0;

    selectedPortfolio.portfolioEntries.forEach(entry => {
      const purchasePrice: number = entry.stockPrice;
      totalMoneySpent += currencyConverter(totalMoneySpent, entry, purchasePrice);
    })

    const percentageChange: number = ((portfolioMarketValue - totalMoneySpent) / totalMoneySpent) * 100;
    console.log("PORTFOLIOMARKETVALUE", portfolioMarketValue)
    console.log("TOTALMONEYSPENT", totalMoneySpent)
    console.log("CHANGE", percentageChange)
    return percentageChange;
  }


  function currencyConverter(totalValue, entry, stockPrice) {
    // TODO fetch realtime currency in the future 
    switch (valuta) {

      case 'DKK': {
        switch (entry.stock.currency) {
          case 'DKK': {
            totalValue += stockPrice * entry.quantity;
            break;
          }
          case 'SEK': {
            totalValue += stockPrice * entry.quantity * 0.65; //1 dkk = 0,65 sek for 05/12-2024 
            break;
          }
          case 'NOK': {
            totalValue += stockPrice * entry.quantity * 0.65; //1 dkk = 0,71 sek for 05/12-2024 
            break;
          }
        }
        break;
      }

      case 'SEK': {
        switch (entry.stock.currency) {
          case 'DKK': {
            totalValue += stockPrice * entry.quantity * 1.54;
            break;
          }
          case 'SEK': {
            totalValue += stockPrice * entry.quantity; //1 dkk = 0,65 sek for 05/12-2024 
            break;
          }
          case 'NOK': {
            totalValue += stockPrice * entry.quantity * 0.99; //1 dkk = 0,71 sek for 05/12-2024 
            break;
          }
        }
        break;
      }

      case 'NOK': {
        switch (entry.stock.currency) {
          case 'DKK': {
            totalValue += stockPrice * entry.quantity * 1.41;
            break;
          }
          case 'SEK': {
            totalValue += stockPrice * entry.quantity * 0.94;
            break;
          }
          case 'NOK': {
            totalValue += stockPrice * entry.quantity;
            break;
          }
            break;
        }
      }

    }
    return totalValue;
  }

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

      <div>

        {selectedPortfolio !== null && (
          <div className='w-full bg-primary-foreground shadow-md rounded-lg p-6 mt-5'>

            {selectedPortfolio?.portfolioEntries?.length === 0 || selectedPortfolio?.portfolioEntries?.length === undefined && (
              <h1 className="text-4xl font-semibold mb-12">Add stocks to the portfolio</h1>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Latest Price</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>no. shares</TableHead>
                  <TableHead>value</TableHead>
                  <TableHead className="p-1">Change</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedPortfolio?.portfolioEntries?.length > 0 && (
                  selectedPortfolio.portfolioEntries.map((entry) => {
                    const historicalPricing = entry.stock.historicalPricing ?? []; // Default to empty array if undefined
                    const lastElementIndex = historicalPricing.length - 1;
                    const latestClosingPrice = historicalPricing[lastElementIndex]?.previousDailyClosingPrice ?? 0;

                    const purchasePrice = entry.stockPrice;
                    const marketValue = new Intl.NumberFormat('en-US').format(latestClosingPrice * entry.quantity);
                    const percentageValueChange = new Intl.NumberFormat('en-US').format((((latestClosingPrice - purchasePrice) / purchasePrice) * 100))
                    return (
                      <TableRow key={entry.stock.ticker}>
                        <TableCell className="text-start font-medium">{entry.stock.ticker}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.name}</TableCell>
                        <TableCell className="text-start font-medium">{latestClosingPrice}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.currency}</TableCell>
                        <TableCell className="text-start font-medium">{entry.quantity}</TableCell>
                        <TableCell className="text-start font-medium">{marketValue}</TableCell>
                        <TableCell className="text-start font-medium">
                          {
                            Number.parseFloat(percentageValueChange) > 0 ? (<span className="text-green-700">+{percentageValueChange}%</span>)
                              : Number.parseFloat(percentageValueChange) === 0 ? (<span>{percentageValueChange}%</span>)
                                : (<span className="text-red-700">{percentageValueChange}%</span>)
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

                <TableRow>
                  <TableCell className="text-start font-semibold">
                    Total:
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-start font-medium">
                    {new Intl.NumberFormat('en-US').format(displayPortfolioValue())} {valuta}
                  </TableCell>
                  <TableCell className="text-start font-medium">
                    {(() => {
                      const percentageChange = displayPortfolioPercentageChange();

                      if (percentageChange > 0) {
                        return <span className="text-green-700">+{new Intl.NumberFormat('en-US').format(percentageChange)}%</span>;
                      } else if (percentageChange === 0) {
                        return <span>{new Intl.NumberFormat('en-US').format(percentageChange)}%</span>;
                      } else {
                        return <span className="text-red-700">{new Intl.NumberFormat('en-US').format(percentageChange)}%</span>;
                      }
                    })()}
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
