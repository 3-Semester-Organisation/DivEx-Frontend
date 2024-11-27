// import React = require("react");
import React, { useState, useEffect } from 'react';
import { checkHttpsErrors } from "@/js/util.js"
import PaginationBar from './PaginationBar';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Stock {
  ticker: string;
  name: string;
  country: string;
  exchange: string;
  currency: string;
  industry: string;
  sector: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
}

const stockss = {
  content: [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      country: "USA",
      exchange: "NASDAQ",
      currency: "DKK",
      industry: "Technology",
      sector: "Consumer Electronics",
      historicalPricingResponseList: [
        {
          openingPrice: 150.0,
          openingDate: "2024-11-01",
          previousDailyClosingPrice: 148.0,
          closingDate: "2024-11-01",
        },
      ],
      dividendRate: 2.5,
      dividendYield: 1.2,
      dividendRatio: 0.6,
      fiveYearAvgDividendYield: 1.1,
      exDividendDate: "2024-01-01",
      historicalDividendsResponseList: [
        {
          dividendRate: 2.0,
          exDividendDate: "2023-01-01",
        },
      ],
    },
    {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      country: "USA",
      exchange: "NASDAQ",
      currency: "SEK",
      industry: "Technology",
      sector: "Internet Services",
      historicalPricingResponseList: [
        {
          openingPrice: 152.1,
          openingDate: "2024-12-02",
          previousDailyClosingPrice: 150.0,
          closingDate: "2024-11-02",
        },
      ],
      dividendRate: 3.0,
      dividendYield: 1.5,
      dividendRatio: 0.7,
      fiveYearAvgDividendYield: 1.3,
      exDividendDate: "2024-02-01",
      historicalDividendsResponseList: [
        {
          dividendRate: 2.1,
          exDividendDate: "2023-02-01",
        },
      ],
    },
  ],
  pageable: {
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
    pageNumber: 0,
    pageSize: 2,
    offset: 0,
    paged: true,
    unpaged: false,
  },
  totalPages: 20,
  totalElements: 2,
  last: false,
  size: 2,
  number: 0,
  sort: {
    sorted: false,
    unsorted: true,
    empty: true,
  },
  first: true,
  numberOfElements: 2,
  empty: false,
};

export default function StocksPaginated() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currecntPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchPaginatedStocks(pageNumber: number) {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/stocks?page=" + pageNumber);
        checkHttpsErrors(response);

        // const fetchedPage: PaginatedResponse<Stock> = await response.json();
        const fetchedPage: PaginatedResponse<Stock> = stockss;
        setStocks(fetchedPage.content);
        setTotalPages(fetchedPage.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPaginatedStocks(currecntPage);
  }, [currecntPage]);

  const stockList = () => {
    return stocks.map((stock) => (
      <li key={stock.ticker}>{stock.ticker + " - " + stock.name}</li>
    ));
  };

    return (
        <>
            <div className='bg-slate-950 rounded-xl'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Ticker</TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Dividend Yield</TableHead>
                            <TableHead className="text-center">Dividend Ratio</TableHead>
                            <TableHead className="text-center">Ex Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stocks.map((stock) => (
                            <TableRow key={stock.ticker}>
                                <TableCell className="font-medium">{stock.ticker}</TableCell>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell>{stock.dividendRate}</TableCell>
                                <TableCell>${stock.dividendYield}</TableCell>
                                <TableCell>{stock.exDividendDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <PaginationBar
                currecntPage={currecntPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />


        </>
    )
}
