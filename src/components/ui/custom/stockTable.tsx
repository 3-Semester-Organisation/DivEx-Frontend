import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Stock } from "@/divextypes/types";
import { AddStockDialog } from "./add-stock-dialog";

interface HistoricalPricing {
  openingPrice: number;
  openingDate: number;
  previousDailyClosingPrice: number;
  closingDate: number;
}

interface HistoricalDividend {
  dividendRate: number;
  exDividendDate: number;
}


interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
}

const tableHeads = [
  { id: "ticker", label: "Ticker" },
  { id: "name", label: "Name" },
  { id: "sector", label: "Sector" },
  { id: "historical.previousDailyClosingPrice", label: "Closing price" },
  { id: "dividend.dividendRate", label: "Dividend Rate" },
  { id: "dividend.dividendYield", label: "Dividend Yield" },
  { id: "dividend.ExDividendDate", label: "Ex Date" },
  { id: "actions", label: "Actions" },
];

export default function StockTable({ stocks, sorting, onSortClick, isLoading }) {
  
  function renderSortIndicator(column: string) {
    if (sorting.column === column) {
      return sorting.direction === "asc" ? (
        <ChevronUp className="inline-block h-4 w-4 ml-1" />
      ) : (
        <ChevronDown className="inline-block h-4 w-4 ml-1" />
      );
    }
    return ""; // No indicator if the column is not currently sorted
  }

  const navigate = useNavigate();

  const skeletonRows = Array.from({ length: 10 });

  function showStockDetails(stock: Stock) {
    navigate("/stocks/" + stock.ticker, { state: { stock } });
  }

  return (
    <>
      <div className="rounded-xl bg-primary-foreground">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              {tableHeads.map((head) => (
                <TableHead
                  key={head.id}
                  id={head.id}
                  className="text-center hover:cursor-pointer"
                  onClick={() => onSortClick(head.id)}
                >
                  {head.label} {renderSortIndicator(head.id)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
          {isLoading ? (
            skeletonRows.map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {tableHeads.map((head) => (
                  <TableCell key={head.id} className={`text-center`} >
                    <div className="h-3-5 bg-gray-600 rounded-md w-3/4 mx-auto animate-pulse"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : stocks.length > 0 ? (
            stocks.map((stock: Stock) => (
              <TableRow
                key={stock.ticker}
                onClick={() => showStockDetails(stock)}
                className="hover:bg-accent cursor-pointer"
              >
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{stock.ticker.slice(0, -3)}</TableCell>
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{stock.name}</TableCell>
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{stock.sector}</TableCell>
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">
                {stock.historicalPricing[stock.historicalPricing.length - 1].previousDailyClosingPrice} {stock.currency}
                </TableCell>
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{stock.dividendRate.toFixed(2)} {stock.currency}</TableCell>
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{(stock.dividendYield * 100).toFixed(2)} %</TableCell>
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">{(new Date(stock.exDividendDate * 1000).getFullYear() >= new Date().getFullYear()) ? new Date(stock.exDividendDate * 1000).toDateString() : "-"}</TableCell>
                <TableCell className="h-4 text-center truncate overflow-hidden whitespace-nowrap">
                  <div onClick={(event) => event.stopPropagation()}>
                    <AddStockDialog stock={stock} />
                    </div>
                </TableCell>
                
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tableHeads.length} className="text-center">
                No stocks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
    </>
  );
}
