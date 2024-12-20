import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { stockCurrencyConverter } from "@/js/util";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PortfolioEntry } from "@/divextypes/types";
import {Button} from "@/components/ui/button";
import {deletePortfolioEntry, fetchUpdatePortfolioName} from "@/api/portfolio";
import {toast} from "sonner";

export default function PortfolioTable({
  selectedPortfolio,
  setSelectedPortfolio,
  currency,
  numberFormater,
}) {
  const [sort, setSort] = useState({ column: "", direction: "asc" });

  const navigate = useNavigate();
  function showStockDetails(ticker: string) {
    navigate("/stocks/" + ticker);
  }

  function displayPortfolioValue() {
    let totalPortfolioValue: number = 0;

    selectedPortfolio.portfolioEntries.forEach((entry) => {
      const historicalPricing = entry.stock.historicalPricing ?? [];
      const lastElementIndex = historicalPricing.length - 1;
      const latestClosingPrice =
        historicalPricing[lastElementIndex]?.previousDailyClosingPrice ?? 0;

      totalPortfolioValue += stockCurrencyConverter(
        latestClosingPrice,
        entry,
        currency
      );
    });

    return totalPortfolioValue;
  }

  function calculatePortfolioPercentageChange() {
    const portfolioMarketValue = displayPortfolioValue();

    let totalMoneySpent: number = 0;

    selectedPortfolio.portfolioEntries.forEach((entry) => {
      const avgPurchasePrice: number = entry.avgAcquiredPrice;
      totalMoneySpent += stockCurrencyConverter(avgPurchasePrice, entry, currency);
    });

    const percentageChange: number =
      ((portfolioMarketValue - totalMoneySpent) / totalMoneySpent) * 100;
    return percentageChange;
  }



  const deleteEntry = async (
      portfolioEntryId: number,
      stockTicker: String
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
      await deletePortfolioEntry(
          portfolioEntryId,
          stockTicker,
          selectedPortfolio.id
      );

      //makes a new list of entries based on selectedPortfolio's entries and filtering out
      //the entry set to be deleted, and then setting selectedPortfolio to the new list
      let deletedPortfolioEntryList = [...selectedPortfolio.portfolioEntries]
          .filter((entry) => entry.id !== portfolioEntryId);

      setSelectedPortfolio({
        ...selectedPortfolio,
        portfolioEntries: deletedPortfolioEntryList,
      });

      toast.success("Entry deleted.");
    } catch (error: any) {
      console.error("Delete portfolio entry error", error);
      toast.error(error.message);
    }
  };

  function getLatestClosingPrice(entry: PortfolioEntry) {
    const historicalPricing = entry.stock.historicalPricing ?? [];
    const lastElementIndex = historicalPricing.length - 1;
    return historicalPricing[lastElementIndex]?.previousDailyClosingPrice ?? 0;
  }

  function calculateStockPercentageChange(entry: PortfolioEntry) {
    const latestClosingPrice = getLatestClosingPrice(entry);
    const avgPurchasePrice = entry.avgAcquiredPrice;
    const stockPercentageChange =
      ((latestClosingPrice - avgPurchasePrice) / avgPurchasePrice) * 100;
    return stockPercentageChange;
  }



  function displayPercentageChange(percentageValueChange: number) {
    if (percentageValueChange > 0) {
      return (
        <span className="text-green-700">
          +{numberFormater(percentageValueChange)}%
        </span>
      );
    } else if (percentageValueChange === 0) {
      return <span>{numberFormater(percentageValueChange)}%</span>;
    } else {
      return (
        <span className="text-red-700">
          {numberFormater(percentageValueChange)}%
        </span>
      );
    }
  }



  function displayChange(change: number) {
    if (change > 0) {
      return (
        <span className="text-green-700">
          +{numberFormater(change)} {currency}
        </span>
      );
    } else if (change === 0) {
      return <span>{numberFormater(change)} {currency}</span>;
    } else {
      return (
        <span className="text-red-700">
          {numberFormater(change)} {currency}
        </span>
      );
    }
  }



  function handleCoulmnClick(column: string) {
    const columnHeader = column.toLocaleLowerCase();
    setSort((previous) => ({
      column: columnHeader,
      direction:
        columnHeader === previous.column && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  function renderSortIndicator(column: string) {
    const columnHeader = column.toLocaleLowerCase();
    if (sort.column === columnHeader) {
      return sort.direction === "asc" ? (
        <ChevronUp className="inline-block h-4 w-4" />
      ) : (
        <ChevronDown className="inline-block h-4 w-4" />
      );
    }
    return ""; // No indicator if the column is not currently sorted
  }

  function sortColumn() {
    const columnToSort = sort.column;
    const sortingDirection = sort.direction;
    const ASCENDING = "asc";

    if (selectedPortfolio === null || selectedPortfolio.portfolioEntries === null) {
      return;
    }

    let sortedPortfolioEntries = [...selectedPortfolio.portfolioEntries];

    switch (columnToSort.toLocaleLowerCase()) {
      case "ticker": {
        sortingDirection === ASCENDING
          ? sortedPortfolioEntries.sort((entryA, entryB) =>
            entryA.stock.name.localeCompare(entryB.stock.name)
          )
          : sortedPortfolioEntries.sort((entryA, entryB) =>
            entryB.stock.name.localeCompare(entryA.stock.name)
          );
        break;
      }

      case "stock": {
        sortingDirection === ASCENDING
          ? sortedPortfolioEntries.sort((entryA, entryB) =>
            entryA.stock.name.localeCompare(entryB.stock.name)
          )
          : sortedPortfolioEntries.sort((entryA, entryB) =>
            entryB.stock.name.localeCompare(entryA.stock.name)
          );
        break;
      }

      case "latest price": {
        sortedPortfolioEntries.sort((entryA, entryB) => {
          const lateClosingPriceA = getLatestClosingPrice(entryA);
          const lateClosingPriceB = getLatestClosingPrice(entryB);

          return sortingDirection === ASCENDING
            ? lateClosingPriceA - lateClosingPriceB
            : lateClosingPriceB - lateClosingPriceA;
        });
        break;
      }

      case "no. shares": {
        sortingDirection === ASCENDING
          ? sortedPortfolioEntries.sort(
            (entryA, entryB) => entryA.quantity - entryB.quantity
          )
          : sortedPortfolioEntries.sort(
            (entryA, entryB) => entryB.quantity - entryA.quantity
          );
        break;
      }

      case "value": {
        sortedPortfolioEntries.sort((entryA, entryB) => {
          const stockValueA = getLatestClosingPrice(entryA) * entryA.quantity;
          const stockValueB = getLatestClosingPrice(entryB) * entryB.quantity;

          return sortingDirection === ASCENDING
            ? stockValueA - stockValueB
            : stockValueB - stockValueA;
        });
        break;
      }

      case "change": {
        sortedPortfolioEntries.sort((entryA, entryB) => {
          const stockPercentageChangeA = calculateStockPercentageChange(entryA);
          const stockPercentageChangeB = calculateStockPercentageChange(entryB);

          return sortingDirection === ASCENDING
            ? stockPercentageChangeA - stockPercentageChangeB
            : stockPercentageChangeB - stockPercentageChangeA;
        });
        break;
      }
    }

    setSelectedPortfolio({
      ...selectedPortfolio,
      portfolioEntries: sortedPortfolioEntries,
    });
  }

  useEffect(() => {
    sortColumn();
  }, [sort]);

  const tableHeads = [
    "Ticker",
    "Stock",
    "Latest Price",
    "Avg. Acquired Price",
    "Currency",
    "No. shares",
    "Value (Base Currency)",
    "Value (Selected Currency)",
    "P/L",
    "Change",
    "Action"
  ];



  function calculateProfitLoss(entry: PortfolioEntry) {
    const avgAcquiredPrice = entry.avgAcquiredPrice
    let valueSincePurchase = stockCurrencyConverter(avgAcquiredPrice, entry, currency);

    return valueSincePurchase * (calculateStockPercentageChange(entry) / 100)
  }



  function summarizeProfitLoss() {
    let totalProfitLoss = 0;

    selectedPortfolio.portfolioEntries.forEach(entry => {
      totalProfitLoss += calculateProfitLoss(entry);
    });

    return totalProfitLoss;
  }



  return (
    <>
      <div>
        {selectedPortfolio !== null && (
          <div className="bg-primary-foreground shadow-md rounded-lg p-6 mt-5">
            {(selectedPortfolio?.portfolioEntries?.length === 0 || selectedPortfolio.portfolioEntries === null) && (
              <h1 className="text-4xl font-semibold mb-12">
                Add stocks to the portfolio
              </h1>
            )}

            <h2 className='flex justify-start font-semibold text-2xl mb-3'>Your stocks</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeads.map((head) => (
                    <TableHead
                      key={head}
                      className="hover: cursor-pointer truncate text-center"
                      onClick={() => handleCoulmnClick(head)}
                    >
                      {head} {renderSortIndicator(head)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedPortfolio?.portfolioEntries?.length > 0 && (
                  selectedPortfolio.portfolioEntries.map((entry) => {
                    const latestClosingPrice = getLatestClosingPrice(entry);
                    const marketValueBaseCurrency = numberFormater(
                      latestClosingPrice * entry.quantity
                    );
                    const marketValueSelectedCurrency = stockCurrencyConverter(
                      latestClosingPrice,
                      entry,
                      currency
                    );

                    const stockPercentageChange = calculateStockPercentageChange(entry);

                    const cellData = [
                      entry.stock.ticker.slice(0, -3),
                      entry.stock.name,
                      latestClosingPrice,
                      numberFormater(entry.avgAcquiredPrice),
                      entry.stock.currency,
                      entry.quantity,
                      marketValueBaseCurrency,
                      `${numberFormater(marketValueSelectedCurrency)} ${currency}`,
                      displayChange(calculateProfitLoss(entry)),
                      displayPercentageChange(stockPercentageChange),
                    ];

                    return (
                      <TableRow
                        onClick={() => showStockDetails(entry.stock.ticker)}
                        className="hover:cursor-pointer"
                        key={entry.stock.ticker}
                      >
                        {cellData.map((cell, index) => (
                          <TableCell className="text-center truncate" key={index}>
                            {cell}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                              variant={"destructive"}
                              onClick={(event)=>{
                                  event.stopPropagation()
                                  deleteEntry(entry.id, entry.stock.ticker)
                                }
                              }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

                {selectedPortfolio?.portfolioEntries?.length > 0 && (
                  <TableRow>
                    <TableCell className="text-center font-semibold">
                      Total:
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>

                    <TableCell className="font-medium text-center">
                      {currency} {numberFormater(displayPortfolioValue())}
                    </TableCell>

                    <TableCell>
                      {displayChange(summarizeProfitLoss())}
                    </TableCell>

                    <TableCell className="font-medium text-center">
                      {displayPercentageChange(calculatePortfolioPercentageChange())}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
