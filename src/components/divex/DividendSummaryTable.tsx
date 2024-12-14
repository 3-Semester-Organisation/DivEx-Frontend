import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { stockCurrencyConverter } from '@/js/util';

export default function DividendSummaryTable({ selectedPortfolio, setSelectedPortfolio, currency, numberFormater }) {

  const navigate = useNavigate();

  function displayTotalAnnualDividends() {
    let totalAnnualDividends = 0;

    selectedPortfolio.portfolioEntries.forEach(entry => {
      const dividendRate = entry.stock.dividendRate

      totalAnnualDividends += stockCurrencyConverter(dividendRate, entry, currency);
    })

    return totalAnnualDividends;
  }

  return (
    <div className="w-50% bg-primary-foreground shadow-md rounded-lg p-6 mt-5">
      {selectedPortfolio?.portfolioEntries?.length === 0 && (
        <h2 className="font-semibold text-2xl">Add dividend stocks to see a summary</h2>
      )}

      <div>
        {selectedPortfolio !== null && (
          <div>
            <h2 className='flex justify-start font-semibold text-2xl mb-3'>Dividends Summary</h2>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Ticker</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Yield</TableHead>
                  <TableHead className="text-center">5-Year Avg. Yield</TableHead>
                  <TableHead className="text-center">Ratio</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="text-center">no. shares</TableHead>
                  <TableHead className="text-center">Ex Date</TableHead>
                  <TableHead className="text-center">Currency</TableHead>
                  <TableHead className="text-center">Annual Dividend <i>(Base Currency)</i></TableHead>
                  <TableHead className="text-center">Annual Dividend <i>(Selected Currency)</i></TableHead>
                </TableRow>
              </TableHeader>


              <TableBody>
                {selectedPortfolio?.portfolioEntries?.length > 0 && (

                  selectedPortfolio.portfolioEntries.map(entry => {
                    const dividendYield = entry.stock.dividendYield;
                    const fiveYearAvgDividendYield = entry.stock.fiveYearAvgDividendYield;
                    const dividendRatio = entry.stock.dividendRatio;
                    const dividendRate = entry.stock.dividendRate;

                    const quantity = entry.quantity;
                    const annualDividendBaseCurrency = dividendRate * quantity;
                    const annualDividendSelectedCurrency = stockCurrencyConverter(dividendRate, entry, currency);
                    //filters out stock that do not payout dividends.
                    if (dividendYield === 0 && fiveYearAvgDividendYield === 0 && dividendRatio === 0 && dividendRate === 0) {
                      return;
                    }

                    return (
                      <TableRow
                        className="hover:cursor-pointer"
                        key={entry.stock.ticker}
                        onClick={() => navigate("/stocks/" + entry.stock.ticker)}>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{entry.stock.ticker.slice(0, -3)}</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{entry.stock.name}</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{(dividendYield * 100).toFixed(2)}%</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{(fiveYearAvgDividendYield).toFixed(2)}%</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{(dividendRatio * 100).toFixed(2)}%</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{dividendRate}</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{quantity}</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{new Date(entry.stock.exDividendDate * 1000).toDateString()}</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{entry.stock.currency}</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap text-green-700 font-semibold">{numberFormater(annualDividendBaseCurrency)}</TableCell>
                        <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap text-green-700 font-semibold">{currency} {numberFormater(annualDividendSelectedCurrency)}</TableCell>
                      </TableRow>
                    )
                  })
                )}

                <TableRow>
                  <TableCell className="text-start font-semibold">Total Annual Dividends: </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center text-green-700 font-semibold">{currency} {numberFormater(displayTotalAnnualDividends())}</TableCell>
                </TableRow>
              </TableBody>

            </Table>
          </div>
        )}
      </div>
    </div>
  )
}