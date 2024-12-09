import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { currencyConverter } from "@/js/util";


export default function PortfolioTable({ selectedPortfolio, currency }) {

  const [sort, setSort] = useState({ column: "", direction: "" })

  const navigate = useNavigate();
  function showStockDetails(ticker: string) {
    navigate("/stocks/" + ticker);
  }

  function displayPortfolioValue() {

    let totalPortfolioValue: number = 0;

    selectedPortfolio.portfolioEntries.forEach(entry => {
      const historicalPricing = entry.stock.historicalPricing ?? [];
      const lastElementIndex = historicalPricing.length - 1;
      const latestClosingPrice = historicalPricing[lastElementIndex]?.previousDailyClosingPrice ?? 0;

      totalPortfolioValue += currencyConverter(latestClosingPrice, entry, currency);

    })

    return totalPortfolioValue;
  }



  function calculatePortfolioPercentageChange() {

    const portfolioMarketValue = displayPortfolioValue();

    let totalMoneySpent: number = 0;

    selectedPortfolio.portfolioEntries.forEach(entry => {
      const purchasePrice: number = entry.stockPrice;
      totalMoneySpent += currencyConverter(purchasePrice, entry, currency);
    })

    const percentageChange: number = ((portfolioMarketValue - totalMoneySpent) / totalMoneySpent) * 100;
    console.log("PORTFOLIOMARKETVALUE", portfolioMarketValue)
    console.log("TOTALMONEYSPENT", totalMoneySpent)
    console.log("CHANGE", percentageChange)
    return percentageChange;
  }

  function displayPorfolioPercentageChange() {
    const percentageChange = calculatePortfolioPercentageChange();

    if (percentageChange > 0) {
      return <span className="text-green-700">+{numberFormater(percentageChange)}%</span>;

    } else if (percentageChange === 0) {
      return <span>{numberFormater(percentageChange)}%</span>;

    } else {
      return <span className="text-red-700">{numberFormater(percentageChange)}%</span>;
    }
  }


  function displayStockPercentageChange(percentageValueChange: number) {

    if(percentageValueChange > 0) {
      return <span className="text-green-700">+{numberFormater(percentageValueChange)}%</span>

    } else if(percentageValueChange === 0) {
      return <span>{numberFormater(percentageValueChange)}%</span>

    } else {
      return <span className="text-red-700">{numberFormater(percentageValueChange)}%</span>
    }
  }

  function handleSort(column: string) {

  }

  useEffect(() => {

  }, [sort])

  function numberFormater(value: number) {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }


  return (
    <>
      <div>
        {selectedPortfolio !== null && (
          <div className='w-full bg-primary-foreground shadow-md rounded-lg p-6 mt-5'>

            {selectedPortfolio?.portfolioEntries?.length === 0 && (
              <h1 className="text-4xl font-semibold mb-12">Add stocks to the portfolio</h1>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("Ticker")}>Ticker</TableHead>
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
                    const marketValue = numberFormater(latestClosingPrice * entry.quantity);
                    const percentageValueChange = (((latestClosingPrice - purchasePrice) / purchasePrice) * 100);

                    return (
                      <TableRow
                        onClick={() => showStockDetails(entry.stock.ticker)}
                        className="hover:cursor-pointer"
                        key={entry.stock.ticker}>
                        <TableCell className="text-start font-medium">{entry.stock.ticker}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.name}</TableCell>
                        <TableCell className="text-start font-medium">{latestClosingPrice}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.currency}</TableCell>
                        <TableCell className="text-start font-medium">{entry.quantity}</TableCell>
                        <TableCell className="text-start font-medium">{marketValue}</TableCell>
                        <TableCell className="text-start font-medium">{displayStockPercentageChange(percentageValueChange)}</TableCell>
                      </TableRow>
                    );
                  })
                )}

                {selectedPortfolio?.portfolioEntries?.length > 0 && (
                  <TableRow>
                    <TableCell className="text-start font-semibold">
                      Total:
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-start font-medium">
                      {numberFormater(displayPortfolioValue())} {currency}
                    </TableCell>
                    <TableCell className="text-start font-medium">
                      {displayPorfolioPercentageChange()}
                    </TableCell>
                  </TableRow>
                )}

              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}