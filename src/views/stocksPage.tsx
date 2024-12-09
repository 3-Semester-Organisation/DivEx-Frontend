
import React, { useState, useEffect } from "react";
import { checkHttpsErrors } from "@/js/util";
import { useNavigate } from 'react-router-dom';
import PaginationBar from "../components/divex/PaginationBar";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Stock, PaginatedResponse } from "@/divextypes/types";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import StockTable from "@/components/ui/custom/stockTable";


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
        async function fetchPaginatedStocks(pageNumber: number, pageSize: number = 9) {
            try {
                setIsLoading(true);
                // simulate slow network
                await new Promise((resolve) => setTimeout(resolve, 1000));
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
        navigate("/stocks/" + stock.ticker, { state: { stock } });
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

            <StockTable
                stocks={stocks}
                sorting={sorting}
                onSortClick={handleSortClick}
                isLoading={isLoading}
            />

            <PaginationBar
                currentPage={currecntPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    );
}
