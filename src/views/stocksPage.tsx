
import * as React from "react";
import { useState, useEffect } from "react";
import { checkHttpsErrors } from "@/js/util";
import { useNavigate } from 'react-router-dom';
import PaginationBar from "../components/divex/PaginationBar";

import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";

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

interface HistoricalPricing {
    openingPrice: number;
    openingDate: number;
    previousDailyClosingPrice: number;
    closingDate: number;
}

interface HistoricalDividend {
    dividendRate: number;
    exDividendDate: number
}

interface Stock {
    ticker: string;
    name: string;
    country: string;
    exchange: string;
    currency: string;
    industry: string;
    sector: string;

    historicalPricingResponseList: HistoricalPricing[];

    dividendRate: number;
    dividendYield: number;
    dividendRatio: number;
    exDividendDate: number;

    historicalDividendsResponseList: HistoricalDividend[];
}

interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
}

export default function StocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [originalStocks, setOriginalStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currecntPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sorting, setSorting] = useState({ column: "", direction: "asc" });
    const [searchValue, setSearchValue] = useState("");

    const navigate = useNavigate();

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
                setOriginalStocks(fetchedPage.content); // <-- Update originalStocks here
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
            return sorting.direction === "asc" ? <ChevronUp className="inline-block h-4 w-4" /> : <ChevronDown className="inline-block h-4 w-4" />;
        }
        return ""; // No indicator if the column is not currently sorted
    }


    const filterStocks = (searchValue: string) => {
        if (!searchValue) {
            return originalStocks;
        }

        return originalStocks.filter((stock) => {
            return (
                stock.ticker.toLowerCase().includes(searchValue.toLowerCase()) ||
                stock.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
    };

    useEffect(() => {
        const filteredStocks = filterStocks(searchValue);
        setStocks(filteredStocks);
    }, [searchValue, originalStocks]);



    function showStockDetails(stock: Stock) {
        navigate("/stocks/" + stock.ticker, { state: {stock}});
    }


    return (
        <>
            

            <h1 className='text-5xl mb-10 text-start'>Nordic Dividend Stocks</h1>

            <Input
                id="search"
                placeholder="Search..."
                type="search"
                className="mb-4 w-1/4 border-gray-600 border-2"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="rounded-xl bg-primary-foreground">
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
                                    onClick={() => handleSortClick("historicalPricings.previousDailyClosingPrice")}
                                >
                                    Closing price {renderSortIndicator("historicalPricings.previousDailyClosingPrice")}
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
                                <TableRow
                                    onClick={() => showStockDetails(stock)}
                                    className="hover:cursor-pointer"
                                    key={stock.ticker}>
                                    <TableCell>{stock.ticker}</TableCell>
                                    <TableCell>{stock.name}</TableCell>
                                    <TableCell>{stock.historicalPricingResponseList[stock.historicalPricingResponseList.length - 1].previousDailyClosingPrice} {stock.currency} </TableCell>
                                    <TableCell>{stock.dividendRate.toFixed(2)} {stock.currency}</TableCell>
                                    <TableCell>{(stock.dividendYield * 100).toFixed(2)} %</TableCell>
                                    <TableCell>{(new Date(stock.exDividendDate * 1000).getFullYear() >= new Date().getFullYear()) ? new Date(stock.exDividendDate * 1000).toDateString() : "-"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <PaginationBar
                currentPage={currecntPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    );
}
