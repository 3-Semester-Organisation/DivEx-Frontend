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

interface HistoricalPricingResponse {
    openingPrice: number;
    openingDate: number;
    previousDailyClosingPrice: number;
    closingDate: number;
  }

interface Stock {
    ticker: string;
    name: string;
    country: string;
    exchange: string;
    currency: string;
    industry: string;
    sector: string;
    historicalPricingResponseList: HistoricalPricingResponse[];
}

interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
}

export default function StocksPaginated() {
    const [stocks, setStocks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currecntPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sorting, setSorting] = useState({ column: "", direction: "asc" });

    useEffect(() => {
        async function fetchPaginatedStocks(pageNumber: number, pageSize: number = 10) {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:8080/api/v1/stocks?page=${pageNumber}&size=${pageSize}&sort=${sorting.column},${sorting.direction}`
                );
                checkHttpsErrors(response);

                const fetchedPage: PaginatedResponse<Stock> = await response.json();
                setStocks(fetchedPage.content);
                console.log(fetchedPage.content)
                setTotalPages(fetchedPage.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPaginatedStocks(currecntPage);
    }, [currecntPage, sorting]);



    function handleSortClick(column: string) {
        setSorting((prevSorting) => ({
            column: column,
            direction:
                prevSorting.column === column && prevSorting.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    }


    function renderSortIndicator(column: string) {
        if (sorting.column === column) {
            return sorting.direction === "asc" ? "▲" : "▼";
        }
        return ""; // No indicator if the column is not currently sorted
    }


    return (
        <>
            <h1 className='text-4xl mb-10'><b>Nordic Dividend Stocks</b></h1>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-slate-900 rounded-xl">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    id="ticker"
                                    className="text-center hover:cursor-pointer"
                                    onClick={() => handleSortClick("ticker")}
                                >
                                    Ticker {renderSortIndicator("ticker")}
                                </TableHead>

                                <TableHead
                                    id="name"
                                    className="text-center hover:cursor-pointer"
                                    onClick={() => handleSortClick("name")}
                                >
                                    Name {renderSortIndicator("name")}
                                </TableHead>

                                <TableHead
                                    id="previousDailyClosingPrice"
                                    className="text-center hover:cursor-pointer"
                                    onClick={() => handleSortClick("previousDailyClosingPrice")}
                                >
                                    Closing price {renderSortIndicator("previousDailyClosingPrice")}
                                </TableHead>

                                <TableHead
                                    id="dividendRate"
                                    className="text-center hover:cursor-pointer"
                                    onClick={() => handleSortClick("dividendDividendRate")}
                                >
                                    Dividend Rate {renderSortIndicator("dividendDividendRate")}
                                </TableHead>

                                <TableHead
                                    id="dividendYield"
                                    className="text-center hover:cursor-pointer"
                                    onClick={() => handleSortClick("dividendDividendYield")}
                                >
                                    Dividend Yield {renderSortIndicator("dividendDividendYield")}
                                </TableHead>

                                <TableHead
                                    id="exDate"
                                    className="text-center hover:cursor-pointer"
                                    onClick={() => handleSortClick("dividendExDividendDate")}
                                >
                                    Ex Date {renderSortIndicator("dividendExDividendDate")}
                                </TableHead>
                            </TableRow>

                        </TableHeader>
                        <TableBody>
                            {stocks.map((stock) => (
                                <TableRow key={stock.ticker}>
                                    <TableCell className="font-medium">{stock.ticker}</TableCell>
                                    <TableCell>{stock.name}</TableCell>
                                    <TableCell>{stock.historicalPricingResponseList[stock.historicalPricingResponseList.length - 1].previousDailyClosingPrice} {stock.currency} </TableCell>
                                    <TableCell>{stock.dividendRate.toFixed(2)} {stock.currency}</TableCell>
                                    <TableCell>{stock.dividendYield.toFixed(2)} {stock.currency}</TableCell>
                                    <TableCell>{(stock.exDividendDate === 0) ? "-" : new Date(stock.exDividendDate * 1000).toDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <PaginationBar
                currecntPage={currecntPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />


        </>
    )
}
