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

export default function DividendSummaryTable( {selectedPortfolio, currency, currencyConverter} ) {

const navigate = useNavigate();

  function displayTotalAnnualDividends() {
    let totalAnnualDividends = 0;

    selectedPortfolio.portfolioEntries.forEach( entry => {
      const dividendRate = entry.stock.dividendRate

      totalAnnualDividends += currencyConverter(dividendRate, entry, currency);
    })

    return totalAnnualDividends;
  }

    return(
        <div className="w-50% bg-primary-foreground shadow-md rounded-lg p-6 mt-5">
        {selectedPortfolio?.portfolioEntries?.length === 0 && (
          <h2>Add dividend stocks to see a summary</h2>
        )}

        <div>
          {selectedPortfolio !== null && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Yield</TableHead>
                  <TableHead>5-Year Avg. Yield</TableHead>
                  <TableHead>Ratio</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>no. shares</TableHead>
                  <TableHead>Ex Date</TableHead>
                  <TableHead>Annual Dividend</TableHead>
                </TableRow>
              </TableHeader>


              <TableBody>
                {selectedPortfolio?.portfolioEntries?.length > 0 && (

                  selectedPortfolio.portfolioEntries.map(entry => {
                    const dividendYield = entry.stock.dividendYield;
                    const fiveYearAvgDividendYield = entry.stock.fiveYearAvgDividendYield;
                    const dividendRatio = entry.stock.dividendRatio;
                    const dividendRate = entry.stock.dividendRate;

                    if(dividendYield === 0 && fiveYearAvgDividendYield === 0 && dividendRatio === 0 && dividendRate === 0) {
                      return;
                    }

                    return (
                      <TableRow
                        className="hover:cursor-pointer"
                        onClick={() => navigate("/stocks/" + entry.stock.ticker)}>
                        <TableCell className="text-start">{entry.stock.ticker}</TableCell>
                        <TableCell className="text-start">{entry.stock.name}</TableCell>
                        <TableCell className="text-start">{(dividendYield * 100).toFixed(2)}%</TableCell>
                        <TableCell className="text-start">{(fiveYearAvgDividendYield).toFixed(2)}%</TableCell>
                        <TableCell className="text-start">{(dividendRatio * 100).toFixed(2)}%</TableCell>
                        <TableCell className="text-start">{entry.stock.currency}</TableCell>
                        <TableCell className="text-start">{dividendRate}</TableCell>
                        <TableCell className="text-start">{entry.quantity}</TableCell>
                        <TableCell className="text-start">{new Date(entry.stock.exDividendDate * 1000).toDateString()}</TableCell>
                        <TableCell className="text-start text-green-700 font-semibold">{new Intl.NumberFormat('en-US').format(entry.stock.dividendRate * entry.quantity)}</TableCell>
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
                  <TableCell className="text-start text-green-700 font-semibold"> {new Intl.NumberFormat('en-US').format(displayTotalAnnualDividends())} {currency}</TableCell>
                </TableRow>
              </TableBody>

            </Table>
          )}
        </div>
      </div>
    )
}