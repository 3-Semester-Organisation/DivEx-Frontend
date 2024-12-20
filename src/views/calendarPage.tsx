"use client";

import React, {useEffect} from "react";
import {DividendCalendar} from "@/components/ui/custom/DividendCalendar";
import DividendTable from "@/components/ui/custom/DividendTable";
import {Button} from "@/components/ui/button";
import {checkHttpsErrors} from "@/js/util";
import {fetchStocksForCalendar, fetchStocksByDividendDate, fetchDividendDates} from "@/api/stocks";

import PaginationBar from "@/components/divex/PaginationBar";
import SearchBar from "@/components/divex/searchBar";

const PAGESIZE = 10;

interface Stock {
    ticker: string;
    name: string;
    dividendRate: number;
    exDividendDate: number;
    currency: string;
}

interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
}

const convertUnixToDate = (unix: number) => {
    return new Date(unix * 1000);
};

function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
    const [date, setDate] = React.useState<number | undefined>(undefined);
    const [dividendDates, setDividendDates] = React.useState<number[]>([]);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [dividendData, setDividendData] = React.useState({});
    const [stocks, setStocks] = React.useState<Stock[]>([]);
    const [totalPages, setTotalPages] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState({column: "", direction: "asc"});

    const handleFetch = async (url: string) => {
        try {
            const res = await fetch(url);
            await checkHttpsErrors(res);
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error; // Re-throw the error after logging it
        }
    };

    const handleMonthChange = (month: Date) => {
        setCurrentMonth(month);
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Normalize the selected date to midnight UTC
            const utcDate = new Date(Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            ));
            // Convert to Unix timestamp in seconds
            const unixTimestamp = Math.floor(utcDate.getTime() / 1000);

            setDate(unixTimestamp); // Set `date` as Unix timestamp
            setCurrentPage(0); // Reset to first page on date select
        } else {
            setDate(undefined);
            setCurrentPage(0);
        }
    };

    useEffect(() => {
        const getDividendDates = async () => {
            const dates = await fetchDividendDates();
            try {
                setDividendDates(dates);
            } catch (error) {
                console.error("Error fetching dividend dates:", error);
            }
        }
        getDividendDates();
    }, []);

    useEffect(() => {
        const getStocksByDividendDate = async (date: number) => {

            const res = await fetchStocksByDividendDate(date, currentPage, sorting);
            try {
                const data: PaginatedResponse<Stock> = res;
                setStocks(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching stocks by dividend date", error)
            }
        }
        if (date) {
            getStocksByDividendDate(date);
        }
    }, [date]);


    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);

            const res = await fetchStocksForCalendar(date, currentPage, sorting);

            try {
                const data: PaginatedResponse<Stock> = res;
                setStocks(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching stocks:", error);
                setStocks([]);            // Clear stocks on error
                setTotalPages(1);         // Reset totalPages to 1 on error
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, [date, currentPage, sorting]);


    function handleSortClick(column: string) {
        setSorting((prevSorting) => ({
            column: column,
            direction:
                prevSorting.column === column && prevSorting.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
        setCurrentPage(0); // Reset to first page on sort
        console.log(`Sorting by ${column} in ${sorting.direction === "asc" ? "descending" : "ascending"} order.`);
    }

    const handleReset = () => {
        setDate(undefined); // Reset the date state to undefined
        setCurrentPage(0);  // Optionally reset to the first page

    };

    return (
        <>
            <div className="flex">
                <h1 className="text-5xl ">Dividend Calendar</h1>
                {/* <SearchBar placeholder={"Seach..."} /> */}
            </div>

            <div className="flex flex-row justify-center mt-2">


                <div className="p-6">
                    <div className="max-w-6xl">
                        <>
                            <DividendTable
                                stocks={stocks}
                                sorting={sorting}
                                onSortClick={handleSortClick}
                                isLoading={loading}
                            />
                            <PaginationBar
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </>
                    </div>
                </div>

                <div className="flex flex-row p-6">
                    <div>
                        <DividendCalendar
                            mode="single"
                            selected={convertUnixToDate(date)}
                            onSelect={handleDateSelect}
                            className="rounded-lg bg-primary-foreground"
                            dividendDays={dividendDates}
                            dividendData={dividendData}
                            onMonthChange={handleMonthChange}
                        />
                        <Button
                            id="reset-button"
                            className="flex mt-2 rounded-lg"
                            onClick={() => handleReset()}
                        >
                            Reset
                        </Button>

                    </div>
                </div>
            </div>
        </>
    );
}
