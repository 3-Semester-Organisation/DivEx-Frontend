import React, { useState, useEffect } from "react";
import PaginationBar from "../components/divex/PaginationBar";
import { Stock, PaginatedResponse } from "@/divextypes/types";
import StockTable from "@/components/ui/custom/stockTable";
import SearchBar from "@/components/divex/searchBar";
import { fetchPaginatedStocks } from "@/api/stocks";


export default function StocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [originalStocks, setOriginalStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sorting, setSorting] = useState({ column: "", direction: "asc" });
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        async function getPaginatedStocks(pageNumber: number, pageSize: number = 9) {
            try {
                setIsLoading(true);
                const response = await fetchPaginatedStocks(pageNumber, pageSize, sorting);
                const fetchedPage: PaginatedResponse<Stock> = response;
                setStocks(fetchedPage.content);
                setOriginalStocks(fetchedPage.content); // <-- Update originalStocks here
                setTotalPages(fetchedPage.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        getPaginatedStocks(currentPage);
    }, [currentPage, sorting]);



    function handleSortClick(column: string) {
        setSorting((prevSorting) => ({
            column: column,
            direction:
                prevSorting.column === column && prevSorting.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
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

    return (
        <>
            <div className="flex mb-7">
                <h1 className='text-5xl text-start'>Nordic Dividend Stocks</h1>
                {/* <SearchBar placeholder={"Search..."} /> */}
            </div>


            <StockTable
                stocks={stocks}
                sorting={sorting}
                onSortClick={handleSortClick}
                isLoading={isLoading}
            />

            <PaginationBar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    );
}
