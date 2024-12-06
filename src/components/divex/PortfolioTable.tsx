import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";







export default function PortfolioTable({ selectedPortfolio, currency }) {

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
        return percentageChange;
      }
    
    
      function currencyConverter(totalValue, entry, stockPrice) {
        // TODO fetch realtime currency in the future 
        switch (currency) {
    
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

    return (<div>

        {selectedPortfolio !== null && (
            <div className='bg-primary-foreground shadow-md rounded-lg p-2'>

                {selectedPortfolio?.portfolioEntries?.length === 0 || selectedPortfolio?.portfolioEntries?.length === undefined && (
                    <h1 className="text-4xl font-semibold mb-12">Add stocks to the portfolio</h1>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Ticker</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Latest Price</TableHead>
                            <TableHead className="text-center">Currency</TableHead>
                            <TableHead className="text-center">no. shares</TableHead>
                            <TableHead className="text-center">value</TableHead>
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
                                    <TableRow 
                                        onClick={() => showStockDetails(entry.stock.ticker)}
                                        className="hover:cursor-pointer"
                                        key={entry.stock.ticker}>
                                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{entry.stock.ticker.slice(0, -3)}</TableCell>
                                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{entry.stock.name}</TableCell>
                                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{latestClosingPrice}</TableCell>
                                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{entry.stock.currency}</TableCell>
                                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{entry.quantity}</TableCell>
                                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{marketValue}</TableCell>
                                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">
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
                                {new Intl.NumberFormat('en-US').format(displayPortfolioValue())} {currency}
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
    </div>)
}